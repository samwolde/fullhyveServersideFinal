export interface IUser{
    id:number;
    userName:string;
    imageUrl:string;
    firstName:string;
    middleName:string;
    lastName:string;
    email:string;
    phoneNo:string;
    theme:string;
}
/*
export interface IProfession{
    id:number;
    title:string;
}

export interface IExperience{
    id:number;
    description:string;
}

export interface ICommendation{
    id:number;
    name:string;
    commenderId:number;
}

export interface IPastProject{
    id:number;
    projectTitle:string;
    projectId:number;
}*/

export interface IContact{
    id:number;
    userId:number;
    friendId:number;
}
export enum MessageType{
    Received,
    Sent
}

export interface IMessageFriend{
    id:number;
    content:string;
    seen:boolean;
    type:string;
}

export interface IMessage extends IMessageFriend{
    senderId:number;
    contactId:number;
    sendTime:Date;
}

export interface IFriendChat{
    id:number;
    imageUrl:string;
    name:string;
    unseenMessages:number;
    lastOnline:string;
    lastMessage:IMessageFriend;
    online:boolean;
}

export interface ITeam{
    id: string;
    name: string;
    imageUrl: string;
    leader: string;     //shown with relationship
    members: string[];      //shown with relationship
    focus: string;
    projects: string[];
}

export class Contact {      // IFriendChat
    id: string;
    name: string;
    imageUrl: string;
    lastOnline: string;
    unseenMessages: number;
    lastMessage: string; 
}

export class Team {
    id: string;
    name: string;
    imageUrl: string;
    leader: string;
    members: string[];
    focus: string;
    projects: string[];
}

export class MyTeam extends Team {
    chatbox: string;
    teamActivity: number;
    teamPerformance: number;
    teamWeeklyProgress: number;
    teamEfficiency: number;
    teamScheduleAdherence: number;
    teamStatus: string;
    unseenAnnouncements: number;
}

export class User {
    id: string;
    name: string;
    imageUrl: string;
    title: string;
    skills: string[];
    description: string;
    projects: number[];
}

export class Project {
    id: string;
    name: string;
    imageUrl: string;
    leader: string;
    members: string[];
    teams: string[];
}

export class MyProject {
    completion: 42;
    allStages: string[];//['Research', 'Design', 'Implementation', 'Testing', 'Deployment'];
    currentStage: number;
    stageCompletion: number;
    sets: string[];
    currentSet: number;
    setCompletion: number;
    tasks: string[];
    activeTask: string;

    pulse: number;
    userActivity: number;
    userAverageCompletionTimes: number;
    userDeadlineCompliance: number;
    projectScheduleAdherence: number;

    startDate: number;
    stageCompletionDates: number[];
    setCompletionDates: number[];
    stageBurnDown: number[];
    setBurnDown: number[];
    taskBurnDown: number[];
}


export class Message {
    id: string;
    message: string;
    timestamp: string;      // changed to sendTime
    seen: boolean;
    sent: boolean;      // derived from the status message of sending the message

    //must contain
    senderId:number;
    contactId:number;
}

