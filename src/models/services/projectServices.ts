import {ProjectDb} from '../db/projectDb';
import {TeamS} from './teamServices';
import { UtilMethods } from '../util/util';
import { ReturnAttrType, SearchFor, Contributors,Project, TaskStatus, NotificationType } from '../models/serviceValues';
import { TeamDb } from '../db/teamDb';
import { UserConst, ProjectConst } from '../constants/constant';

export class ProjectS{
    static getProject(projectId:any){
        return new Promise((resolve, reject)=>{
            ProjectDb.getProject(projectId)

            .then((project:any)=>{
                let projectReturn:any = null;
                if(project){
                    projectReturn = UtilMethods.getProjectAttr([project]);
                }
                resolve(projectReturn);
            })
        })
        
    }

    static getMyProjectsIds(userId:any){
        return new Promise((resolve, reject)=>{
            ProjectDb.getMyProjectIds(userId)

            .then((user:any)=>{
                let returnProjectIds:any = {};
                
                let individualProjects = user.individualProjects;

                for(let project of individualProjects){
                    if(project.projectUsers.request==UserConst.REQUEST.ACCEPTED){
                        returnProjectIds[project.id] = true;
                    }
                }

                for(let team of user.teams){
                    if(team.TeamUsers.request==UserConst.REQUEST.ACCEPTED){
                        for(let project of team.projects){
                            if(project.projectTeams.request==UserConst.REQUEST.ACCEPTED){
                                returnProjectIds[project.id] = true;
                            }
                        }
                        
                    }
                }

                for(let team of user.leader){
                    for(let project of team.projects){
                        if(project.projectTeams.request == UserConst.REQUEST.ACCEPTED){
                            returnProjectIds[project.id] = true;
                        }
                    }
                }

                for(let project of user.myProjects){
                    returnProjectIds[project.id] = true;
                }
                resolve(Object.keys(returnProjectIds));
            })
        })
    }

    static getMyProjects(userId:any, offset:number=0, limit:number=ProjectConst.PROJECTS_SEARCH_LIMIT, nameCriteria:string=''):Promise<Project[]>{
        let projectsReturn:any = {
            myProjects:[],
            count:0
        }
        return new Promise((resolve, reject)=>{
            ProjectS.getMyProjectsIds(userId)

            .then((projectIds:any)=>{
                return ProjectDb.getMyProjects(projectIds, nameCriteria);
            })
            
            .then((projects:any)=>{
                projectsReturn = UtilMethods.sliceCustom({myProjects:projects, count:0},["myProjects"], offset, limit);
                projectsReturn.myProjects = UtilMethods.getProjectAttr(projectsReturn.myProjects);

                resolve(projectsReturn);
            })
        })
    }

    static searchProjects(userId:any, offset:number=0, limit:number=ProjectConst.PROJECTS_SEARCH_LIMIT, nameCriteria:string=''):Promise<Project[]>{
        let projectsReturn:any = {
            myProjects:[],
            projects:[],
            count:0
        }
        return new Promise((resolve, reject)=>{
            ProjectS.getMyProjectsIds(userId)

            .then((projectIds:any)=>{
                return Promise.all([ProjectDb.getMyProjects(projectIds,nameCriteria), ProjectDb.getPublicProjects(projectIds,nameCriteria)]);
            })
            
            .then((result:any)=>{
                projectsReturn = UtilMethods.sliceCustom({myProjects:result[0],projects:result[1],count:0},["myProjects","projects"], offset, limit);
                projectsReturn.myProjects = UtilMethods.getProjectAttr(projectsReturn.myProjects);
                projectsReturn.projects = UtilMethods.getProjectAttr(projectsReturn.projects);

                resolve(projectsReturn);
            })
        })
    }

    static getContributors(projectId:number, offset:number=0,limit:number=ProjectConst.PROJECTS_SEARCH_LIMIT):Promise<Contributors>{
        return new Promise((resolve, reject)=>{
            let contributorsReturn:Contributors = {
                teams:[],
                individuals:[],
                count:0
            };

            ProjectDb.getProjectContributors(projectId)

            .then((project:any)=>{
                if(project){                    
                    for(let team of project.teams){
                        if(team.projectTeams.request == UserConst.REQUEST.ACCEPTED){
                            contributorsReturn.teams.push(team);
                        }
                    }

                    for(let user of project.individualMembers){
                        if(user.projectUsers.request == UserConst.REQUEST.ACCEPTED){
                            contributorsReturn.individuals.push(user);
                        }
                    }

                    contributorsReturn = UtilMethods.sliceCustom(contributorsReturn,["teams","individuals"],offset, limit);
                    contributorsReturn.teams = UtilMethods.getTeamAttr(contributorsReturn.teams);
                    contributorsReturn.individuals = UtilMethods.getUserAttr(contributorsReturn.individuals);
                }
                resolve(contributorsReturn);
                
            })
        })
    }

    static getTaskSets(projectId:any, offset:number=0,limit:number=ProjectConst.PROJECTS_SEARCH_LIMIT){
        return new Promise((resolve, reject)=>{
            ProjectDb.getProjectSets(projectId)
            
            .then((project:any)=>{
                let tasksetsReturn:any = {tasksets:[],count:0};
                if(project){
                    tasksetsReturn = UtilMethods.sliceCustom({tasksets:project.tasksets,count:0},["tasksets"],offset,limit)
                    tasksetsReturn.tasksets = UtilMethods.getTasksetAttr(project.tasksets);
                }
                resolve(tasksetsReturn);
            })
        })
    }

    static getTasks(setId:any, offset:number=0,limit:number=ProjectConst.PROJECTS_SEARCH_LIMIT){
        return new Promise((resolve, reject)=>{
            ProjectDb.getSetTasks(setId)

            .then((taskset:any)=>{
                let tasksReturn:any = {tasks:[],count:0};
                
                if(taskset){
                    tasksReturn = UtilMethods.sliceCustom({tasks:taskset.tasks,count:0},["tasks"],offset, limit);
                    tasksReturn.tasks = UtilMethods.getTaskAttr(taskset.tasks);
                }

                resolve(tasksReturn);
            })
        })
    }


    // managing methods
    // project managing methods
    //******************************************************************** */
    static newProject(projectData:any){
        return new Promise((resolve, reject)=>{
            let rProjectId:any;
            ProjectDb.newProject(projectData.project)

            .then((projectId:any)=>{
                rProjectId = projectId;
                let teamContributors:any = [];
                let members:any = projectData.members.teams;

                for(let member of members){
                    teamContributors.push({
                        projectId:projectId,
                        teamId:member
                    })
                }
                return ProjectDb.addTeamContributors(teamContributors);
            })

            .then(()=>{
                let individualContributors:any = [];
                let members:any = projectData.members.teams;

                for(let member of members){
                    individualContributors.push({
                        projectId:rProjectId,
                        userId:member
                    })
                }
                return ProjectDb.addTeamContributors(individualContributors);
            })

            .then(()=>{
                resolve(201);
            })

            .catch((err:any)=>{
                reject(500);
            })
        })
    }

    static addContributors(projectId:number, contributorIds:any){
        let individualContributorData:any = [];
        let teamContributorData:any = [];
        for(let contributorId of contributorIds.individualIds){
            individualContributorData.push({userId:contributorId,projectId:projectId});
        }

        for(let contributorId of contributorIds.teamIds){
            teamContributorData.push({userId:contributorId,projectId:projectId});
        }

        return Promise.all([ProjectDb.addIndividualContributors(individualContributorData), ProjectDb.addTeamContributors(teamContributorData)]);
    }

    static removeContributors(projectId:number, contributorIds:any){
        let individualContributorIds:any = [];
        let teamContributorIds:any = [];
        for(let contributorId of contributorIds.individualIds){
            individualContributorIds.push(contributorId);
        }

        for(let contributorId of contributorIds.teamIds){
            teamContributorIds.push(contributorId);
        }

        return Promise.all([ProjectDb.removeIndividualContributors(projectId, individualContributorIds), ProjectDb.removeTeamContributors(projectId, teamContributorIds)]);
    }

    static addIndividualContributor(memberId:any, projectId:any){
        return ProjectDb.addIndividualContributors([{userId:memberId,projectId:projectId}]);
    }

    static replyIndividualContributorJoinRequest(requestId:any, decision:any){
        return ProjectDb.replyIndividualContributorJoinRequest(requestId, decision);
    }

    static addTeamContributor(teamId:any, projectId:any){
        return ProjectDb.addTeamContributors([{teamId:teamId,projectId:projectId}]);
    }

    static replyTeamContributorJoinRequest(requestId:any, decision:any){
        return ProjectDb.replyTeamContributorJoinRequest(requestId, decision);
    }

    static updateProjectLogo(projectId:any, imageUrl:string){
        return ProjectDb.updateProjectLogo(projectId, imageUrl);
    }

    static editProjectDetails(projectId:number, projectData:any){
        return ProjectDb.editProjectDetails(projectId, projectData);
    }

    static deleteProject(projectId:number){
        return ProjectDb.deleteProject(projectId);
    }

    // set managing methods
    //********************************************************** */
    static newSet(setData:any){
        return ProjectDb.newSet(setData);
    }

    static removeSet(setId:any){
        return ProjectDb.removeSet(setId);
    }

    static setSetCompleted(setId:any){
        return ProjectDb.setSetCompleted(setId);
    }

    // task managing methods
    //******************************************************** */
    static newTask(taskData:any){
        return ProjectDb.newTask(taskData);
    }

    static removeTask(taskId:any){
        return ProjectDb.removeTask(taskId);
    }

    static startTask(taskId:any){
        return ProjectDb.setTaskStart(taskId);   
    }

    static completeTask(taskId:any){
        return ProjectDb.setTaskCompleted(taskId);
    }

    static changeTaskStatus(taskId:any, status:TaskStatus){
        return ProjectDb.setTaskStatus(taskId, status)
    }



    // notification

    static getUnseenTasks(userId:any){
        return new Promise((resolve, reject)=>{
            let messagesReturn:any = [];
            ProjectDb.getUnseenTasks(userId)

            .then((sets:any)=>{
                
                let projects:any = {};
                for(let set of sets){
                    let tasks:any = set.tasks;
                    for(let task of tasks){
                        if(projects.hasOwnProperty(set.projectId)){
                            projects[set.projectId].count++;
                        } else{
                            projects[set.projectId] = {
                                count:1,
                                name:set.project.name,
                                image:set.project.imageUrl
                            }
                        }
                    }
                }

                if(Object.keys(projects).length>0){
                    messagesReturn = UtilMethods.getUnseenTasksAttr(projects);
                }                
                
                resolve(messagesReturn);
            })
        })
    }

    static getUnseenTeamContributorJoinRequest(userId:any){
        return new Promise((resolve, reject)=>{
            let requestsReturn:any = [];
            let projectsId:any = {};
            let requestsR:any = {};
            let teamsId:any = {};
            

            TeamDb.getLeaderTeam(userId)

            .then((teams:any)=>{
                if(teams.length>0){
                    for(let team of teams){
                        teamsId[team.id] = {
                            name:team.name
                        }
                    }

                    return ProjectDb.getUnseenTeamProjectJoinRequests(Object.keys(teamsId));
                }
                
                return [];
            })

            .then((requests:any)=>{
                if(requests.length>0){
                    for(let request of requests){
                        projectsId[request.projectId] = {
                            reqId:request.id,
                            teamId:request.teamId
                        };
                    }
                    return ProjectDb.getProjects(Object.keys(projectsId));
                }
                return [];
            })

            .then((projects:any)=>{     
                if(projects.length>0){
                    for(let project of projects){
                        let teamId:any = projectsId[project.id].teamId;
                        
                        let team:any = teamsId[teamId].name;
                        requestsReturn.push({
                            id:projectsId[project.id].reqId,
                            image:project.imageUrl,
                            comment:`Team ${team} is invited to work in project ${project.name}.`,
                            options:UtilMethods.getOptions(NotificationType.ProjectTeamRequest, projectsId[project.id].reqId)
                        })
                        
                    }
                }
                resolve(requestsReturn);
            })
        })
    }

    static getUnseenIndividualContributorJoinRequest(userId:any){
        return new Promise((resolve, reject)=>{
            let requestsReturn:any = [];
            let projectsId:any = {};
            let requestsR:any = {};
            let teamsId:any = {};
            

            ProjectDb.getUnseenIndividualProjectJoinRequests(userId)

            .then((requests:any)=>{
                if(requests.length>0){
                    for(let request of requests){
                        projectsId[request.projectId] = request.id;
                    }
                    return ProjectDb.getProjects(Object.keys(projectsId));
                }
                return [];
            })

            .then((projects:any)=>{     
                if(projects.length>0){
                    for(let project of projects){
                        requestsReturn.push({
                            id:projectsId[project.id],
                            image:project.imageUrl,
                            comment:`You are invited to work in project ${project.name}.`,
                            options:UtilMethods.getOptions(NotificationType.ProjectIndividualRequest, projectsId[project.id])
                        })
                        
                    }
                }
                resolve(requestsReturn);
            })
        })
    }



    // fetch next numbers

    static getNextTasksetNumber(projectId:number):Promise<number>{
        return new Promise((resolve, reject)=>{
            ProjectDb.getNextTasksetNumber(projectId)

            .then((count:number)=>{
                if(count){
                    resolve(++count);
                } else{
                    resolve(0);
                }
            })
        })
    }

    static getNextTaskNumber(projectId:number, tasksetId:number):Promise<number>{
        return new Promise((resolve, reject)=>{
            ProjectDb.getNextTaskNumber(projectId, tasksetId)

            .then((count:number)=>{
                if(count){
                    resolve(++count);
                } else{
                    resolve(0);
                }
            })
        })
    }




    // Authorization
    static checkProjectLeadership(userId:number, projectId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ProjectDb.checkProjectLeadership(userId, projectId)

            .then((project:any)=>{
                if(project){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkContributor(userId:number, projectId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ProjectDb.checkIndividualContributor(userId, projectId)
            
            .then((project:any)=>{
                if(project){
                    resolve(true);
                }
                return TeamS.getTeamIdList(userId);
            })

            .then((teamsId:number[])=>{
                if(teamsId.length>0){
                    return ProjectDb.checkTeamContributor(teamsId, projectId)
                }
            })

            .then((project:any)=>{
                if(project){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkTeamContributor(teamId:number, projectId:number){
        return new Promise((resolve, reject)=>{
            ProjectDb.checkTeamContributor([teamId],projectId)

            .then((project:any)=>{
                if(project){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })            
        })
    }

    static checkIndividualContributorRequestReceiever(userId:number, requestId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ProjectDb.checkIndividualContributorRequestReceiver(userId, requestId)

            .then((result:any)=>{
                if(result[0] && result[1]){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkTeamContributorRequestReceiever(userId:number, teamId:number, requestId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            Promise.all([TeamDb.checkTeamLeadership(userId, teamId), ProjectDb.checkTeamContributorRequestReceiver(teamId, requestId)])

            .then((result:any)=>{
                if(result[0] && result[1]){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

    static checkTaskAssignee(userId:number, taskId:number):Promise<boolean>{
        return new Promise((resolve, reject)=>{
            ProjectDb.checkTaskAssignee(userId, taskId)

            .then((task:any)=>{
                if(task){
                    resolve(true);
                } else{
                    resolve(false);
                }
            })
        })
    }

}