import {User,MyTeam,Team,ReturnAttrType,FastSearchResult,Project,MinTeam,MinUser,NotificationType, Task, Identity} from '../models/serviceValues';
import {AnnouncementConst, UserConst} from '../constants/constant';


export class UtilMethods{
    static getTeamProjectAttr(values:any):FastSearchResult[]{
        let returns:FastSearchResult[] = [];
        for(let i of values){
            returns.push({
                id:i.get('id'),
                name:i.get('name'),
                image:i.get('image')
            })
        }
        return returns;
    }

    static getFastUserAttr(users:any):FastSearchResult[]{
        let usersReturn:FastSearchResult[] = [];
        for(let i of users){
            usersReturn.push({
                id:i.get('id'),
                name:`${i.get('firstName')} ${i.get('lastName')}`,
                image:i.get('image')
            })
        } 
        return usersReturn;
    }

    static getUserAttr(users:any):User[]{
        let userReturn = [];
        for(let user of users){
            let skills = user.skills;
            let skill = [];

            for(let b of skills){
                skill.push(b.dataValues.skill);
            }

            userReturn.push({
                id:user.id,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
                title:user.title,
                skills:skill,
                description:user.description
            })                     
        }
        return userReturn;
    }

    static getMinUserAttr(users:any):MinUser[]{
        let userReturn = [];
        for(let user of users){
            userReturn.push({
                id:user.id,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image,
            })                     
        }
        return userReturn;
    }

    static getUserProfileAttr(users:any):Identity[]{
        let userReturn = [];
        for(let user of users){
            let skills = user.skills;
            let skill = [];

            for(let b of skills){
                skill.push(b.dataValues.skill);
            }

            userReturn.push({
                id:user.id,
                userName:user.userName,
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                image:user.image,
                title:user.title,
                skills:skill,
                description:user.description,
            })                     
        }
        return userReturn;
    }

    static getMemberCount(members:any){
        let memberCount:any = 0;
        for(let member of members){
            if(member.TeamUsers.request == 'Accepted'){
                memberCount++;
            }
        }
        return memberCount;
    }

    static getTeamAttr(teams:any){        
        let teamsReturn:Team[] = [];
        for(let a of teams){
            let teamDetail:any = {};

            let team = a.get();
            let leaders = UtilMethods.getUserAttr([team.user]);
            
            teamDetail = {
                id:team.id,
                name:team.name,
                image:team.image,
                description:team.description,
                memberCount:UtilMethods.getMemberCount(team.members),
                leader:leaders[0]
            };

            teamsReturn.push(teamDetail);
        }
        return teamsReturn;  
    }

    static getMinTeamAttr(teams:any):MinTeam[]{        
        let teamsReturn:Team[] = [];
        for(let team of teams){
            let teamDetail:any = {};

            teamDetail = {
                id:team.id,
                name:team.name,
                image:team.image,
            };

            teamsReturn.push(teamDetail);
        }
        return teamsReturn;  
    }
    
    

    static getContributorCount(project:any){
        let contributorsId:any = {};
        
        for(let team of project.teams){
            if(team.projectTeams.request==UserConst.REQUEST.ACCEPTED){
                for(let user of team.members){
                    if(user.TeamUsers.request == UserConst.REQUEST.ACCEPTED){
                        contributorsId[user.id] = true;   // team members
                    }
                }
                contributorsId[team.leaderId] = true;    // team leader
            }
        }

        for(let individualMember of project.individualMembers){
            if(individualMember.projectUsers.request==UserConst.REQUEST.ACCEPTED){
                contributorsId[individualMember.id] = true; // individual contributors
            }
        }
        
        return Object.keys(contributorsId).length;
    }

    static getProjectAttr(projects:any):Project[]{
        let projectsReturn:any[] = [];
        for(let project of projects){
            let projectDetail:any = {};
            let leader = UtilMethods.getUserAttr([project.user]);
            let contributors = UtilMethods.getContributorCount(project);
        
            projectDetail = {
                id:project.id,
                name:project.name,
                image:project.image,
                description:project.description,
                field:project.field,
                leader:leader[0],
                contributorCount:contributors
            };

            projectsReturn.push(projectDetail);
        }
        return projectsReturn;
    }




    static getAnnouncementAttr(announcements:any, userId:any, lastSeenAnnouncementId:any,showReply:boolean=true){
        let announcementReturn:any = [];
        
        for(let a of announcements){                   
            let sender = UtilMethods.getUserAttr([a.user]);
            let seen = a.id>(lastSeenAnnouncementId==null?AnnouncementConst.START_ID:lastSeenAnnouncementId)?false:true;
            let annR:any;
            annR = {
                mainMessage:{
                    id:a.id,
                    message:a.message,
                    timestamp:a.timestamp,
                    sent:a.userId==userId?true:false,
                    seen:seen,
                    sender:sender[0]
                },
                replies:[]
            }
            
            if(showReply){
                let replies = a.get('replies');
                
                for(let b of replies){
                    let rSender = UtilMethods.getUserAttr([a.user]);
                    annR.replies.push({
                        id:b.id,
                        message:b.message,
                        timestamp:b.timestamp,
                        sent:true,
                        seen:seen,
                        sender:rSender[0]
                    })
                }
            }
            
            announcementReturn.push(annR);
        }
        return announcementReturn;
    }

    

    static getTasksetAttr(sets:any){
        let setsReturn:any = [];
        
        for(let set of sets){
            let setR:any;

            setR = {
                id: set.id,
                name: set.name,
                number: set.number,
                deadline: set.deadline,
                description: set.description,
                tasks: new Task(),
                completion: "Completed"
            }
            setsReturn.push(setR);
        }

        return setsReturn;
    }

    static async getTaskAttr(tasks:any){
        let tasksReturn:any = [];

        for(let task of tasks){
            let taskR:any;
            taskR = {
                id:task.id,
                number:task.number,
                title:task.title,
                description:task.description,
                status:task.status,
                deadline:task.deadline,
                assignmentDate:task.assignmentDate,
                assigner:UtilMethods.getUserAttr([task.assigner])[0],
                assignee:UtilMethods.getUserAttr([task.assignee])[0],
                assigneeTeam:UtilMethods.getTeamAttr([task.assigneeTeam])[0]
            }
            
            tasksReturn.push(taskR);
        }
        return tasksReturn;
    }

    static getUnseenTasksAttr(projects:any){
        let messagesReturn:any = [];
        for(let projectId in projects){
            let proj:any = projects[projectId];
            messagesReturn.push({
                id:projectId,
                image:proj.image,
                comment:`You have been assigned ${proj.count} new task${proj.count==1?'':'s'} on project ${proj.name}.`,
                options:UtilMethods.getOptions(NotificationType.Assignment,projectId)
            })
            
        }

        return messagesReturn;
    }



    static getUnseenMessagesAttr(messages:any){
        let messagesReturn:any = [];

        for(let message of messages){
            let sender:any = UtilMethods.getUserAttr([message.user])[0];

            messagesReturn.push({
                message:{
                    id:message.id,
                    message:message.message,
                    timestamp:message.timestamp,
                    seen:message.seen,
                },                
                sender:sender
            })
        }

        return messagesReturn;
    }

    static getMessagesAttr(messages:any, userId:number){
        let messagesReturn:any = [];
        
        for(let message of messages){
            messagesReturn.push({
                id:message.id,
                message:message.message,
                seen:message.seen,
                timestamp:message.timestamp,
                sent:message.senderId==userId?true:false
            })
        }

        return messagesReturn;
    }


    // notifications
    static getOptions(notificationType:NotificationType, id:any){
        if(notificationType != NotificationType.Assignment){
            return [
                {
                    navigation:false,
                    type:notificationType,
                    name:'Accept',
                    id:id
                },
                {
                    navigation:false,
                    type:notificationType,
                    name:'Decline',
                    id:id
                }
            ]
        } else if(notificationType == NotificationType.Assignment){
            return [
                {
                    navigation:true,
                    type:notificationType,
                    name:'View',
                    id:id
                }
            ]
        }

        return [];
    }

    static getFriendRequestAttr(senders:any, friendsId:any){
        let friendRequestsReturn:any = [];

        for(let sender of senders){
            friendRequestsReturn.push({
                id:friendsId[sender.id],
                image:sender.image,
                comment:`You have a friend request from ${sender.firstName} ${sender.lastName}.`,
                options:UtilMethods.getOptions(NotificationType.FriendRequest, friendsId[sender.id])
            })
        }

        return friendRequestsReturn;
    }

    static getTeamJoinRequestAttr(senders:any, friendsId:any){
        let teamJoinRequestsReturn:any = [];

        for(let sender of senders){
            teamJoinRequestsReturn.push({
                id:friendsId[sender.id],
                image:sender.image,
                comment:`You have been invited to team ${sender.name}.`,
                options:UtilMethods.getOptions(NotificationType.TeamRequest, friendsId[sender.id])
            })
        }

        return teamJoinRequestsReturn;
    }




    // offset and limit

    static sliceCustom(values:any, order:string[], offset:number, limit:number){
        for(let i of order){
            let length:number = values[i].length;
            values.count += length;

            values[i] = values[i].slice(offset, offset+limit);
            if(offset+limit>length){
                limit = offset + limit - length;
                if(offset>length){
                    offset = offset - length;
                } else{
                    offset = 0;
                }
            } else{
                offset = limit = 0;
            }
        }

        if(offset + limit >= values.count){
            values.done = true;
        } else{
            values.done = false;
        }
        
        delete values.count;
        return values;
    }
}


export class DateMethods{
    static DaysInMonth:any = {
        1:31,
        2:28,
        3:31,
        4:30,
        5:31,
        6:30,
        7:31,
        8:31,
        9:30,
        10:31,
        11:30,
        12:31
    }

    static getTodayDate(){
        let today:any = new Date();
        let todayDate:string = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        
        return todayDate;
    }

    static getLastMonthDate(){
        let today:any = new Date();
        let todayDate:string = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
        let lastMonthDate:string = `${today.getMonth()>0?today.getFullYear():today.getFullYear()-1}-${today.getMonth()>0?today.getMonth():11}-${today.getDate()}`;
        
        return lastMonthDate;
    }

    // month can't be greater than 12
    static getMonthDate(monthBack:number){
        let today:any = new Date();
        let year:number, month:number, date:number ;

        if(today.getMonth() + 1 - monthBack  > 0){
            month = today.getMonth() + 1 - monthBack;
            if(today.getDate() > DateMethods.DaysInMonth[month]){
                date = DateMethods.DaysInMonth[month];
            } else{
                date = today.getDate();
            }
            year = today.getFullYear();
        } else{
            month = (today.getMonth() - monthBack) + 13;
            if(today.getDate() > DateMethods.DaysInMonth[month]){
                date = DateMethods.DaysInMonth[month];
            } else{
                date = today.getDate();
            }
            year = today.getFullYear() - 1;
        }

        return `${year}-${month}-${date}`;
    }

    // week can't be greater than 4
    static getWeekDate(week:number, startDate?:any){
        let today:any = new Date();
        if(!startDate){
            today = new Date(startDate);
        }
        
        let year:number, month:number, date:number;

        if(today.getDate() - 7 * week > 0){
            date = today.getDate() - 7 * week;  // previous week
            month = today.getMonth() + 1;
            year = today.getFullYear();
        } else {
            if(today.getMonth() > 0){
                date = (DateMethods.DaysInMonth[today.getMonth()] + today.getDate()) - (7 * week);  // previous week
                month = today.getMonth();   // previous month
                year = today.getFullYear();
            } else{
                date = (DateMethods.DaysInMonth[today.getMonth()] + today.getDate()) - (7 * week);
                month = 11;   // previous month
                year = today.getFullYear() - 1;     // previous year
            }
        }

        return `${year}-${month}-${date}`;
    }

    static getInterval(startDate:any, finalDate:any){
        let sDate:any = new Date(startDate);
        let eDate:any = new Date(finalDate);

        return Math.abs(eDate-sDate)/86400000;
    }
}

