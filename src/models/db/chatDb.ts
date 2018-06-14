import {DB} from '../db/db';
import { UserConst } from '../constants/constant';

export class ChatDb{
    static getLastSeenTime(friendId:number){
        return DB.UserLog.findOne({
            where:{
                userId:friendId,
                logOutTime:null
            }
        })
    }

    static getContactId(userId:number, friendIds:number[],request:string=''):Promise<any>{
        return DB.Contact.findAll({
            where:
                DB.Sequelize.or(
                    DB.Sequelize.and({
                        userId:userId,
                        friendId:{
                            in:friendIds
                        },
                        
                },DB.Sequelize.or({
                    request:UserConst.REQUEST.ACCEPTED
                },{
                    request:{
                        like:request==''?'%%':`%${request}%`
                    }
                })),
                    DB.Sequelize.and({
                        userId:{
                            in:friendIds
                        },
                        friendId:userId,
                    },
                    DB.Sequelize.or({
                        request:UserConst.REQUEST.ACCEPTED
                    },{
                        request:{
                            like:request==''?'%%':`%${request}%`
                        }
                    }))
                ),
                
        })
    }

    static getMessages(userId:number, contactIds:number[], seen:boolean,lastMsgId:number){
        return DB.Message.findAll({
            where:
                DB.Sequelize.or(
                    DB.Sequelize.and({
                        id:{
                            gt:lastMsgId
                        },
                        contactId:{
                            in:contactIds
                        },
                        seen:false
                    }),
                    DB.Sequelize.and({
                        id:{
                            gt:lastMsgId
                        },
                        contactId:{
                            in:contactIds
                        },
                        seen:seen
                    })
                ),
                order:[['id', 'DESC']],
                attributes:['id','message','seen','senderId','timestamp']
        })
    }


    // message received
    // friend, team, project join request
    // task assignment
    static getMessageNotification(friendsId:any){
        return DB.Message.findAll({
            where:{
                senderId:{
                    in:friendsId
                },
                seen:false
            },
            include:[{
                model:DB.User,
                include:[DB.Skill]
            }]
        })
    }



    // authorization
    static checkFriendship(userId:number, friendId:number){
        return DB.Contact.findOne({
            where:DB.Sequelize.or({
                userId:userId,
                friendId:friendId,
                request:UserConst.REQUEST.ACCEPTED
            },{
                userId:friendId,
                friendId:userId,
                request:UserConst.REQUEST.ACCEPTED
            })
        })
    }

    static checkMessageSender(userId:number, messageId:number){
        return DB.Message.findOne({
            where:{
                id:messageId,
                senderId:userId
            }
        })
    }

    static checkMessageRecSend(contactId:number, messageId:number){
        return DB.Message.findOne({
            where:{
                id:messageId,
                contactId:contactId
            }
        })
    }
}