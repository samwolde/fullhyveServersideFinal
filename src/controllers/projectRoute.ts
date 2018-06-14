import * as express from "express";
import { ProjectM } from "../middlewares/projectM";
import { UploadM } from '../middlewares/uploadImageM';
import { ValidateM } from "../middlewares/validateM";
import { Authorization } from "../middlewares/authorizationM";

// const routers: express.Router = express.Router();

// // get all my teams including ones i created
// routers.post('/getMyProjects', ProjectM.getMyProjects);

// routers.post('/searchProjects', ProjectM.searchProjects);

// routers.post('/getContributors', Authorization.verifyProjectContributor, ProjectM.getContributors);

// routers.post('/getTasksets', Authorization.verifyProjectContributor, ProjectM.getTaskSets);

// routers.post('/getTasks', Authorization.verifyProjectContributor, ProjectM.getTasks);


// // managing routes
// // Project
// routers.post('/newProject', ValidateM.validateNewProject, ProjectM.newProject);

// // joined
// //==========
// routers.post('/addIndividualContributor', Authorization.verifyProjectLeadership, ProjectM.addIndividualContributor);
// routers.post('/addTeamContributor', Authorization.verifyProjectLeadership, ProjectM.addTeamContributor);
// //===========

// routers.post('/replyIndividualContributorJoinRequest/:decision', Authorization.verifyIndividualContributorRequestReceiver, ProjectM.replyIndividualContributorJoinRequest);

// routers.post('/replyTeamContributorJoinRequest/:decision', Authorization.verifyTeamContributorRequestReceiver, ProjectM.replyTeamContributorJoinRequest);

// // Set
// routers.post('/newTaskset', Authorization.verifyProjectLeadership, ValidateM.validateNewTaskset, ProjectM.newSet);

// routers.post('/deleteTaskset', Authorization.verifyProjectLeadership, ProjectM.removeSet);

// // Task
// routers.post('/newTask', Authorization.verifyTaskAssignable, ValidateM.validateNewTask, ProjectM.newTask);

// routers.post('/startTask', Authorization.verifyTaskAssignee, ProjectM.startTask);

// routers.post('/completeTask', Authorization.verifyTaskAssignee, ProjectM.completeTask);

// routers.post('/changeTaskStatus/:taskStatus', Authorization.verifyProjectLeadership, ProjectM.changeTaskStatus);

// routers.post('/deleteTask', Authorization.verifyProjectLeadership, ProjectM.removeTask);

// // to be added

// routers.post('/addContributors', Authorization.verifyProjectLeadership, ProjectM.addContributors);

// routers.post('/removeContributors', Authorization.verifyProjectLeadership, ProjectM.removeContributors);

// routers.post('/editProjectDetails', Authorization.verifyProjectLeadership, ProjectM.editProjectDetails);

// routers.post('/deleteProject', Authorization.verifyProjectLeadership, ProjectM.deleteProject);

// routers.post('/getMyProjectProfile', Authorization.verifyProjectLeadership, ProjectM.getProjectProfile);

// export = routers;

export class ProjectR {
    static init(): express.Router {
        let routers: express.Router = express.Router();

        // get all my teams including ones i created
        routers.post('/getMyProjects', ProjectM.getMyProjects);

        routers.post('/searchProjects', ProjectM.searchProjects);

        routers.post('/getContributors', Authorization.verifyProjectContributor, ProjectM.getContributors);

        routers.post('/getTasksets', Authorization.verifyProjectContributor, ProjectM.getTaskSets);

        routers.post('/getTasks', Authorization.verifyProjectContributor, ProjectM.getTasks);


        // managing routes
        // Project
        routers.post('/newProject', ValidateM.validateNewProject, ProjectM.newProject);

        // joined
        //==========
        routers.post('/addIndividualContributor', Authorization.verifyProjectLeadership, ProjectM.addIndividualContributor);
        routers.post('/addTeamContributor', Authorization.verifyProjectLeadership, ProjectM.addTeamContributor);
        //===========

        routers.post('/replyIndividualContributorJoinRequest/:decision', Authorization.verifyIndividualContributorRequestReceiver, ProjectM.replyIndividualContributorJoinRequest);

        routers.post('/replyTeamContributorJoinRequest/:decision', Authorization.verifyTeamContributorRequestReceiver, ProjectM.replyTeamContributorJoinRequest);

        // Set
        routers.post('/newTaskset', Authorization.verifyProjectLeadership, ValidateM.validateNewTaskset, ProjectM.newSet);

        routers.post('/deleteTaskset', Authorization.verifyProjectLeadership, ProjectM.removeSet);

        // Task
        routers.post('/newTask', Authorization.verifyTaskAssignable, ValidateM.validateNewTask, ProjectM.newTask);

        routers.post('/startTask', Authorization.verifyTaskAssignee, ProjectM.startTask);

        routers.post('/completeTask', Authorization.verifyTaskAssignee, ProjectM.completeTask);

        routers.post('/changeTaskStatus/:taskStatus', Authorization.verifyProjectLeadership, ProjectM.changeTaskStatus);

        routers.post('/deleteTask', Authorization.verifyProjectLeadership, ProjectM.removeTask);

        // to be added

        routers.post('/addContributors', Authorization.verifyProjectLeadership, ProjectM.addContributors);

        routers.post('/removeContributors', Authorization.verifyProjectLeadership, ProjectM.removeContributors);

        routers.post('/editProjectDetails', Authorization.verifyProjectLeadership, ProjectM.editProjectDetails);

        routers.post('/deleteProject', Authorization.verifyProjectLeadership, ProjectM.deleteProject);

        routers.post('/getMyProjectProfile', Authorization.verifyProjectLeadership, ProjectM.getProjectProfile);

        return routers;
    }
}
