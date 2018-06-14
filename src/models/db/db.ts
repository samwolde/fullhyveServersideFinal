import * as Sequelize from 'sequelize';
import {DBConst} from "../constants/constant";

import {UserLog, User, Skill, Team, Message,TeamUser,Contact, Project, ProjectTeam, TaskSets, Task, Announcement, ProjectUser, TeamMemberLastAnnSeen } from "./dbModels";

// const sequelize = new Sequelize('projecttracker', 'projecttracker', 'Fj7G6i-~4Vfx', {
//     host: 'den1.mysql2.gear.host',
//     dialect: 'mysql',
    
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   });

const sequelize = new Sequelize('projecttrackerfinal', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch((err:string) => {
    console.error('Unable to connect to the database:', err);
});

export const DB = {
    sequelize:sequelize,
    Sequelize:Sequelize,
    User:User(sequelize,Sequelize),
    Skill:Skill(sequelize, Sequelize),
    Team:Team(sequelize, Sequelize),
    Announcement:Announcement(sequelize, Sequelize),
    TeamMemberLastAnnSeen:TeamMemberLastAnnSeen(sequelize,Sequelize),
    Message:Message(sequelize,Sequelize),
    TeamUser:TeamUser(sequelize, Sequelize),
    Contact:Contact(sequelize, Sequelize),
    Project:Project(sequelize, Sequelize),
    ProjectTeam:ProjectTeam(sequelize, Sequelize),
    ProjectUser:ProjectUser(sequelize, Sequelize),
    TaskSets:TaskSets(sequelize, Sequelize),
    Task:Task(sequelize, Sequelize),
    UserLog:UserLog(sequelize, Sequelize)
};

// User - skill relation
// create one to many relationship betweeen user and skill
const skill = DB.User.hasMany(DB.Skill);


//Team - member relation
// create many to many relationship between teams and users table
DB.Team.belongsToMany(DB.User, {
    as:'members',
    through:{
        model:DB.TeamUser, 
        unique:false
    }
});

//DB.TeamUser.hasMany(DB.User,{foreignKey:'userId',constraints:false});
//DB.TeamUser.hasMany(DB.Team,{foreignKey:'teamId',constraints:false});

DB.User.belongsToMany(DB.Team, {
    as:'teams',
    through:{
        model:DB.TeamUser, 
        unique:false
    }
});


// create many to one relationship between teams and user(a user can be a leader of many teams)
DB.User.Team = DB.User.hasMany(DB.Team, {as:'leader', foreignKey:'leaderId',sourceKey:'id'});
DB.Team.User = DB.Team.belongsTo(DB.User, {foreignKey:'leaderId', sourceKey:'id'});       

// User - friend realtion
// create friend relationship between users
DB.User.belongsToMany(DB.User, {
    as:'friend', 
    through:{
        model:DB.Contact,
        unique:false
    }
});


// Message - sender relation
DB.Message.belongsTo(DB.User, {foreignKey:'senderId'});     //?????
DB.User.hasMany(DB.Message, {foreignKey:'senderId'});


// Contact - Message relation
// give contactid to message to identify for which chat it belongs to
DB.Contact.hasMany(DB.Message, {as:'chat'});


// Announcement relation
DB.Team.hasMany(DB.Announcement);
DB.User.hasMany(DB.Announcement);
DB.Announcement.belongsTo(DB.User);
DB.Announcement.belongsTo(DB.Team, {foreignKey:'teamId'});
DB.Announcement.hasMany(DB.Announcement,{as:'replies',foreignKey:'mainAnnouncementId'});

DB.Announcement.hasMany(DB.TeamMemberLastAnnSeen, {foreignKey:'lastSeenAnnouncementId'});

DB.Team.hasMany(DB.TeamMemberLastAnnSeen, {foreignKey:'teamId'});

DB.User.hasMany(DB.TeamMemberLastAnnSeen, {foreignKey:'userId'});

// Project - leader relation
// create one to many relationship between user and projects( a user can be a leader of many projects)
const pleader = DB.Project.belongsTo(DB.User, {foreignKey:'leaderId'});
DB.User.hasMany(DB.Project, {as:'myProjects',foreignKey:'leaderId'});

// Project - individual contributor
DB.User.belongsToMany(DB.Project,{as:'individualProjects',through:DB.ProjectUser});
DB.Project.belongsToMany(DB.User, {as:'individualMembers',through:DB.ProjectUser});


// Project - Task
DB.Task.belongsTo(DB.Project, {foreignKey:'projectId'});

// a project can have many teams and one team can be in many projects
DB.Project.belongsToMany(DB.Team, {through:DB.ProjectTeam});
DB.Team.belongsToMany(DB.Project, {through:DB.ProjectTeam});



// TaskSet - Team relation
DB.TaskSets.belongsTo(DB.Team, {as:'team'});

// Project - set relation
// a project has many sets
DB.TaskSets.belongsTo(DB.Project);
DB.Project.hasMany(DB.TaskSets);

// Set - task relation
// a set can have many tasks
DB.TaskSets.hasMany(DB.Task);
DB.Task.belongsTo(DB.TaskSets);

// Task - Assigner
// a user can be a leader of many tasks
DB.Task.belongsTo(DB.User, {as:'assigner'});

// Task - Assignee user
// a task is assigned to one user
DB.Task.belongsTo(DB.User, {as:'assignee'});

// Task - Assignee team
// a team can have many tasks
DB.Task.belongsTo(DB.Team, {as:'assigneeTeam',foreignKey:'assigneeTeamId'});
DB.Team.hasMany(DB.Task, {as:'tasks',foreignKey:'assigneeTeamId'});

// User - UserLog
DB.User.hasMany(DB.UserLog);

sequelize.sync();