import {TaskStatus} from '../models/serviceValues';
//module.exports.DB = "projecttracker1";

export class DBConst{
    static DB_NAME:string = "projecttrackerfinal";
    static DB_USER:string = "root";
    static DB_PASSWORD:string = "";
    static HOST:string = "localhost";
    static DB_SERVER:string = "mysql";
}

export class AuthConst{
    static SECRET:string = "thisissecret";
}




export const UserConst = {
    START_ID:0,
    USERS_SEARCH_LIMIT:30,
    USERS_FAST_SEARCH_LIMIT:10,
    REQUEST:{
        ACCEPTED:'Accepted',
        REJECTED:'Rejected',
        UNDECIDED:'Undecided',
        REMOVED:'Removed'
    },
    DEFAULT_IMAGE:'43d18e7ae2a93e2865121de8d8f84b68'
}

export const TeamConst = {
    START_ID:0,
    TEAMS_SEARCH_LIMIT:30,
    TEAMS_FAST_SEARCH_LIMIT:10,
    MEMBERS_SEARCH_LIMIT:30,
    DEFAULT_IMAGE:'43d18e7ae2a93e2865121de8d8f84b68'
    
}

export const ProjectConst = {
    START_ID:0,
    PROJECTS_SEARCH_LIMIT:30,
    PROJECTS_FAST_SEARCH_LIMIT:10,
    TASK_STATUS: {
        'approve':TaskStatus.Approved,
        'revise':TaskStatus.Revise
    } as any,
    DEFAULT_IMAGE:'43d18e7ae2a93e2865121de8d8f84b68'
}

export const AnnouncementConst = {
    START_ID:0,
    ANNOUNCEMENT_SHOWN_ONCE:30
}

export const StatConst = {
    TEAM_PERFORMANCE_DURATION:2,    // in month
}

export const ExcludeAuthentication = {
    signin:true,
    signup:true,
    checkUserName:true
}


