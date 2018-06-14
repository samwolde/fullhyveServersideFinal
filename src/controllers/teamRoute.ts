import * as express from "express";
import { TeamM } from "../middlewares/teamM";
import { UploadM } from '../middlewares/uploadImageM';
import { ValidateM } from "../middlewares/validateM";
import { Authorization } from "../middlewares/authorizationM";

// const routers: express.Router = express.Router();

// // get all my teams including ones i created
// routers.post('/getMyTeams', TeamM.getMyTeams);

// routers.post('/searchTeams', TeamM.searchTeams);

// routers.post('/getTeamMembers', Authorization.verifyTeamMembership, TeamM.getTeamMembers);

// routers.post('/getTeamProjects', Authorization.verifyTeamMembership, TeamM.getTeamProjects);

// routers.post('/getTeamAnnouncements', Authorization.verifyTeamMembership, TeamM.getTeamAnnouncement);

// //routers.post('/getTeamDetailGraph', TeamM.getGraph);

// routers.post('/announce', Authorization.verifyTeamMembership, TeamM.announceAndReply);

// routers.post('/reply', Authorization.verifyTeamMembership, TeamM.announceAndReply);

// routers.post('/updateAnnouncementSeen', Authorization.verifyTeamMembership, TeamM.updateAnnouncementSeen);

// //routers.post('/setTeamLogo', UploadM.upload, TeamM.setTeamLogo);


// //managing routes
// routers.post('/newTeam', ValidateM.validateNewTeam, TeamM.addNewTeam);

// routers.post('/addMembers', Authorization.verifyTeamLeadership, TeamM.addTeamMember);

// routers.post('/removeMembers', Authorization.verifyTeamLeadership, TeamM.removeTeamMember);

// routers.post('/replyTeamJoinRequest/:decision', Authorization.verifyTeamJoinRequestReceiver, TeamM.replyTeamJoinRequest);

// // to be added?????????????????????????????
// routers.post('/editAnnouncementReply', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.editAnnouncementReply);

// routers.post('/deleteAnnouncement', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.deleteAnnouncement);

// routers.post('/deleteReply', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.deleteReply);

// routers.post('/editTeamProfile', Authorization.verifyTeamLeadership, TeamM.editTeamProfile);

// routers.post('/deleteTeam', Authorization.verifyTeamLeadership, TeamM.deleteTeam);

// routers.post('/getMyTeamProfile', Authorization.verifyTeamLeadership, TeamM.getTeamProfile);

// export = routers;


export class TeamR {
    static init(): express.Router {
        let routers: express.Router = express.Router();

        // get all my teams including ones i created
        routers.post('/getMyTeams', TeamM.getMyTeams);

        routers.post('/searchTeams', TeamM.searchTeams);

        routers.post('/getTeamMembers', Authorization.verifyTeamMembership, TeamM.getTeamMembers);

        routers.post('/getTeamProjects', Authorization.verifyTeamMembership, TeamM.getTeamProjects);

        routers.post('/getTeamAnnouncements', Authorization.verifyTeamMembership, TeamM.getTeamAnnouncement);

        //routers.post('/getTeamDetailGraph', TeamM.getGraph);

        routers.post('/announce', Authorization.verifyTeamMembership, TeamM.announceAndReply);

        routers.post('/reply', Authorization.verifyTeamMembership, TeamM.announceAndReply);

        routers.post('/updateAnnouncementSeen', Authorization.verifyTeamMembership, TeamM.updateAnnouncementSeen);

        //routers.post('/setTeamLogo', UploadM.upload, TeamM.setTeamLogo);


        //managing routes
        routers.post('/newTeam', ValidateM.validateNewTeam, TeamM.addNewTeam);

        routers.post('/addMembers', Authorization.verifyTeamLeadership, TeamM.addTeamMember);

        routers.post('/removeMembers', Authorization.verifyTeamLeadership, TeamM.removeTeamMember);

        routers.post('/replyTeamJoinRequest/:decision', Authorization.verifyTeamJoinRequestReceiver, TeamM.replyTeamJoinRequest);

        // to be added?????????????????????????????
        routers.post('/editAnnouncementReply', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.editAnnouncementReply);

        routers.post('/deleteAnnouncement', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.deleteAnnouncement);

        routers.post('/deleteReply', Authorization.verifyAnnouncementOrReplyOwnership, TeamM.deleteReply);

        routers.post('/editTeamProfile', Authorization.verifyTeamLeadership, TeamM.editTeamProfile);

        routers.post('/deleteTeam', Authorization.verifyTeamLeadership, TeamM.deleteTeam);

        routers.post('/getMyTeamProfile', Authorization.verifyTeamLeadership, TeamM.getTeamProfile);

        return routers;
    }
}
