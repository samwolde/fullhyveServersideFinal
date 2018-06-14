import {DB} from '../db/db';
import {TeamConst,UserConst,AnnouncementConst} from '../constants/constant';

export class TeamDb{
    static getTeam(teamId:any){
        return DB.Team.findById(teamId, {
            include:[{
                model:DB.User,
                as:'members'
            },{
                model:DB.User,
                include:[DB.Skill]
            }]
        })
    }

    // get teamIds the user is leader of
    static getLeaderTeam(userId:any){
        return DB.Team.findAll({
            attributes:['id','name'],
            where:{
                leaderId:userId
            }
        })
    }

    // get teamIds the user is member of
    static getUserTeam(userId:any){
        return DB.TeamUser.findAll({
            attributes:['teamId'],
            where:{
                userId:userId,      // ??exclude default project teams
                request:UserConst.REQUEST.ACCEPTED
            }
        })
    }

    // get userIds of members of the given team
    static getMembersId(teamId:any){
        return DB.TeamUser.findAll({
            attributes:['userId'],
            where:{
                teamId:teamId,
                request:UserConst.REQUEST.ACCEPTED
            }
        })
    }

    static getTeamsDetail(teamsId:number[], nameCriteria:string){
        return DB.Team.findAll({
            where:{
                id:{
                    in:teamsId
                },
                name:{
                    like:`%${nameCriteria}%`
                }
            },
            include:[{
                model:DB.User,
                as:'members'
            },{
                model:DB.User,
                include:[DB.Skill]
            }]
        })
    }

    // get teams public teams the user isn't member of
    /*static getPublicTeams(teamIds:any, name?:string, lastTeamId:any=0, limit:number=TeamConst.TEAMS_SEARCH_LIMIT){
        return DB.Team.findAll({
            attributes:['id','name','imageUrl','focus','description', 'visibility'],
            order:[['id','ASC']],
            where:{
                visibility:true,
                name:{
                    like:name==null||name==''?`%%`:`%${name}%`
                },
                id:DB.Sequelize.and({
                    gt:TeamConst.START_ID,
                },{
                    gt:lastTeamId
                },{
                    notIn:teamIds
                })
            },

            include:[{
                model:DB.User,
                attributes:['id','firstName','lastName','imageUrl','title', 'description'],
                include:[DB.Skill]
            },{
                model:DB.User,
                as:'members',
                attributes:['id'],
            }]
        })
    }*/

    // get teams the user is member of
    /*static getMyTeams(teamIds:any, name?:string, lastTeamId:any=TeamConst.START_ID, limit:number=TeamConst.TEAMS_SEARCH_LIMIT){
        return DB.Team.findAll({
            order:[['id','ASC']],
            attributes:['id','name','imageUrl','focus','description', 'visibility','status'],
            where:{
                name:{
                        like:name==null||name==''?`%%`:`%${name}%`
                    },
                    
                    id:DB.Sequelize.and({
                        in:teamIds
                    },{
                        gt:lastTeamId
                    })
            },
            include:[{
                model:DB.User,
                as:'members',
                attributes:['id'],
                include:[DB.Skill]
            },{
                model:DB.User,
                attributes:['id','firstName','lastName','imageUrl','title', 'description'],
                include:[DB.Skill]
            }]
        })
    }*/

    static getTeamMembers(memberIds:any){
        return DB.User.findAll({
            where:{
                id:{
                    in:memberIds
                }
            },
            include:[DB.Skill]
        }) 
    }

    static getTeamAnnouncement(teamsId:any, lastAnnId:any=TeamConst.START_ID){
        return DB.Announcement.findAll({
            order:[['id','DESC']],
            where:{
                id:{
                    gt:lastAnnId
                },
                mainAnnouncementId:null,
                teamId:{
                    in:teamsId
                }
            },
            include:[{
                model:DB.User,
                include:[DB.Skill]
            },{
                model:DB.Announcement,
                as:'replies',
                include:[{
                    model:DB.User,
                    include:[DB.Skill]
                }]
            }]
        })
    }

    static getLastAnnId(teamId:any, userId:any){
        return DB.TeamMemberLastAnnSeen.findOne({
            where:{
                teamId:teamId,
                userId:userId
            }
        })
    }

    static getMemberTeams(userId:number, nameCriteria:string=''){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Team,
                as:'teams',
                where:{
                    name:{
                        like:`%${nameCriteria}%`    // ?? exclude default project teams
                    }
                },
                include:[{
                    model:DB.User,
                    as:'members'
                },{
                    model:DB.User,
                    include:[DB.Skill]
                }]
            }]
        })
    }

    static getLeaderTeams(userId:number, nameCriteria:string=''){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Team,
                as:'leader',
                where:{
                    name:{
                        like:`%${nameCriteria}%`    // ?? exclude default project teams
                    }
                },
                include:[{
                    model:DB.User,
                    as:'members'
                },{
                    model:DB.User,
                    include:[DB.Skill]
                }]
            }]
        })
    }    

    static getPublicTeams(teamIds:number[], nameCriteria:string=''){
        return DB.Team.findAll({
            where:{
                id:{
                    notIn:teamIds
                },
                name:{
                    like:`%${nameCriteria}%`
                },
            },
            include:[{
                model:DB.User,
                as:'members'
            },{
                model:DB.User,
                include:[DB.Skill]
            }]
        })
    }

    // update and insert
    //*************************************************************** */
    static announce(teamId:any, userId:any, message:string, mainAnnouncementId?:any){
        return DB.Announcement.create({
            message:message,
            userId:userId,
            teamId:teamId,
            mainAnnouncementId:mainAnnouncementId
        })
    }

    static reply(userId:any, message:string, mainAnnouncementId:any){
        return new Promise((resolve, reject)=>{
            return DB.Announcement.findById(mainAnnouncementId)
            
            .then((announcement:any)=>{
                if(announcement){
                    let teamId:any = announcement.teamId;
                    return DB.Announcement.create({
                        message:message,
                        userId:userId,
                        teamId:teamId,
                        mainAnnouncementId:mainAnnouncementId
                    })
                }

                return null;
            })

            .then((reply:any)=>{
                resolve(reply);
            })
        })
    }

    static updateAnnouncementSeen(teamId:any,userId:any, lastAnnId:any){
        return DB.TeamMemberLastAnnSeen.findOne({
            where:{
                teamId:teamId,
                userId:userId
            }
        })

        .then((lastAnn:any)=>{
            if(lastAnn){
                lastAnn.lastSeenAnnouncementId = lastAnnId;
                return lastAnn.save();
            } else{
                return DB.TeamMemberLastAnnSeen.create({
                    lastSeenAnnouncementId:lastAnnId,
                    teamId:teamId,
                    userId:userId
                })
            }
        })
    }

    static newTeam(teamData:any){
        return DB.Team.create(teamData);
    }

    static addTeamMembers(memberData:any){
        return DB.TeamUser.bulkCreate(memberData);
    }

    static removeTeamMember(teamId:number, memberId:number[]){
        return DB.TeamUser.destroy({
            where:{
                teamId:teamId,
                userId:{
                    in:memberId
                }
            }
        })
    }

    static replyTeamJoinRequest(requestId:any, decision:string){
        return DB.TeamUser.update({
            request:decision,
            seen:true
        },{
            where:{
                id:requestId
            }
        })
    }


    // notification

    static getUnseenNotificationAnnouncements(teamsId:any){
        return DB.Announcement.findAll({
            where:{
                id:{
                    in:teamsId,
                },
                mainAnnouncementId:null,
            },
            include:[{
                model:DB.User,
                include:[DB.Skill]
            },{
                model:DB.Team,
                include:[{
                    model:DB.TeamMemberLastAnnSeen,
                }]
            }]
        })
    }

    static getLastAnnIds(userId:any){
        return DB.TeamMemberLastAnnSeen.findAll({
            where:{
                userId:userId
            }
        })
    }

    static getUnseenTeamJoinRequests(userId:any){
        return DB.TeamUser.findAll({
            where:{
                userId:userId,
                request:UserConst.REQUEST.UNDECIDED,
                seen:false
            }
        })
    }

    static getTeams(teamsId:any){
        return DB.Team.findAll({
            where:{
                id:{
                    in:teamsId
                }
            }
        })
    }

    


    static editTeamProfile(teamId:number, teamData:any){
        return DB.Team.update(teamData,{
            where:{
                id:teamId
            }
        })
    }

    static editAnnouncementReply(announcementId:number, newAnnouncement:string){
        return DB.Announcement.update(newAnnouncement,{
            where:{
                id:announcementId
            }
        })
    }

    // delete announcement when main announcement id is not given
    // delete reply when main announcement id is null
    static removeAnnouncementReply(announcementId:number, mainAnnouncementId:any=announcementId){
        return DB.Announcement.destroy({
            where:DB.Sequelize.or({
                id:announcementId
            },{
                mainAnnouncementId:mainAnnouncementId
            })
        })
    }

    static deleteTeam(teamId:number){
        return DB.Team.destroy({
            where:{
                id:teamId
            }
        })
    }





    // Authorization
    //*************************************************************************************** */
    static checkTeamLeadership(userId:number, teamId:number){
        return DB.Team.findOne({
            where:{
                id:teamId,
                leaderId:userId
            }
        })
    }

    static checkTeamMembership(userId:number, teamId:number){
        return DB.TeamUser.findOne({
            where:{
                teamId:teamId,
                userId:userId,
                request:UserConst.REQUEST.ACCEPTED
            }
        })   
    }

    static checkAnnouncementOrReplyOwnership(userId:number, annId:number){
        return DB.Announcement.findOne({
            where:{
                id:annId,
                userId:userId
            }
        })
    }

    static checkTeamJoinRequestReceiver(userId:number, requestId:number){
        return DB.TeamUser.findOne({
            where:{
                id:requestId,
                userId:userId,
                request:UserConst.REQUEST.UNDECIDED
            }
        })
    }
    //******************************************************************************************** */
}