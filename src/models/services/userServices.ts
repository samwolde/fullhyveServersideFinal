import {User, Identity, NotificationType} from "../models/serviceValues";
import {DB} from '../db/db';
import {UserDb} from '../db/userDb';
import { UtilMethods } from "../util/util";

export class UserS{
    static isUserNameAvailable(userName:string):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            UserDb.getByUserName(userName)

            .then((user:any)=>{
                if(user){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })

            .catch((err:any)=>{
                reject(500);
            })
        });
    }

    static getUserProfile(userId:any):Promise<Identity>{
        return new Promise((resolve, reject)=>{
            UserDb.getUser(userId)

            .then((user:any)=>{
                let userReturn:any = {};
                if(user){
                    userReturn = UtilMethods.getUserProfileAttr([user])[0];
                }
                resolve(userReturn);
            })
        })
    }

    static getUnseenFriendRequests(userId:any){
        return new Promise((resolve, reject)=>{
            let friendRequestsReturn:any = [];
            let friendsId:any = {};
            UserDb.getUnseenFriendRequests(userId)

            .then((contacts:any)=>{
                if(contacts.length>0){
                    for(let contact of contacts){
                        friendsId[contact.userId] = contact.id;
                    }
                    return UserDb.getSenders(Object.keys(friendsId));
                }
                return [];
            })

            .then((senders:any)=>{
                if(senders.length>0){
                    friendRequestsReturn = UtilMethods.getFriendRequestAttr(senders, friendsId);
                }
                resolve(friendRequestsReturn);
            })
        })
    }


    // managing methods
    static addUser(user:any):Promise<number>{
        return new Promise((resolve, reject)=>{
            UserDb.newUser(user)

            .then(()=>{
                resolve(201);
            })

            .catch((err:any)=>{
                reject(500);
            })
        });
    }

    static addFriend(userId:any, friendId:any){
        return UserDb.addFriend(userId, friendId);
    }

    static replyFriendRequest(reqeustId:any, decision:string){
        return UserDb.replyFriendRequest(reqeustId, decision);
    }

    static editUser(userId:any, user:any):Promise<number>{
        return new Promise((resolve, reject)=>{
            UserDb.modifyUser(userId, user)

            .then(()=>{
                resolve(200);
            })

            .catch((err:any)=>{
                reject(500);
            })
        });
    }

    static setUserImage(userId:any, imageUrl:any){
        return UserDb.setUserImage(userId, imageUrl);
    }
    
    static logout(userId:any){
        return UserDb.logout(userId);
    }



    // authorization

    static checkFriendRequestReceiver(userId:number, requestId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            UserDb.checkFriendRequestReceiver(userId, requestId)

            .then((request:any)=>{
                if(request){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }


}