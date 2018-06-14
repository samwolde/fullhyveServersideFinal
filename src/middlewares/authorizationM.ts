import * as express from 'express';
import { ChatS } from '../models/services/chatServices';
import { TeamS } from '../models/services/teamServices';
import { ProjectS } from '../models/services/projectServices';
import {Validation} from '../models/util/validate';
import { UserS } from '../models/services/userServices';

export class Authorization{
    // verify if the user is the recipient of the friend request
    static verifyFriendRequestReceiver(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let requestId:number = req.validData.requestId;

        UserS.checkFriendRequestReceiver(userId, requestId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        }) 
    }

    // ============================================================================================

    // chat
    static verifyFriendship(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let friendId:number = req.validData.friendId;

        ChatS.checkFriendship(userId,friendId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyMessageSender(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let messageId:number = req.validData.messageId;

        ChatS.checkMessageSender(userId,messageId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyMessageReceiver(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let contactId:number = req.validData.contactId;
        let messageId:number = req.validData.messageId;

        Promise.all([ChatS.checkMessageSender(userId,messageId), ChatS.checkMessageRecSend(contactId,messageId)])
        
        .then((result:any)=>{
            if(!result[0] || result[1]){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyMessageRecSend(req:any, res:express.Response, next:express.NextFunction){
        let contactId:number = req.validData.contactId;
        let messageId:number = req.validData.messageId;

        ChatS.checkMessageRecSend(contactId, messageId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    

    // teams
    static verifyTeamLeadership(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let teamId:number = req.validData.teamId;

        TeamS.checkTeamLeadership(userId,teamId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyTeamMembership(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let teamId:number = req.validData.teamId;

        TeamS.checkTeamMembership(userId,teamId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyAnnouncementOrReplyOwnership(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let announcementId:number = req.validData.annId;

        TeamS.checkAnnouncementOrReplyOwnership(userId,announcementId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // verify if the user is the recipient of the team join request
    static verifyTeamJoinRequestReceiver(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let requestId:number = req.validData.requestId;

        TeamS.checkTeamJoinRequestReceiver(userId, requestId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // project
    static verifyProjectLeadership(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let projectId:number = req.validData.projectId;

        ProjectS.checkProjectLeadership(userId, projectId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    static verifyProjectContributor(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let projectId:number = req.validData.projectId;

        ProjectS.checkContributor(userId, projectId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // verify if the user is the recipient of the individual project join request
    static verifyIndividualContributorRequestReceiver(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let requestId:number = req.validData.requestId;

        ProjectS.checkIndividualContributorRequestReceiever(userId, requestId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // verify if the user is the leader of the recipient team of the team project join request
    static verifyTeamContributorRequestReceiver(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let teamId:number = req.validData.teamId;
        let requestId:number = req.validData.requestId;

        ProjectS.checkTeamContributorRequestReceiever(userId, teamId, requestId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // verify if a task is assigned to a user
    static verifyTaskAssignee(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let taskId:number = req.validData.taskId;

        ProjectS.checkTaskAssignee(userId, taskId)
        
        .then((status:boolean)=>{
            if(status){
                next();
            } else{
                res.status(401).send();
            }
        })
    }

    // verify if a task is assigned to a user
    static verifyTaskAssignable(req:any, res:express.Response, next:express.NextFunction){
        let userId:number = req.thisUser.id;
        let assigneeId:number = req.validData.assigneeId;
        let teamId:number = req.validData.teamId;
        let projectId:number = req.validData.projectId;

        Promise.all([ProjectS.checkProjectLeadership(userId,projectId), ProjectS.checkTeamContributor(teamId, projectId), TeamS.checkTeamMembership(assigneeId, teamId)])
        
        .then((result:any)=>{
            if(result[0] && result[1] && result[2]){
                next();
            } else{
                res.status(401).send();
            }
        })
    }
}