import * as express from "express";
import {ProjectS} from "../models/services/projectServices";
import { SearchFor, TaskStatus } from "../models/models/serviceValues";
import { ProjectConst, UserConst } from "../models/constants/constant";

export class ProjectM{
    static getMyProjects(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;        
        
        ProjectS.getMyProjects(userId, offset, limit)
        
        .then((projects)=>{
            callback({success:true, code:200, message:null ,data: projects});    
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static searchProjects(req:any, callback:any){
        let userId:number = req.thisUser.id;
        let name:string = req.validData.name;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        ProjectS.searchProjects(userId, offset, limit, name)
        
        .then((projects)=>{
            callback({success:true, code:200, message:null ,data: projects});   
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getProjectProfile(req:any, callback:any){
        let projectId:number = req.validData.projectId;
        
        ProjectS.getProject(projectId)

        .then((project)=>{
            callback({success:true, code:200, message:null ,data: project});    
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getContributors(req:any, callback:any){
        let projectId:number = req.validData.projectId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        ProjectS.getContributors(projectId, offset, limit)

        .then((contributors)=>{
            callback({success:true, code:200, message:null ,data: contributors}); 
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getTaskSets(req:any, callback:any){
        let projectId:number = req.validData.projectId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        ProjectS.getTaskSets(projectId, offset, limit)

        .then((tasksets)=>{
            callback({success:true, code:200, message:null ,data: tasksets});     
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static getTasks(req:any, callback:any){
        let tasksetId:number = req.validData.tasksetId;
        let offset:number = req.validData.offset;
        let limit:number = req.validData.limit;
        
        ProjectS.getTasks(tasksetId, offset, limit)

        .then((tasks)=>{
            callback({success:true, code:200, message:null ,data: tasks});      
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }


    // managing methods
    // Project management
    static newProject(req:any, callback:any){
        let validData = req.validData;
        
        ProjectS.newProject(validData)

        .then((status)=>{
            callback({success:true, code:200, message:null ,data: null});      
        })
        
        .catch((err)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static addIndividualContributor(req:any, callback:any){
        let memberId = req.validData.memberId;
        let projectId = req.validData.projectId;

        ProjectS.addIndividualContributor(memberId, projectId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});       
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static replyIndividualContributorJoinRequest(req:any, callback:any){
        let accepted:boolean = req.validData.accepted;
        let decision:string = UserConst.REQUEST.REJECTED;
        let requestId:number = req.validData.requestId;

        if(accepted){
            decision = UserConst.REQUEST.ACCEPTED;
        } else{
            decision = UserConst.REQUEST.REJECTED;
        }
        
        ProjectS.replyIndividualContributorJoinRequest(requestId,decision)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static addTeamContributor(req:any, callback:any){
        let teamId = req.validData.teamId;
        let projectId = req.validData.projectId;

        ProjectS.addTeamContributor(teamId, projectId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});       
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    public static replyTeamContributorJoinRequest(req:any, callback:any){
        let accepted:boolean = req.validData.accepted;
        let decision:string = UserConst.REQUEST.REJECTED;
        let requestId:number = req.validData.requestId;

        if(accepted){
            decision = UserConst.REQUEST.ACCEPTED;
        } else{
            decision = UserConst.REQUEST.REJECTED;
        }
        
        ProjectS.replyTeamContributorJoinRequest(requestId,decision)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});       
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static updateProjectLogo(req:any, callback:any){
        let imageUrl = req.file.filename;
        let projectId = req.validData.projectId;

        ProjectS.updateProjectLogo(projectId, imageUrl)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: {path:imageUrl}});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }
    

    // Set management
    static newSet(req:any, callback:any){
        let validData = req.validData;
        
        ProjectS.newSet(validData)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static completeSet(req:any, callback:any){
        let setId = req.validData.setId;
        
        ProjectS.setSetCompleted(setId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});  
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static removeSet(req:any, callback:any){
        let setId = req.validData.setId;
        
        ProjectS.removeSet(setId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    // Task management
    static newTask(req:any, callback:any){
        let validData = req.validData;
        
        ProjectS.newTask(validData)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static startTask(req:any, callback:any){
        let taskId = req.validData.taskId;
        
        ProjectS.startTask(taskId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static completeTask(req:any, callback:any){
        let taskId = req.validData.taskId;
        
        ProjectS.completeTask(taskId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});   
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static changeTaskStatus(req:any, callback:any){
        let taskId = req.validData.taskId;
        let rTaskStatus = req.validData.status;

        ProjectS.changeTaskStatus(taskId, ProjectConst.TASK_STATUS[rTaskStatus])
        
        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});    
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }
    
    static removeTask(req:any, callback:any){
        let taskId = req.validData.taskId;
        
        ProjectS.removeTask(taskId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }


    static addContributors(req:any, callback:any){
        let projectId = req.validData.projectId;
        let contributorIds = req.validData.contributorIds;
        
        ProjectS.addContributors(projectId, contributorIds)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static removeContributors(req:any, callback:any){
        let projectId = req.validData.projectId;
        let contributorIds = req.validData.contributorIds;
        
        ProjectS.removeContributors(projectId, contributorIds)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static editProjectDetails(req:any, callback:any){
        let projectId = req.validData.projectId;
        let projectData = req.validData.projectData;
        
        ProjectS.editProjectDetails(projectId,projectData)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});     
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }

    static deleteProject(req:any, callback:any){
        let projectId = req.validData.projectId;
        
        ProjectS.deleteProject(projectId)

        .then((status:any)=>{
            callback({success:true, code:200, message:null ,data: null});   
        })
        
        .catch((err:any)=>{
            callback({success:false, code:500, message:"Internal server error",data: null});
        });
    }
}