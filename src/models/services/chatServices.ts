import * as express from "express";
import { DB } from "../db/db";
import * as bodyParser from "body-parser";

import { IFriendChat, IMessageFriend, IContact, IUser } from "../models/interfaces";
import {User, Contact, ChatMessage, Message} from '../models/serviceValues';
import { UtilMethods } from '../util/util';
import {UserConst} from '../constants/constant';
import {ChatDb} from '../db/chatDb';
import { request } from "https";


export class ChatS{
    static getContactId(userId:number, friendId:number,request:string=''):Promise<any>{
        return new Promise((resolve, reject)=>{
            ChatDb.getContactId(userId, [friendId], request)
            
            .then((contacts:any)=>{
                if(contacts.length>0){
                    resolve(contacts[0].id);
                } else{
                    resolve(null);
                }
            })
        }); 
    }

    static getContactIds(userId:number, friendIds:number[],request:string=''):Promise<number[]>{
        return new Promise((resolve, reject)=>{
            let contactIds:number[] = [];
            ChatDb.getContactId(userId, friendIds, request)
            
            .then((contacts:any)=>{
                if(contacts.length>0){
                    for(let contact of contacts){
                        contactIds.push(contact.id);
                    }
                    resolve(contactIds);
                } else{
                    resolve([]);
                }
            })
        }); 
    }

    static getContact(userId:number, friendId:number,request:string=''):Promise<any>{
        return DB.Contact.findAll({
            where:
                DB.Sequelize.or(
                    DB.Sequelize.and({
                        userId:userId,
                        friendId:friendId,
                        
                },DB.Sequelize.or({
                    request:UserConst.REQUEST.ACCEPTED
                },{
                    request:{
                        like:request==''?'%%':`%${request}%`
                    }
                })),
                    DB.Sequelize.and({
                        userId:friendId,
                        friendId:userId,
                    },
                    DB.Sequelize.or({
                        request:UserConst.REQUEST.ACCEPTED
                    },{
                        request:{
                            like:request==''?'%%':`%${request}%`
                        }
                    }))
                )
        })
    }

    static getContactIdFromMessageId(messageId:number):Promise<number>{
        return new Promise((resolve, reject)=>{
            DB.Message.findById(messageId)
            .then((message:any)=>{
                if(message){
                    resolve(message.contactId);
                }
                reject(404);
            });
        });
    }
    
    static getFriendLastSeenTime(friendId:number){
        return new Promise((resolve, reject)=>{
            ChatDb.getLastSeenTime(friendId)

            .then((result:any)=>{
                if(result){
                    resolve({online:true, timestamp:result.logOutTime});
                } else{
                    resolve({online:false, timestamp:result.logOutTime});
                }
            })
        })
    }

    static getLastOnline(friendId:number):Promise<string>{
        return new Promise((resolve, reject)=>{
            DB.UserLog.findOne({
                where:{
                    userId:friendId,
                    logOutTime:null
                }
            })
            .then((log:any)=>{
                if(log){
                    if(log.logOutTime != null){
                        let now:any = new Date();
                        let logOutTime:any = new Date(log.logOutTime);
                        let timeDiff = (now - logOutTime)/1000; //in seconds
                        
                        if(timeDiff % 60 > 0){
                            let min = timeDiff % 60;
                            if(min >= 60){
                                let hr = min % 60;
        
                                if(hr > 24){
                                    let days = hr % 24;
        
                                    if(days > 30){
                                        resolve(`${logOutTime.getDate()}/${logOutTime.getMonth()+1}/${logOutTime.getFullYear()}`);
                                    } else{
                                        resolve(`${Math.floor(days)} ${Math.floor(days)<=1?"day":"days"}`);
                                    }
    
    
                                } else{
                                    resolve(`${Math.floor(hr)} ${Math.floor(hr)<=1?"hour":"hours"}`);
                                }
                            } else{
                                resolve(`${Math.floor(min)} ${Math.floor(min)<=1?"minute":"minutes"}`);
                            }
                        } else{
                            resolve("just now");
                        }
                    } else{
                        resolve("online");
                    }
                } else{
                    resolve("long time");
                }
            });
        });
    }

    static getMessages(userId:number, contactIds:number[], seen:boolean=true,lastMsgId=0):Promise<Message[]>{
        return new Promise((resolve, reject)=>{
            ChatDb.getMessages(userId,contactIds,seen,lastMsgId)
            
            .then((msgs:any)=>{
                msgs = UtilMethods.getMessagesAttr(msgs, userId);
                resolve(msgs);
            })
        })
    }

    static getChatMessages(userId:number, friendId:number, offset:number=0, limit:number=UserConst.USERS_SEARCH_LIMIT, seen:boolean=true,lastMsgId=0){
        return new Promise((resolve, reject)=>{
            let messagesReturn = {messages:[],count:0};
            ChatS.getContactId(userId,friendId,UserConst.REQUEST.ACCEPTED)

            .then((contactId:number)=>{
                return ChatDb.getMessages(userId,[contactId],seen,lastMsgId);
            })
            
            .then((msgs:any)=>{
                messagesReturn = UtilMethods.sliceCustom({messages:msgs,count:0},["messages"],offset,limit);
                messagesReturn.messages = UtilMethods.getMessagesAttr(messagesReturn.messages, userId);
                resolve(messagesReturn);
            })
        })
    }

    static countUnseenMessages(friendId:number, contactId:number):Promise<number>{
        return new Promise((resolve, reject)=>{
            DB.Message.count({
                where:{
                    senderId:friendId,
                    ContactId:contactId,
                    seen:false
                }
            }).then((unseenMessages:number)=>resolve(unseenMessages))
            .catch((err:Error)=>reject(500));
        });
    }
    
    static getUsersIdList(userId:number,request:string[]=[UserConst.REQUEST.ACCEPTED]):Promise<number[]>{
        return new Promise((resolve, reject)=>{
            return DB.Contact.findAll({
                where:DB.Sequelize.and(
                    DB.Sequelize.or({
                        userId:userId,
                    },{
                        friendId:userId,
                    }),{
                        request:{
                            in:request
                        }
                    }
                )
                
            }).then((friends:any)=>{
                let friendsList = [];
                if(friends.length>0){
                    for(let friend of friends){
                        if(friend.get('userId')!=userId){
                            friendsList.push(friend.get('userId'));
                        } else {
                            friendsList.push(friend.get('friendId'));
                        }
                    }  
                    
                    resolve(friendsList);
                } else{
                    resolve([]);
                }
                
            })
        });
    }

    static getFriendsInfo(friends:any, userId:number):Promise<Contact[]>{
        return new Promise((resolve, reject)=>{
            let returnFriends:IFriendChat[] = [];
            for(let friend of friends){
                ChatS.getContactId(userId, friend.id)

                .then((contactId:number)=>{
                    return Promise.all([ChatS.countUnseenMessages(friend.id, contactId), ChatS.getMessages(userId, [contactId]), ChatS.getLastOnline(friend.id)]);
                }) 
                
                .then((result:any)=>{
                    let unseenMessages:number = result[0];
                    let message:Message[] = result[1];
                    let lastOnline:string = result[2]; 

                    friend.online = lastOnline=='online'?true:false;
                    friend.lastOnline = lastOnline;
                    friend.unseenMessages = unseenMessages;
                    friend.lastMessage = message.length>0?message[0]:null;
                })
                
                .then(()=>{
                    if(friends.indexOf(friend)==friends.length-1){
                        resolve(friends);
                    }
                })
            }
            if(friends.length<1){
                resolve([]);
            }
        });
    }

    static getFriendsFromDb(friendsList:number[], name?:string):Promise<User[]>{
        return new Promise((resolve, reject)=>{
            if(name && name.trim()!=''){
                let nameCriteria = name.trim().split(' ');
                let firstName = nameCriteria.length>0?nameCriteria[0]:"";
                let lastName = nameCriteria.length>1?nameCriteria[1]:"";
                if(nameCriteria.length>2){
                    resolve([]);
                }
                if(nameCriteria.length==1){
                    nameCriteria = [nameCriteria[0], nameCriteria[0]];
                    DB.User.findAll({
                        attributes:['id','firstName','lastName','image','title', 'description'],
                        where:DB.Sequelize.and([
                            {
                                id:friendsList
                            },
                            DB.Sequelize.or({
                                firstName:{
                                    like:`%${firstName}%`
                                },
                            },{
                                lastName:{
                                    like:`%${lastName}%`
                                }
                            })
                        ]),
                        include:[DB.Skill]
                    })
                    .then((friends:any)=>{
                        let formatedFriends:User[] = UtilMethods.getUserAttr(friends);
                        resolve(formatedFriends);
                    })
                    .catch((err:any)=>{
                        reject(500);
                    })
                } else{
                    DB.User.findAll({
                        attributes:['id','firstName','lastName','image','title', 'description'],
                        where:{
                                id:friendsList,
                                firstName:{
                                    like:`%${firstName}%`
                                },
                                lastName:{
                                    like:`%${lastName}%`
                                }
                        },
                        include:[DB.Skill]
                    })
                    .then((friends:any)=>{
                        let formatedFriends = UtilMethods.getUserAttr(friends);
                        resolve(formatedFriends);
                    })
                    .catch((err:any)=>{
                        reject(500);
                    })
                }
                
            } else{
                DB.User.findAll({
                    attributes:['id','firstName','lastName','image','title', 'description'],
                    where:{
                        id:{
                            in:friendsList
                        }
                    }, 
                    include:[DB.Skill]
                })
                .then((friends:any)=>{
                    let formatedFriends = UtilMethods.getUserAttr(friends);
                    resolve(formatedFriends);
                })
                .catch((err:any)=>{
                    reject(500);
                })
            }
        });
    }

    static getUsers(userId:number, request:string[]=[UserConst.REQUEST.ACCEPTED], name?:string):Promise<any[]>{
        return new Promise((resolve, reject)=>{
            return ChatS.getUsersIdList(userId, request)

            .then((friendsList:any)=>{     // if user doesn't have friends no need to go further
                if(friendsList.length>0){
                    return ChatS.getFriendsFromDb(friendsList, name);  
                } else{
                    return []; 
                }
                 
            })

            .then((friends:User[])=>{   // if search result with name is null no need to go further
                resolve(friends);
            })
            
            .catch((err:any)=>{
                reject(err)
            });
        });
    }

    static getChatFriends(userId:number, offset:number=0, limit:number=UserConst.USERS_SEARCH_LIMIT):Promise<any>{
        return new Promise((resolve, reject)=>{
            let friendsReturn = {friends:[],count:0};
            return ChatS.getUsers(userId)

            .then((friends:User[])=>{
                if(friends.length>0){
                    return ChatS.getFriendsInfo(friends, userId);
                }
                return [];
            })

            .then((friends:Contact[])=>{
                friendsReturn = UtilMethods.sliceCustom({friends:friends,count:0},["friends"],offset,limit);
                resolve(friendsReturn);
            })
        });
    }

    static searchUsers(userId:any, name:string, offset:number=0, limit:number=UserConst.USERS_SEARCH_LIMIT){
        let nameCriteria = name.trim().split(' ');
        
        let usersReturn:any = {
            users:[],
            count:0
        };

        return new Promise((resolve, reject)=>{
            ChatS.getUsers(userId, [UserConst.REQUEST.UNDECIDED, UserConst.REQUEST.REJECTED], name)

            .then((users:any)=>{
                usersReturn.users = users;

                usersReturn = UtilMethods.sliceCustom(usersReturn,["users"],offset, limit);
                resolve(usersReturn);
            })
        })
    }

    static sendMessage(contactIds:number[], senderId:number, content:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            let messageIds:any = [];
            for(let i=0;i<contactIds.length;i++){
                DB.Message.create({
                    message:content,
                    senderId:senderId,
                    contactId:contactIds[i]
                })
                
                .then((message:any)=>{
                    messageIds.push({
                        contactId:contactIds[i],
                        messageId:message.id
                    });

                    if(i +1 >= contactIds.length){
                        resolve(messageIds);    
                    }
                })
                
            }
        });
    }

    static sendChatMessage(userId:number, friendId:number, message:string):Promise<any>{
        return new Promise((resolve, reject)=>{
            ChatS.getContactId(userId, friendId)

            .then((contactId)=>{
                
                return ChatS.sendMessage([contactId], userId, message);
            })

            .then((result)=>{
                console.log("result sent");
                if(result){
                    console.log(result);
                    resolve({msgId: result[0].messageId});
                }
                resolve(null);
            })
        });
    }

    static updateSeen(userId:number, contactId:number, messageId:number):Promise<number>{
        return new Promise((resolve, reject)=>{
            DB.Message.update({
                seen:true
            },{
                where:{
                    id:{
                        lte:messageId
                    },
                    contactId:contactId,
                    senderId:{
                        ne:userId
                    }
                }
            }).then(()=>{
                resolve(200);
            }).catch(()=>{
                reject(500);
            });
        });
    }

    static editMessage(messageId:number, content:string):Promise<number>{
        return new Promise((resolve,reject)=>{
            console.log("called" + content);
            DB.Message.update({
                message:content
            },{
                where:{
                    id:messageId
                }
            }).then(()=>{
                resolve(200);
            }).catch(()=>{
                reject(500);
            });
        });
    }

    static deleteMessage(messageId:number):Promise<number>{
        return new Promise((resolve,reject)=>{
            DB.Message.destroy({
                where:{
                    id:messageId
                }
            }).then(()=>{
                resolve(200);
            }).catch(()=>{
                reject(500);
            });
        });
    }

    static forwardMessage(userId:number, friendIds:number[], messageId:number):Promise<any>{
        return new Promise((resolve, reject)=>{
            let contactIds1:number[] = []; 
            ChatS.getContactIds(userId, friendIds)

            .then((contactIds)=>{
                contactIds1 = contactIds;
                return DB.Message.findById(messageId);
            })
            
            .then((msg:any)=>{
                if(msg){
                    let content = msg.get('message');
                    return ChatS.sendMessage(contactIds1, userId, content);
                } else{
                    reject(404);
                }
            })

            .then((messageIds)=>{
                resolve({messageId:messageId});
            })
        });
    }




    // managing methods

    static getUnseenReceivedMessages(userId:any){
        return new Promise((resolve, reject)=>{
            ChatS.getUsersIdList(userId)

            .then((friendsId:any)=>{
                if(friendsId.length>0){
                    return ChatDb.getMessageNotification(friendsId);
                }
                return [];
            })

            .then((messages:any)=>{
                let messagesReturn:any = [];
                if(messages.length>0){
                    messagesReturn = UtilMethods.getUnseenMessagesAttr(messages);
                }
                resolve(messagesReturn);
            })
        })
    }









    // authorization
    static checkFriendship(userId:number, friendId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ChatDb.checkFriendship(userId, friendId)

            .then((contact:any)=>{
                if(contact){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkMessageSender(userId:number, messageId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ChatDb.checkMessageSender(userId, messageId)

            .then((message:any)=>{
                if(message){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkMessageRecSend(contactId:number, messageId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ChatDb.checkMessageRecSend(contactId, messageId)

            .then((message:any)=>{
                if(message){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }
}

