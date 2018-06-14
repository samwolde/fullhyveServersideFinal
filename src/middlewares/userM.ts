import * as express from "express";
import {UserS} from "../models/services/userServices";

import { UserConst } from "../models/constants/constant";
import { TeamS } from "../models/services/teamServices";
import { ProjectS } from "../models/services/projectServices";
import { ChatS } from "../models/services/chatServices";
import { UtilMethods } from "../models/util/util";
import { Authentication } from "./authenticationM";

export class UserM{
    public static login(req:any, callback:any){
        callback({success:true, code:200, message:null,data: null});
    }

    public static checkUsername(req:any, callback:any){
        let userName = req.validData.userName;
        
        UserS.isUserNameAvailable(userName)
        
        .then((status)=>{
            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((status)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static getProfile(req:any, callback:any){
        let userId = req.thisUser.id;
        console.log(userId);
        
        UserS.getUserProfile(userId)
        
        .then((profile)=>{
            callback({success:true, code:200, message:null,data: profile});
        })
        
        .catch((errStatus)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static getUserProfile(req:any, callback:any){
        let userId = req.thisUser.id;
        let friendId = req.validData.friendId;
        let request:any = null;
        ChatS.getContact(userId, friendId)
        
        .then((contacts:any):any=>{
            if(contacts.length>0){
                request = contacts[0].request;
            }

            return UserS.getUserProfile(friendId);
        })
        
        .then((profile:any)=>{
            let userR = null;
            if(profile){
                userR = {
                    user:profile,
                    friendshipStatus:request?(request=='Undecided'?0:(request=='Accepted'?1:2)):3
                }
            }

            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((errStatus:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static register(req:any, callback:any){
        let user = req.validData;
        
        Authentication.hashPassword(req.validData.password)

        .then((hashedPassword:any)=>{
            req.validData.password = hashedPassword;
            return UserS.addUser(user);
        })
        
        .then(()=>{
            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((errStatus)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static editProfile(req:any, callback:any){
        let user = req.validData;
        let userId = req.thisUser.id;

        UserS.editUser(userId,user)
        
        .then(()=>{
            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((errStatus)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }
    
    public static updateProfileImage(req:any, callback:any){
        let userId = req.thisUser.id;
        let imageUrl = req.file.filename;

        UserS.setUserImage(userId,imageUrl)
        
        .then(()=>{
            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((errStatus:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static addFriend(req:any, callback:any){
        let userId = req.thisUser.id;
        let friendId = req.validData.friendId;

        UserS.addFriend(userId,friendId)
        
        .then(()=>{
            callback({success:true, code:200, message:null,data: null});
        })
        
        .catch((errStatus:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static replyFriendRequest(req:any, callback:any){
        let accepted:boolean = req.validData.accepted;
        let decision:string = UserConst.REQUEST.REJECTED;
        let requestId:number = req.validData.requestId;

        if(accepted){
            decision = UserConst.REQUEST.ACCEPTED;
        } else{
            decision = UserConst.REQUEST.REJECTED;
        }
        
        UserS.replyFriendRequest(requestId,decision)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});  
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static unfriend(req:any, callback:any){
        let friendId:number = req.validData.friendId;
        let userId:number = req.thisUser.id;
        
        ChatS.getContactId(userId, friendId)

        .then((contactId:any)=>{
            return UserS.replyFriendRequest(contactId, UserConst.REQUEST.REMOVED);
        })

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});  
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static logout(req:any, callback:any){
        let userId:number = req.thisUser.id;

        UserS.logout(userId)
        
        .then(()=>{
            callback({success:true, code:200, message:null,data: null});  
        })
        
        .catch((errStatus:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static getNotifications(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;

        let notifications:any = {
            notifications:[],
            count:0
        };

        UserS.getUnseenFriendRequests(userId)

        .then((friendRequests:any)=>{
            notifications.notifications = notifications.notifications.concat(friendRequests);

            return TeamS.getUnseenTeamJoinRequests(userId);
        })

        .then((teamJoinRequests:any)=>{
            notifications.notifications = notifications.notifications.concat(teamJoinRequests);

            return ProjectS.getUnseenTeamContributorJoinRequest(userId);
        })

        .then((teamContriubtorJoinRequests:any)=>{
            notifications.notifications = notifications.notifications.concat(teamContriubtorJoinRequests);

            return ProjectS.getUnseenIndividualContributorJoinRequest(userId);
        })

        .then((individualContributorJoinRequests:any)=>{
            notifications.notifications = notifications.notifications.concat(individualContributorJoinRequests);

            return ProjectS.getUnseenTasks(userId);
        })
    
        .then((unseenTasks:any)=>{
            notifications.notifications = notifications.notifications.concat(unseenTasks);
            
            notifications = UtilMethods.sliceCustom(notifications,["notifications"],offset, limit);
            console.log(notifications);
            callback({success:true, code:200, message:null,data: notifications});  
        })

        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        })
    }

}