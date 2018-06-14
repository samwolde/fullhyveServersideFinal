import {DB} from '../db/db';
import {TeamConst,UserConst,AnnouncementConst} from '../constants/constant';

export class UserDb{
    static getByUserName(userName:any){
        return DB.User.findOne({
            where:{
                userName:userName
            }
        })
    }

    static getUser(userId:any){
        return DB.User.findById(userId,{
            include:[DB.Skill]
        });
    }



    // manage user
    static newUser(userData:any){
        return DB.User.create(userData);
    }

    static modifyUser(userId:any, userData:any){
        return new Promise((resolve, reject)=>{
            return DB.Skill.destroy({
                where:{
                    userId:userId
                }
            }).then(()=>{
                return DB.User.update(userData,{
                    where:{
                        id:userId
                    }
                })
            })

            .then(()=>{
                return DB.Skill.bulkCreate(userData.skills);
            })

            .then(()=>{
                resolve();
            })
        })
    }

    static setUserImage(userId:any, imageUrl:any){
        return DB.User.update({
            imageUrl:imageUrl,
        },{
            where:{
                id:userId
            }
        })
    }

    static addFriend(userId:any, friendId:any){
        return DB.Contact.create({
            userId:userId,
            friendId:friendId
        })
    }

    static replyFriendRequest(requestId:any, decision:any){
        return DB.Contact.update({
            request:decision,
            seen:true
        },{
            where:{
                id:requestId
            }
        })
    }

    static logout(userId:any){
        return DB.UserLog.update({
            logOutTime:new Date()
        },{
            where:{
                userId:userId
            }
        })
    }

    static getUnseenFriendRequests(userId:any){
        return DB.Contact.findAll({
            where:{
                friendId:userId,
                seen:false,
                request:UserConst.REQUEST.UNDECIDED
            }
        })
    }

    static getSenders(userIds:any){
        return DB.User.findAll({
            where:{
                id:{
                    in:userIds
                }
            }
        })
    }


    // search

    static searchFriends(){

    }

    static searchNonFriends(){
        
    }


    // authorization
    static checkFriendRequestReceiver(userId:number, requestId:number){
        return DB.Contact.findOne({
            where:{
                id:requestId,
                friendId:userId
            }
        })
    }
}