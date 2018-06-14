import * as express from "express";
import {TeamS} from "../models/services/teamServices";
import { SearchFor } from "../models/models/serviceValues";
import { UserConst } from "../models/constants/constant";

export class TeamM{
    public static getMyTeams(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        TeamS.getMyTeams(userId, offset, limit)
        
        .then((teams)=>{
            callback({success:true, code:200, message:null,data: teams});   
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static searchTeams(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let name:string = req.validData.name;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        TeamS.searchTeams(userId, offset, limit, name)
        
        .then((teams:any)=>{
            callback({success:true, code:200, message:null,data: teams});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static getTeamMembers(req:any, callback:any){
        let teamId:number = req.validData.teamId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        TeamS.getTeamMembers(teamId,offset,limit)
        
        .then((members)=>{
            console.log(members);
            callback({success:true, code:200, message:null,data: members});  
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static getTeamAnnouncement(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let teamId:number = req.validData.teamId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        TeamS.getTeamAnnouncement(teamId,userId,offset,limit)
        
        .then((announcements)=>{
            callback({success:true, code:200, message:null,data: announcements});    
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getTeamProjects(req:any, callback:any){
        let teamId:number = req.validData.teamId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;

        TeamS.getTeamProjects(teamId, offset, limit)

        .then((projects:any)=>{
            callback({success:true, code:200, message:null,data: projects});   
        })

        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getTeamProfile(req:any, callback:any){
        let teamId:number = req.validData.teamId;

        TeamS.getTeam(teamId)

        .then((team:any)=>{
            callback({success:true, code:200, message:null,data: team});  
        })

        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }




    // manging meethods
    //*************************************************** */
    public static announceAndReply(req:any, callback:any){
        let userId = req.thisUser.id;
        let teamId = req.validData.teamId;
        let message = req.validData.message;

        let mainAnnouncementId = null;
        if(req.validData.hasOwnProperty('mainAnnouncementId')){
            mainAnnouncementId = req.validData.mainAnnouncementId;
        }
        
        TeamS.announceAndReply(teamId,userId, message, mainAnnouncementId)
        
        .then((announcementId:any)=>{
            callback({success:true, code:200, message:null,data: announcementId});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static reply(req:any, callback:any){
        let userId = req.thisUser.id;
        let message = req.validData.message;
        let mainAnnouncementId = req.validData.mainAnnouncementId;

        
        TeamS.reply(userId, message, mainAnnouncementId)
        
        .then((announcementId:any)=>{
            callback({success:true, code:200, message:null,data: announcementId});  
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static updateAnnouncementSeen(req:any, callback:any){
        let userId = req.thisUser.id;
        let teamId = req.validData.teamId;
        let lastSeenAnnouncementId = req.validData.lastSeenAnnouncementId;

        TeamS.updateAnnouncementSeen(teamId,userId, lastSeenAnnouncementId)
        
        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static addNewTeam(req:any, callback:any){
        let teamData = req.validData;
        
        TeamS.newTeam(teamData)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static addTeamMember(req:any, callback:any){
        let memberId = req.validData.memberId;
        let teamId = req.validData.teamId;
        
        TeamS.addTeamMember(teamId, memberId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static removeTeamMember(req:any, callback:any){
        let memberIds = req.validData.memberIds;
        let teamId = req.validData.teamId;
        
        TeamS.removeTeamMember(teamId, memberIds)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static replyTeamJoinRequest(req:any, callback:any){
        let accepted:boolean = req.validData.accepted;
        let decision = 'Rejected';
        let requestId = req.validData.requestId;

        if(accepted){
            decision = UserConst.REQUEST.ACCEPTED;
        } else{
            decision = UserConst.REQUEST.REJECTED;
        }
        
        TeamS.replyTeamJoinRequest(requestId,decision)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});      
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static editAnnouncementReply(req:any, callback:any){
        let announcementId = req.validData.announcementId;
        let newAnnouncement = req.validData.newAnnouncement;
        
        TeamS.editAnnouncementReply(announcementId, newAnnouncement)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static deleteAnnouncement(req:any, callback:any){
        let announcementId = req.validData.announcementId
        
        TeamS.removeAnnouncement(announcementId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static deleteReply(req:any, callback:any){
        let replyId = req.validData.replyId
        
        TeamS.removeReply(replyId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});   
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static editTeamProfile(req:any, callback:any){
        let teamId = req.validData.teamId
        let teamData = req.validData.teamData;
        
        TeamS.editTeamProfile(teamId,teamData)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});      
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static deleteTeam(req:any, callback:any){
        let teamId = req.validData.teamId
        
        TeamS.deleteTeam(teamId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});  
        });
    }





    // extra========================================================================
    static getUnseenAnnouncements(req:any, callback:any){
        let homeReturn:any = [];
        let userId:any = req.thisUser.id;
        
        TeamS.getUnseenAnnouncements(userId)
        
        .then((announcements)=>{
            homeReturn = announcements;
            
            callback({success:true, code:200, message:null, data: homeReturn});
        })

        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        })        
    }
}