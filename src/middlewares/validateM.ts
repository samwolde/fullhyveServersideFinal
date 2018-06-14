import * as express from "express";
import {UtilMethods} from '../models/util/util';
import { TaskStatus } from "../models/models/serviceValues";
import { UserConst, TeamConst, ProjectConst } from "../models/constants/constant";
import { ProjectS } from "../models/services/projectServices";

export class ValidateM{
    // public static validateLoginInfo(req:any, res:express.Response, next:express.NextFunction){
    //     let loginInfo = req.validData;
    //     let validLoginInfo = {
    //         userName:loginInfo.userName,
    //         password:loginInfo.password
    //     }
        
    //     req.validLoginInfo = validLoginInfo;
    //     next();
    // }
    
    // public static validateUpdateUser(req:any, res:express.Response, next:express.NextFunction){
    //     let rUser = req.body;
    //     let userId = req.thisUser.id;
    //     let skills = [];
    //     for(let skill of rUser.skills){
    //         skills.push({
    //             skill:skill,
    //             userId:userId
    //         })
    //     }

    //     let user = {
    //         userName:rUser.userName,
    //         password:rUser.password,
    //         imageUrl:rUser.imageUrl && rUser.imageUrl.trim() != '' ? rUser.imageUrl:'43d18e7ae2a93e2865121de8d8f84b68',
    //         firstName:rUser.firstName,
    //         lastName:rUser.lastName,
    //         email:rUser.email,
    //         title:rUser.title,
    //         skills:skills,
    //         description:rUser.description
    //     }

    //     if(user.password == null || user.password.trim()==''){
    //         delete user.password;
    //     } 

    //     req.validData = user;

    //     next();        
    // }

    // public static validateNewTaskImage(req:any, res:express.Response, next:express.NextFunction){
    //     let rTaskImage = req.body;
    //     console.log(req);
    //     let taskImage = {
    //         src:'',
    //         description:rTaskImage.description,
    //         taskId:rTaskImage.taskId
    //     }

    //     req.validData = taskImage;

    //     next();
    // }




    // completion

    public static validateNewUser(req:any, res:express.Response, next:express.NextFunction){
        let rUser = req.body;
        
        let user = {
            userName:rUser.userName,
            password:rUser.password,
            firstName:rUser.firstName,
            lastName:rUser.lastName,
            image:UserConst.DEFAULT_IMAGE
        }

        req.validData = user;
        next();         
    }

    public static validateNewTeam(req:any, res:express.Response, next:express.NextFunction){
        let rTeam = req.validData;
        
        let teamR = {
            name:rTeam.name,
            image:rTeam.image && rTeam.image.trim() != '' ? rTeam.image:TeamConst.DEFAULT_IMAGE,
            focus:rTeam.focus,
            description:rTeam.description,
            leaderId:req.thisUser.id
        }

        req.validData = {
            team: teamR,
            members: rTeam.members
        };

        next();
    }

    public static validateNewProject(req:any, res:express.Response, next:express.NextFunction){
        let rProject = req.validData;

        let projectR = {
            name:rProject.name,
            image:rProject.image && rProject.image.trim() != '' ? rProject.image:ProjectConst.DEFAULT_IMAGE,
            field:rProject.field,
            description:rProject.description,
            leaderId:req.thisUser.id
        }

        req.validData = projectR;

        next();
    }

    public static validateNewTaskset(req:any, res:express.Response, next:express.NextFunction){
        let rTaskset = req.validData;
        
        ProjectS.getNextTasksetNumber(rTaskset.projectId)

        .then((nextNumber:number)=>{
            if(nextNumber){
                let taskset = {
                    name:rTaskset.name,
                    number:nextNumber,
                    description:rTaskset.description,
                    assignmentDate:new Date(),
                    deadline:rTaskset.deadline,
                    teamId:rTaskset.teamId,
                    projectId:rTaskset.projectId
                }
                
                req.validData = taskset;
        
                next();
            } else{
                res.status(500).send({status:false});
            }
        })

        
    }

    public static validateNewTask(req:any, res:express.Response, next:express.NextFunction){
        let rTask = req.validData;

        ProjectS.getNextTaskNumber(rTask.projectId, rTask.tasksetId)
        
        .then((nextNumber:number)=>{
            if(nextNumber){
                let task = {
                    title:rTask.title,
                    number:nextNumber,
                    description:rTask.description,
                    assignmentDate:new Date(),
                    deadline:rTask.deadline,
                    assignerId:rTask.assignerId,
                    assigneeId:rTask.assigneeId,
                    assigneeTeamId:rTask.assigneeTeamId,
                    tasksetId:rTask.tasksetId,
                    status:TaskStatus.Waiting
                }
                
                req.validData = task;
        
                next();
            } else{
                res.status(500).send({status:false});
            }
        })
    }
}