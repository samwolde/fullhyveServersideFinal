import {DB} from '../db/db';
import { ProjectConst, UserConst } from '../constants/constant';
import { TaskStatus } from '../models/serviceValues';


/**
 * get projects my teams are member of
 * get projects I own
 * get projects I individually work on
 */

export class ProjectDb{
    static getProject(projectId:any){
        return DB.Project.findById(projectId,{
            include:[{
                model:DB.User,
                include:[DB.Skill]
            }]
        })
    }

    static getFastSearchRes(nameCriteria:string, limit=ProjectConst.PROJECTS_FAST_SEARCH_LIMIT){
        return DB.Project.findAll({
            limit:limit,
            where:{
                name:{
                    like:`%${nameCriteria}%`
                }
            }
        })
    }
    
    static getMyProjectIds(userId:any){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Project,   // projects I own
                as:'myProjects',
            },{
                model:DB.Project,   // individual
                as:'individualProjects'
            },{
                model:DB.Team,      // projects through teams I own
                as:'leader',
                include:[{
                    model:DB.Project,
                }]
            },{
                model:DB.Team,      // projects through teams I am member of
                as:'teams',
                include:[{
                    model:DB.Project,
                }]
            }]
        })
    }

    static getUserOwnedProjects(userId:any, nameCriteria:string=''){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Project,
                where:{
                    name:{
                        like:`%${nameCriteria}%`
                    },
                },
                as:'myProjects',
                include:[{
                    model:DB.User,
                    include:[DB.Skill]
                },{
                    model:DB.Team,
                    include:[{
                        model:DB.User,
                        as:'members'
                    }]
                }]
            }]
        });
    }

    static getIndividualProjects(userId:any, nameCriteria:string=''){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Project,
                where:{
                    name:{
                        like:`%${nameCriteria}%`
                    },
                },
                as:'individualProjects',
                include:[{
                    model:DB.User,
                    include:[DB.Skill]
                },{
                    model:DB.Team,
                    include:[{
                        model:DB.User,
                        as:'members'
                    }]
                }]
            }]
        });
    }

    // get all the projects a user works on through a team as member or leader
    static getTeamsProjects(userId:any, nameCriteria:string=''){
        return DB.User.findById(userId,{
            include:[{
                model:DB.Team,
                as:'leader',
                include:[{
                    model:DB.Project,
                    where:{
                        name:{
                            like:`%${nameCriteria}%`
                        },
                    },
                    include:[{
                        model:DB.User,
                        include:[DB.Skill]
                    },{
                        model:DB.Team,
                        include:[{
                            model:DB.User,
                            as:'members'
                        }]
                    }]
                }]
            },{
                model:DB.Team,
                as:'teams',
                include:[{
                    model:DB.Project,
                    where:{
                        name:{
                            like:`%${nameCriteria}%`
                        },
                    },
                    include:[{
                        model:DB.User,
                        include:[DB.Skill]
                    },{
                        model:DB.Team,
                        include:[{
                            model:DB.User,
                            as:'members'
                        }]
                    }]
                }]
            }]
        });
    }    

    // get all projects a team works on
    static getTeamProjects(teamId:any, nameCriteria=''){
        return DB.Team.findById(teamId,{
            include:[{
                model:DB.Project,
                where:{
                    name:{
                        like:`%${nameCriteria}%`
                    }
                },
                include:[{
                    model:DB.User,
                    include:[DB.Skill]
                },{
                    model:DB.Team,
                    include:[{
                        model:DB.User,
                        as:'members'
                    }]
                },{
                    model:DB.User,
                    as:'individualMembers'
                }]
            }]
        })
    }


    // get all the projects with the given project ids
    static getProjectContributors(projectId:any, nameCriteria:string=''){
        return DB.Project.findById(projectId,{
            include:[{
                model:DB.User,
                as:'individualMembers',
                include:[DB.Skill]
            },{
                model:DB.Team,
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


    // get all the projects with the given project ids
    static getMyProjects(myProjectIds:any, nameCriteria:string=''){
        return DB.Project.findAll({
            where:{
                name:{
                    like:`%${nameCriteria}%`
                },
                id:{
                    in:myProjectIds
                }
            },
            include:[{
                model:DB.User,
                include:[DB.Skill]
            },{
                model:DB.User,
                as:'individualMembers'
            },{
                model:DB.Team,
                include:[{
                    model:DB.User,
                    as:'members'
                }]
            }]
        })
    }

    // get projects that are not related to the user in any way
    static getPublicProjects(myProjectIds:any, nameCriteria:string=''){
        return DB.Project.findAll({
            where:{
                name:{
                    like:`%${nameCriteria}%`
                },
                id:{
                    notIn:myProjectIds
                }
            },
            include:[{
                model:DB.User,
                include:[DB.Skill]
            },{
                model:DB.User,
                as:'individualMembers'
            },{
                model:DB.Team,
                include:[{
                    model:DB.User,
                    as:'members'
                }]
            }]
        })
    }

    static getProjectSets(projectId:any){
        return DB.Project.findById(projectId,{
            include:[{
                model:DB.TaskSets,
                include:[{
                    model:DB.Task
                }]
            }]    
        })
    }

    static getSetTasks(setId:any){
        return DB.TaskSets.findById(setId,{
            include:[{
                model:DB.Task,
                include:[{
                    model:DB.User,
                    as:'assigner',
                    include:[DB.Skill]
                },{
                    model:DB.User,
                    as:'assignee',
                    include:[DB.Skill]
                },{
                    model:DB.Team,
                    as:'assigneeTeam',
                    include:[{
                        model:DB.User,
                        as:'members'
                    },{
                        model:DB.User,
                        include:[DB.Skill]
                    }]
                }]
            }]
        })
    }

    // Project management
    //********************************* */
    static newProject(projectData:any){
        return new Promise((resolve, reject)=>{
            DB.Project.create(projectData)
            
            .then((project:any)=>{
                if(project){
                    resolve(project.id);
                } else{
                    resolve();
                }
            });
        })
        
    }

    static removeProject(projectId:any){
        return DB.Project.destroy({
            where:{
                id:projectId
            }
        });
    }

    static setProjectLogo(imageUrl:any){
        return DB.Project.update({
            imageUrl:imageUrl
        });
    }
    //[{userId:1,projectId:1},{}]
    static addIndividualContributors(individualContributorData:any){
        return DB.ProjectUser.bulkCreate(individualContributorData)
    }

    static replyIndividualContributorJoinRequest(requestId:any, decision:string){
        return DB.ProjectUser.update({
            request:decision,
            seen:true
        },{
            where:{
                id:requestId
            }
        })
    }

    static removeIndividualContributors(projectId:number, userIds:number[]){
        return DB.ProjectUser.destroy({
            where:{
                userId:{
                    in:userIds
                },
                projectId:projectId
            }
        })
    }
    //[{projectId:1,teamId:1},{}]
    static addTeamContributors(teamContributorData:any){
        return DB.ProjectTeam.bulkCreate(teamContributorData);
    }

    static replyTeamContributorJoinRequest(requestId:any, decision:string){
        return DB.ProjectTeam.update({
            request:decision,
            seen:true
        },{
            where:{
                id:requestId
            }
        })
    }

    static removeTeamContributors(projectId:number, teamIds:number){
        return DB.ProjectTeam.destroy({
            where:{
                teamId:{
                    in:teamIds
                },
                projectId:projectId
            }  
        })
    }

    static setProjectCompleted(projectId:any){
        return DB.Project.update({
            completionDate:new Date()
        },{
            where:{
                id:projectId
            }
        })
    }

    static updateProjectLogo(projectId:any, imageUrl:string){
        return DB.Project.update({
            imageUrl:imageUrl
        },{
            where:{
                id:projectId
            }
        })
    }

    // Set managment
    //******************************** */
    static newSet(setData:any){
        return DB.TaskSets.findOne({
            order:[['number','DESC']],
            where:{
                projectId:setData.projectId,
            }
        })

        .then((lastSet:any)=>{
            let number = 1;
            if(lastSet){
                number = lastSet.number + 1;
            }
            setData.number = number;
            return DB.TaskSets.create(setData);
        })
        
    }

    static removeSet(setId:any){
        return DB.TaskSets.destroy({
            where:{
                id:setId
            }  
        })
    } 

    static setSetCompleted(setId:any){
        return DB.TaskSets.update({
            completionDate:new Date()
        },{
            where:{
                id:setId
            }
        })
    }

    // Task managment
    //********************************** */
    static newTask(taskData:any){
        return DB.Task.create(taskData);
    }

    static removeTask(taskId:any){
        return DB.Task.destroy({
            where:{
                id:taskId
            }  
        })
    } 

    static setTaskCompleted(taskId:any){
        return DB.Task.update({
            completionDate:new Date(),
            status:TaskStatus.PendingEvaluation
        },{
            where:{
                id:taskId
            }
        })
    }

    static setTaskStart(taskId:any){
        return DB.Task.update({
            startDate:new Date(),
            status:TaskStatus.InProgress
        },{
            where:{
                id:taskId
            }
        })
    }

    static setTaskStatus(taskId:any, status:TaskStatus){
        return DB.Task.update({
            status:status
        },{
            where:{
                id:taskId
            }
        })
    }

    static getIncompleteTasks(userId:any){
        return DB.TaskSets.findAll({
            include:[{
                model:DB.Task,
                where:{
                    assigneeId:userId,
                    completionDate:null
                },
                include:[{
                    model:DB.User,
                    as:'assigner',
                    include:[DB.Skill]
                },{
                    model:DB.User,
                    as:'assignee',
                    include:[DB.Skill]
                },{
                    model:DB.Team,
                    as:'assigneeTeam',
                    include:[{
                        model:DB.User,
                        as:'members'
                    },{
                        model:DB.User,
                        include:[DB.Skill]
                    }]
                }]
            },{
                model:DB.Project
            }]
        })   
    }

    static getUnseenTasks(userId:any){
        return DB.TaskSets.findAll({
            include:[{
                model:DB.Task,
                where:{
                    assigneeId:userId,
                    seen:false
                }            
            },{
                model:DB.Project
            }]
        })            
    }

    static getUnseenTeamProjectJoinRequests(teamsId:any){
        return DB.ProjectTeam.findAll({
            where:{
                teamId:{
                    in:teamsId
                },
                request:UserConst.REQUEST.UNDECIDED,
                seen:false
            }
        })
    }

    static getProjects(projectsId:any){
        return DB.Project.findAll({
            where:{
                id:{
                    in:projectsId
                }
            }
        })
    }

    static getUnseenIndividualProjectJoinRequests(userId:any){
        return DB.ProjectUser.findAll({
            where:{
                userId:userId,
                request:UserConst.REQUEST.UNDECIDED,
                seen:false
            }
        })
    }




    static editProjectDetails(projectId:number, projectData:any){
        return DB.Project.update(projectData, {
            where:{
                id:projectId
            }
        })
    }

    static deleteProject(projectId:number){
        return DB.Project.destroy({
            where:{
                id:projectId
            }
        })
    }




    // extra
    // =====================================================================

    static getNextTasksetNumber(projectId:number){
        return DB.TaskSets.count({
            where:{
                projectId:projectId
            }
        })    
    }

    static getNextTaskNumber(projectId:number, tasksetId:number){
        return DB.Task.count({
            where:{
                projectId:projectId,
                tasksetId:tasksetId
            }
        })    
    }


    // =====================================================================


    // Authorization
    // =================================================================
    static checkProjectLeadership(userId:number, projectId:number){
        return DB.Project.findOne({
            where:{
                id:projectId,
                leaderId:userId
            }
        })
    }

    static checkIndividualContributor(userId:number, projectId:any){
        return DB.ProjectUser.findOne({
            where:{
                userId:userId,
                projectId:projectId,
                request:UserConst.REQUEST.ACCEPTED
            }
        })
    }

    static checkTeamContributor(teamsId:number[], projectId:number){
        return DB.ProjectTeam.findOne({
            where:{
                teamId:{
                    in:teamsId
                },
                projectId:projectId,
                request:UserConst.REQUEST.ACCEPTED
            }
        })
    }

    static checkIndividualContributorRequestReceiver(userId:number, requestId:number){
        return DB.ProjectUser.findOne({
            where:{
                id:requestId,
                userId:userId,
                request:UserConst.REQUEST.UNDECIDED
            }
        })
    } 
    
    static checkTeamContributorRequestReceiver(teamId:number, requestId:number){
        return DB.ProjectTeam.findOne({
            where:{
                id:requestId,
                teamId:teamId,
                request:UserConst.REQUEST.UNDECIDED
            }
        })
    } 

    static checkTaskAssignee(userId:number, taskId:number){
        return DB.Task.findOne({
            where:{
                id:taskId,
                assigneeId:userId
            }
        })
    }
    //====================================================================
}