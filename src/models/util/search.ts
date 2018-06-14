import {DB} from '../db/db';
import {FastSearchResult,SearchType,Project,User,Team,UserSearch,SearchFor, ReturnAttrType} from '../models/serviceValues';
import {UtilMethods} from '../util/util';
import {TeamConst,UserConst,ProjectConst} from '../constants/constant';
import {ChatS} from '../services/chatServices';
import {TeamS} from '../services/teamServices';
import {TeamDb} from '../db/teamDb';

import {ProjectDb} from '../db/projectDb';
import {ProjectS} from '../services/projectServices';

export class SearchS{
    // static searchFast(userId:any, name:string){
    //     return new Promise((resolve, reject)=>{
    //         let searchReturn:any = {
    //             users:[],
    //             teams:[],
    //             projects:[]
    //         }
    //         SearchS.searchUsersFast(userId, name)

    //         .then((users:any)=>{
    //             searchReturn.users = users;
    //             return SearchS.searchTeamsFast(name);
    //         })  

    //         .then((teams:any)=>{
    //             searchReturn.teams = teams;
    //             return SearchS.searchProjectsFast(name);
    //         })

    //         .then((projects:any)=>{
    //             searchReturn.projects = projects;
    //             resolve(searchReturn);
    //         })
    //     })
    // }

    static searchUsersFast(userId:any, name:string,limit=UserConst.USERS_FAST_SEARCH_LIMIT):Promise<FastSearchResult[]>{
        let nameCriteria = name.trim().split(' ');
        return new Promise((resolve, reject)=>{
            return DB.User.findAll({
                limit:limit,
                where:DB.Sequelize.and(DB.Sequelize.or({
                    firstName:{
                        like:`%${nameCriteria[0]}%`
                    }
                    
                },{
                    lastName:{
                        like:`%${nameCriteria[1]}%`
                    }
                }),{
                    id:{
                        ne:userId
                    }
                })
            })

            .then((users:any)=>{    
                resolve(UtilMethods.getFastUserAttr(users));
            })
        })
    }

    // static searchTeamsFast(name:string,limit=TeamConst.TEAMS_FAST_SEARCH_LIMIT):Promise<FastSearchResult[]>{
    //     let nameCriteria = name.trim();
    //     return new Promise((resolve, reject)=>{
    //         TeamDb.getFastSearchRes(nameCriteria,limit)

    //         .then((teams:any)=>{
    //             resolve(UtilMethods.getTeamProjectAttr(teams));
    //         })
    //     })
    // }

    static searchProjectsFast(name:string,limit=ProjectConst.PROJECTS_FAST_SEARCH_LIMIT):Promise<FastSearchResult[]>{
        let nameCriteria = name.trim();
        return new Promise((resolve, reject)=>{
            ProjectDb.getFastSearchRes(nameCriteria,limit)

            .then((projects:any)=>{
                resolve(UtilMethods.getTeamProjectAttr(projects));
            })
        })
    }





    static search(userId:any, name:string){
        return new Promise((resolve, reject)=>{
            let searchReturn:any = {
                users:{},
                teams:{},
                projects:{}
            }

            SearchS.searchUsers(userId,name)

            .then((users:any)=>{
                searchReturn.users = users;
                
                return SearchS.searchTeams(userId, name);
            })  

            .then((teams:any)=>{
                searchReturn.teams = teams;
                //resolve(searchReturn);
                return SearchS.searchProjects(userId, name);
            })

            .then((projects:any)=>{
                searchReturn.projects = projects;
                resolve(searchReturn);
            })
        })
    }

    // detail search results
    static searchUsers(userId:any,name:string, offset=0,limit=UserConst.USERS_SEARCH_LIMIT){
        let nameCriteria = name.trim().split(' ');
        let firstName = nameCriteria.length>0?nameCriteria[0]:"";
        let lastName = nameCriteria.length>1?nameCriteria[1]:"";
        let usersReturn:any = {
            friends:[],
            users:[]
        };
        let friendsId:any[] = [];

        return new Promise((resolve, reject)=>{
            ChatS.getUsers(userId, [UserConst.REQUEST.ACCEPTED],name)

            .then((friends:any)=>{
                usersReturn.friends = friends;

                return ChatS.getUsers(userId, [UserConst.REQUEST.UNDECIDED,UserConst.REQUEST.REJECTED],name);
            })

            .then((users:any)=>{
                usersReturn.users = users;

                resolve(usersReturn);
            })
        })
    }

    static getMyTeams(userId:any, name:string='', searchFor:SearchFor=SearchFor.General,offset=0,limit=TeamConst.TEAMS_SEARCH_LIMIT):Promise<Team[]>{
        let teams:any = [];
        let nameCriteria = name.trim();

        return new Promise((resolve, reject)=>{
            TeamDb.getMemberTeams(userId, nameCriteria)
            
            .then((user:any)=>{
                if(user){
                    teams = teams.concat(user.teams);
                }
                return TeamDb.getLeaderTeams(userId, nameCriteria);
            })

            .then((user:any)=>{
                if(user){
                    teams = teams.concat(user.leader);
                }
                resolve(teams);
            })
        })
    }


    static searchTeams(userId:any, name:string, searchFor:SearchFor=SearchFor.General,offset=0,limit=TeamConst.TEAMS_SEARCH_LIMIT):Promise<Team[]>{
        let teams:any = [];
        let nameCriteria = name.trim();
        let teamsReturn:any = {
            myTeams:[],
            teams:[]
        };
        let teamIds:any = [];

        return new Promise((resolve, reject)=>{
            SearchS.getMyTeams(userId, nameCriteria)
            
            .then((teams:any)=>{
                if(teams.length>0){
                    for(let team of teams){
                        let request = 'Founder';
                        if(team.hasOwnProperty('TeamUsers')){
                            request = team.TeamUsers.request;
                        }

                        let teamR:any;
                        if(searchFor==SearchFor.Specific && (request == 'Accepted' || request == 'Founder')){
                            
                            teamR = UtilMethods.getTeamAttr([team])[0];
                        } else{
                            teamR = UtilMethods.getTeamAttr([team])[0];
                            if(searchFor == SearchFor.General){
                                teamR.request = request;
                            }
                        }
    
                        if(request == 'Accepted' || request == 'Founder'){
                            teamsReturn.myTeams.push(teamR);
                        } else{
                            teamsReturn.teams.push(teamR);
                        }
    
                        teamIds.push(team.id);
                    }
                }
            })

            .then(()=>{
                return TeamDb.getPublicTeams(teamIds,nameCriteria);
            })

            .then((teams:any)=>{
                if(teams && teams.length>0){
                    for(let team of teams){
                        let teamR:any = UtilMethods.getTeamAttr([team])[0];
                        
                        if(team.leaderId==userId){
                            // if(searchFor==SearchFor.General){
                            //     teamR.request = 'Founder';
                            // }
                            
                            // teamsReturn.myTeams.push(teamR);
                        } else{
                            if(searchFor==SearchFor.General){
                                teamR.request = 'Unsent';
                            }
                            
                            teamsReturn.teams.push(teamR);
                        }
                    }
                }
                resolve(teamsReturn);
            })
            
        })
    }

    static getProjectR(project:any,request:string, through:string){
        let projectR:any = UtilMethods.getProjectAttr([project])[0];
        projectR.through = through;
        projectR.request = request;
        return projectR;
    }

    static searchProjects(userId:any, name:string, searchFor:SearchFor=SearchFor.General,offset=0,limit=ProjectConst.PROJECTS_SEARCH_LIMIT):Promise<Project[]>{
        let nameCriteria = name.trim();
        let projectsReturn:any = {
            myProjects:[],
            projects:[]
        };
        let projectIds:any = [];
        let projectIdsR:any = {};

        return new Promise((resolve, reject)=>{
            ProjectDb.getUserOwnedProjects(userId,nameCriteria)
            
            .then((user:any)=>{
                if(user){
                    let projectR:any;

                    for(let project of user.myProjects){
                        projectIdsR[project.id] = true;     // record project id to use it to search public projects

                        if(searchFor==SearchFor.Specific){
                            projectsReturn.myProjects.push(UtilMethods.getProjectAttr([project])[0]);
                        } else{
                            projectsReturn.myProjects.push(SearchS.getProjectR(project,'Founder','Founder'));
                        }
                        
                    }
                }
                return ProjectDb.getIndividualProjects(userId,nameCriteria);
            })
            
            .then((user:any)=>{
                if(user){
                    let projectR:any;                                        
                    for(let project of user.individualProjects){
                        projectIdsR[project.id] = true;     // record project id to use it to search public projects
                        let request = project.projectUsers.request;
                        if(searchFor==SearchFor.Specific){
                            let returnAttrType = request=='Accepted'?ReturnAttrType.Private:ReturnAttrType.Public;
                            
                            projectsReturn.myProjects.push(UtilMethods.getProjectAttr([project])[0]);
                        } else{
                            projectsReturn.myProjects.push(SearchS.getProjectR(project,request,'Individual'));
                        }
                    }
                }
                return ProjectDb.getTeamsProjects(userId, nameCriteria);
            })

            .then((user:any)=>{
                if(user){
                    let projectR:any;
                    for(let team of user.teams){
                        if(team.TeamUsers.request=='Accepted'){
                            for(let project of team.projects){
                                projectIdsR[project.id] = true;     // record project id to use it to search public projects
                                let request = project.projectTeams.request;
                                if(searchFor==SearchFor.Specific){
                                    let returnAttrType = request=='Accepted'?ReturnAttrType.Private:ReturnAttrType.Public;
                                    
                                    projectsReturn.myProjects.push(UtilMethods.getProjectAttr([project])[0]);
                                } else{
                                    projectsReturn.myProjects.push(SearchS.getProjectR(project,request,'Team'));
                                }
                            }
                        }
                    }

                    for(let team of user.teams){
                        for(let project of team.projects){
                            projectIdsR[project.id] = true;     // record project id to use it to search public projects
                            let request = project.projectTeams.request;
                            if(searchFor==SearchFor.Specific){
                                let returnAttrType = request=='Accepted'?ReturnAttrType.Private:ReturnAttrType.Public;

                                projectsReturn.myProjects.push(UtilMethods.getProjectAttr([project])[0]);
                            } else{
                                projectsReturn.myProjects.push(SearchS.getProjectR(project,request,'Team'));
                            }
                        }
                    }
                }
                projectIds = Object.keys(projectIdsR);

                return ProjectDb.getPublicProjects(projectIds);
            })

            .then((projects:any)=>{
                if(projects && projects.length>0){
                    for(let project of projects){
                        if(searchFor==SearchFor.Specific){
                            projectsReturn.projects.push(UtilMethods.getProjectAttr([project])[0]);
                        } else{
                            projectsReturn.projects.push(SearchS.getProjectR(project,'Unsent',''));
                        }
                    }
                }
                resolve(projectsReturn);
            })
            
        })
    }

}