import { Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import { reject } from 'bluebird';
import { Authentication } from '../middlewares/authenticationM';
import { Validation } from '../models/util/validate';
import { ChatS } from '../models/services/chatServices';
import { requiredAuthorization } from '../models/util/authorizationInfo';
import { ChatM } from '../middlewares/chatM';
import { UserM } from '../middlewares/userM';
import { TeamM } from '../middlewares/teamM';
import { ProjectM } from '../middlewares/projectM';
import { ExcludeAuthentication } from '../models/constants/constant';
import { UserS } from '../models/services/userServices';

export class RealtimeServer {
    private io: SocketIO.Server;
    private socket:any = {
        '/chat':{
            server:null,
            onlineUsers:{}
        }
    }

    constructor(server:Server) {
        this.initiateSockets(server);
        this.listen();
    }

    private initiateSockets(server:Server): void {
        this.io = socketIo(server);
    }

    private parseData(data:any){
        if(typeof data[1] == 'string'){
            data[1] = JSON.parse(data[1]);
        } 
        return data;
    }

    private authenticateRequest(socket:any, data:any, next:any){
        data = this.parseData(data); 
        
        console.log(socket.hasOwnProperty('thisUser'));
        console.log(data);       
        if(ExcludeAuthentication.hasOwnProperty(data[0])){
            console.log("Exc");
            next();
            
        } else{
            console.log("inc");
            if(socket.hasOwnProperty('thisUser')){
                data[1].thisUser = socket.thisUser;
                next();
            } else{
                if(data[1].hasOwnProperty('token')){
                    let tokens:string = data[1].token.trim().split(' ');
                    
                    if(tokens.length<=1){
                        socket.emit('authenticationError', {success:false, code:401, message:"Invalid token", data:null});
                    } else{                                
                        Authentication.verifyTokenReal(tokens[1])

                        .then((response:any)=>{
                            if(response){
                                socket.thisUser = response.thisUser;
                                data[1].thisUser = socket.thisUser;
                                next();
                            } else{
                                socket.emit('authenticationError', {success:false, code:401, message:"Invalid token", data:null});
                            }
                        })
                    }
                    
                    
                } else{
                    socket.emit('authenticationError', {success:false, code:401, message:"Invalid token", data:null});
                }
            }
        }
    }

    private validateRequest(socket:any, data:any, next:any){
        console.log("To validate");
        console.log(data);
        if(Object.keys(data[1].reqData).length>0){
            console.log("ph1");
            let result = Validation.validateReal(data[0], data[1].reqData);
            if(result.status){
                data[1].validData = result.data.validData;
                next();
            } else{
                console.log("Error");
                console.log(result);
                socket.emit('validationError', {success:false, code:400, message:"Invalid input", data:result.data});
            }
        } else{
            next();
        }
        //next();
        console.log("Validated");
    }

    private checkAuthority(socket:any, data:any, next:any){
        // if(requiredAuthorization.hasOwnProperty(data[0])){
        //     let authorized:boolean = false;
        //     for(let auth of requiredAuthorization[data[0]]){
        //         if(!auth(data[1])){
        //             socket.edmit("authorizationError", {success:false, code:403, message:"Unauthorized access", data:null});
        //         }
        //     }
        // }
        console.log('Authorized');
        next();
    }

    private listen(): void {
        this.socket['/chat'].server = this.io.of('/chat');

        this.socket['/chat'].server.on('connect', (socket: any) => {
            console.log("Connected");
            //let v:SocketIO.Socket;


            // chat   =================================================
            // authenticate user when socket is created
            socket.use((data:any, next:any)=>{ 
                this.authenticateRequest(socket, data, next);
            })
            
            // validate data in every request
            .use((data:any, next:any)=>{
                this.validateRequest(socket, data, next);
            })

            .use((data:any, next:any)=>{
                this.checkAuthority(socket, data, next);
            })
            
            // account router

            .on('signup', UserM.register)

            .on('checkUserName', UserM.checkUsername)

            .on('signin', Authentication.createToken)

            .on('signout', UserM.logout)

            .on('editProfile', UserM.editProfile)

            .on('addFriend', UserM.addFriend)

            .on('replyFriendRequest', UserM.replyFriendRequest)

            .on('unfriend', UserM.unfriend)

            .on('getNotifications', UserM.getNotifications)

            .on('getProfile', UserM.getProfile)

            .on('getUserProfile', UserM.getUserProfile)


            // chat router
            .on('getMessages', ChatM.getMessages)

            .on('getFriends', ChatM.getFriends)

            .on('searchUsers', ChatM.searchUsers)

            .on('updateMessageSeen', ChatM.updateSeen)

            .on('sendMessage', ChatM.sendMessage)

            .on('editMessage', ChatM.editMessage)

            .on('forwardMessage', ChatM.forwardMessage)

            .on('deleteMessage', ChatM.deleteMessage)

            .on('getFriendLastSeenTime', ChatM.getFriendLastSeenTime)

    
            // team router
            .on('getMyTeams', TeamM.getMyTeams)

            .on('searchTeams', TeamM.searchTeams)

            .on('getTeamMembers', TeamM.getTeamMembers)

            .on('getTeamProjects', TeamM.getTeamProjects)

            .on('getTeamAnnouncements', TeamM.getTeamAnnouncement)

            .on('announce', TeamM.announceAndReply)

            .on('reply', TeamM.announceAndReply)

            .on('updateAnnouncementSeen', TeamM.updateAnnouncementSeen)

            .on('newTeam', TeamM.addNewTeam)

            .on('addMembers', TeamM.addTeamMember)

            .on('removeMembers', TeamM.removeTeamMember)

            .on('replyTeamJoinRequest', TeamM.replyTeamJoinRequest)

            .on('editAnnouncementReply', TeamM.editAnnouncementReply)

            .on('deleteAnnouncement', TeamM.deleteAnnouncement)

            .on('deleteReply', TeamM.deleteReply)

            .on('editTeamProfile', TeamM.editTeamProfile)

            .on('deleteTeam', TeamM.deleteTeam)

            .on('getMyTeamProfile', TeamM.getTeamProfile)


            // project router

            .on('getMyProjects', ProjectM.getMyProjects)

            .on('searcgProjects', ProjectM.searchProjects)

            .on('getContributors', ProjectM.getContributors)

            .on('getTasksets', ProjectM.getTaskSets)

            .on('getTasks', ProjectM.getTasks)

            .on('newProject', ProjectM.newProject)

            .on('addIndividualContributor', ProjectM.addIndividualContributor)

            .on('addTeamContributor', ProjectM.addTeamContributor)

            .on('replyIndividualContributorJoinRequest', ProjectM.replyIndividualContributorJoinRequest)

            .on('replyTeamContributorJoinRequest', ProjectM.replyTeamContributorJoinRequest)

            .on('newTaskset', ProjectM.newSet)

            .on('deleteTaskset', ProjectM.removeSet)

            .on('newTask', ProjectM.newTask)

            .on('startTask', ProjectM.startTask)

            .on('completeTask', ProjectM.completeTask)

            .on('changeTaskStatus', ProjectM.changeTaskStatus)

            .on('deleteTask', ProjectM.removeTask)

            .on('addContributors', ProjectM.addContributors)

            .on('removeContributors', ProjectM.removeContributors)

            .on('editProjectDetails', ProjectM.editProjectDetails)

            .on('deleteProject', ProjectM.deleteProject)

            .on('getMyProjectProfile', ProjectM.getProjectProfile)

            // ============================================================
            // additional

            

            .on('userConnected', (data:any, callback:any)=>{
                console.log(socket.hasOwnProperty('thisUser'));
                this.socket['/chat'].onlineUsers[data.id] = socket;
                callback({success:true, code:200, message:null,data:null});

                // let userId:any = data.thisUser.id;
                
                // ChatS.getUsersIdList(userId)
                
                // .then((friendsId)=>{
                //     for(let fId of friendsId){
                //         if(this.socket['/chat'].onlineUsers.hasOwnProperty(fId)){
                //             socket.emit('friendConnected', {userId:userId, timestamp:new Date()});
                //         }
                //     }
                    
                //     callback({success:true, code:200, message:null,data: null});
                // });
            })
            
            .on('disconnect', (data:any, callback:any) => {
                console.log("Disconnected");
                if(socket.hasOwnProperty('thisUser')){
                    let userId:any = socket.thisUser.id;
                    
                    UserS.logout(userId)
    
                    .then((status:any)=>{
                        return ChatS.getUsersIdList(userId);
                    })
                    
                    .then((friendsId:any)=>{
                        for(let fId of friendsId){
                            if(this.socket['/chat'].onlineUsers.hasOwnProperty(fId)){
                                socket.emit('friendDisconnected', {userId:userId, timestamp:new Date()});
                            }
                        }
                        
                        //callback({success:true, code:200, message:null,data: null});
                    })    
                }                
            })

            
        });
    }

    static notifyConnected(){

    }
}






































// .on('getOnlineUsers',(data:any)=>{
            //     //console.log(this.socket['/chat'].onlineUsers);
            //     //socket.emit("onlineUsers",this.socket['/chat'].onlineUsers);
            // })

            // .on('socketDetail',(data:any)=>{
            //     console.log(this.socket['/chat'].onlineUsers);
            //     //socket.emit("onlineUsers",this.socket['/chat'].onlineUsers);
            // })

            // .on('join', (data:any) => {
            //     console.log(data);
            //     socket.join(data.room);
            //     this.socket['/chat'].onlineUsers[data.id].join(data.room);
            //     console.log('Users connected');
            // })

            // // .on('sendMessage', function (data:any) {
            // //     console.log(data);
            // //     //data.room = "room-1";
            // //     //socket.to(data.room).emit('receiveMessage',{message:data.message});
            // //     socket.to(data.room).emit('receiveMessage',data.reqData.message);
            // // })




// .on('getMessages', (data:any, callback:any)=>{
//     let userId:number = socket.thisUser.id;
//     let friendId:number = data.validData.friendId;
//     let offset:number = data.validData.offset;
//     let limit:number = data.validData.limit;

//     ChatS.getChatMessages(userId, friendId, offset, limit)

//     .then((result)=>{
//         socket.emit('getMessages', {success:true, code:200, message:null, data:result});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     });                

// })

// .on('getFriends', (data:any, callback:any)=>{
//     let userId:number = socket.thisUser.id;
//     let offset:number = data.validData.offset;
//     let limit:number = data.validData.limit;

//     ChatS.getChatFriends(userId, offset, limit)
    
//     .then((result)=>{
//         socket.emit('getFriends', {success:true, code:200, message:null, data:result});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     });                   
// })

// .on('searchUsers', (data:any, callback:any)=>{
//     let userId:number = socket.thisUser.id;
//     let name:string = data.validData.name;
//     let offset:number = data.validData.offset;
//     let limit:number = data.validData.limit;

//     ChatS.searchUsers(userId,name,offset,limit)
    
//     .then((result)=>{
//         socket.emit('searchUsers', {success:true, code:200, message:null, data:result});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     });  

// })

// .on('updateMessageSeen', (data:any, callback:any)=>{
//     let userId:number = socket.thisUser.id;
//     let lastMessageId:number = data.validData.lastMessageId;

//     ChatS.getContactIdFromMessageId(lastMessageId)
    
//     .then((contactId:number)=>{
//         return ChatS.updateSeen(userId,contactId, lastMessageId);
//     })

//     .then((status)=>{
//         socket.emit('updateMessageSeen', {success:true, code:200, message:null, data:null});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     }); 

// })

// .on('sendMessage', this.check /*(data:any, callback:any)=>{*/
//      //console.log(data);
// //     //this.socket['/chat'].onlineUsers[data.reqData.friendId].emit("receiveMessageR", {success:true, code:200, message:null,data: {id:2, message:data.reqData.message, timestamp:"Old", seen:false, sent:false}})
// //     //callback({id:2,message:"Hello men",timestamp:"Old",seen:false});
// //     //callback({success:true, code:200, message:"Successfully fetched",data: {id:2, message:"Hello men", timestamp:"Old", seen:false, sent:true}});
// //     if(data.checked) callback(data.checked);
// //     // let userId:number = socket.thisUser.id;
// //     // let friendId:number = data.validData.friendId;
// //     // let message:string = data.validData.message;
    
// //     // ChatS.sendChatMessage(userId, friendId, message)

// //     // .then((result)=>{
// //     //     callback({success:true, code:200, message:null, data:result});
// //     //     //socket.emit('sendMessage', {success:true, code:200, message:null, data:result});
// //     // })
// //     // .catch((err)=>{
// //     //     callback({success:false, code:500, message:"Internal server error", data:null});
// //     //     //socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
// //     // });  

// //}
// )

// .on('editMessage', (data:any, callback:any)=>{
//     if(data.checked){
//         callback(data.checked);
//     }
//     let messageId:number = data.validData.messageId;
//     let content:string = data.validData.content;

//     ChatS.editMessage(messageId, content)

//     .then((status)=>{
//         socket.emit('editMessage', {success:true, code:200, message:null, data:null});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     }); 

// })

// .on('forwardMessage', (data:any, callback:any)=>{
//     let userId:number = socket.thisUser.id;
//     let friendIds:number[] = data.validData.friendIds;
//     let messageId:number = data.validData.messageId;

//     ChatS.forwardMessage(userId, friendIds, messageId)

//     .then((result)=>{
//         socket.emit('forwardMessage', {success:true, code:200, message:null, data:result});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     });  

// })

// .on('deleteMessage', (data:any, callback:any)=>{
//     let messageId:number = data.validData.messageId;
    
//     ChatS.deleteMessage(messageId)

//     .then((status)=>{
//         socket.emit('deleteMessage', {success:true, code:200, message:null, data:null});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     }); 

// })

// .on('getFriendLastSeenTime', (data:any, callback:any)=>{
//     let friendId:number = data.validData.friendId;
    
//     ChatS.getFriendLastSeenTime(friendId)

//     .then((result)=>{
//         socket.emit('getFriendLastSeenTime', {success:true, code:200, message:null, data:result});
//     })
//     .catch((err)=>{
//         socket.emit('serverError', {success:false, code:500, message:"Internal server error", data:null});
//     });  

// })
