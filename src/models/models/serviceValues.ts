export class FastSearchResult{
    id:string;
    name:string;
    image:string;
}

export enum SearchFor{
    General,    // general search result
    Specific    // search in the specific place
}

export enum ReturnAttrType{
    Private,
    Public
}  

export enum SearchType{
    Fast,
    Normal,
    Detail
}

export class LoginResponse {
    status: boolean;
    token: string;      // use headers to transfer tokens
    errorMessage: string;
}

export class Team {
    id: string;
    name: string;
    image: string;
    description: string;
    leader: User;
    memberCount: number;
}

export class MinTeam{
    id:string;
    name:string;
    image:string;
}

export class TeamForProject extends Team{
    contract:Contract;
}

export class Message {
    id: string;
    message: string;
    timestamp: string;
    seen: boolean;  
}

export class TeamChatMessage extends Message {
    sender: User;   // found from relation
}

export class Announcement {
    mainMessage: TeamChatMessage;
    replies: TeamChatMessage[];
}

export class MyTeam extends Team {
    teamPerformance: number;
    teamPerformanceChange: number;
    teamWeeklyProgress: number;
    teamWeeklyProgressChange: number;
    teamScheduleAdherence: number;
    teamScheduleAdherenceChange: number;
    teamStatus: string;
    unseenAnnouncements: number;
}

export class Graph {
    control: string;
    value: number;
}

export class SearchTeams {
    teams: Team[];
    myteams: MyTeam[];
}

export class SearchProjects {
    projects: Project[];
    myprojects: MyProject[];
}

export class User {
    id: string;
    firstName:string;
    lastName: string;
    image: string;
    title: string;
    skills: string[];
    description: string;
}

export class MinUser{
    id:string;
    firstName:string;
    lastName:string;
    image:string;
}

export class Identity extends User{
    userName:string;
    email:string;
}

export class UserSearch extends User{
    request:string
}

export class Contact extends User {
    online: boolean;
    lastOnline: string;
    unseenMessages: number;
    lastMessage: ChatMessage;   // use ChatMessage obj instead of string
    //?sentLastMessage: boolean;     // contained in ChatMessage obj
}

export class ChatMessage extends Message{
    type:string;
}

export enum MessageStastus {
    UnSent,
    Seen,
    Sent
}

export class VisibilityGroup {
    users: User[];
    teams: Team[];
    userGroup: ProjectUserGroup;
}

export enum ProjectUserGroup {
    founder,
    admin,
    supervisor,
    contributor
}

export enum TeamUserGroup {
    founder,
    admin,
    member
}

export class UserProjectLink {
    userGroup: ProjectUserGroup;
    user: User;
    project: Project;
}

export class Image {
    src: string;
    description: string;
}

export class ImageSet {
    images: Image[];
}

export class Pitch {
    user: User;
    pitch: string;
}

export class TransferRequest {
    id: string;
    requester: User;
    task: Task;
    message: string;
}

export enum TaskStatus{
    Waiting,
    InProgress,
    PendingEvaluation,
    Approved,
    Revise
}

export class Task {
    id: string;
    number: number;
    title: string;
    description: string;
    priority: string;
    //tag: string[];  //
    pitches: Pitch[];   //
    status: number; // 0 if waiting, 1 if in progress, 2 if pending evaluation, 3 if confirmed, 4 if needs revision
    assignmentDate:string;
    startDate:string;
    deadline: string;
    completionDate:string;
    assigner: User; //
    assignee: User; //
    assigneeTeam: Team; //
    //supervisor: User;   //
    //transferRequests: TransferRequest[];//
    images:ImageSet; //
    difficulty:number;
}

export class Notification{
    id:string;
    image:string;
    comment:string;
    options:Option[];
}

export class Option{
    navigate:boolean;
    name:string;    //Accept Decline    View
    type:NotificationType;
}

export class TaskOption extends Option{
    taskId:string;
}

export enum NotificationType{
    FriendRequest,//
    TeamRequest,//
    ProjectTeamRequest,//
    ProjectIndividualRequest,//
    Assignment
}

export class TaskSet {
    id: string;
    name: string;
    number: number;
    assignmentDate:string;
    deadline: string;
    completionDate:string;
    description: string;
    tasks: Task[];
    setCompletion: number;
    stage:Stage;
}

export class Project {
    id: string;
    name: string;
    image: string;
    description: string;
    field: string;
    leader: User;
    contributorCount: number;   //counted upon request
}

export class MyProject extends Project {
    allStages: Stage[];
    currentStage: Stage;
    stageCompletion: number;

    pulse: number;  
    userActivity: number;
    userAverageCompletionTimes: number;
    userDeadlineCompliance: number;
    projectScheduleAdherence: number;

    startDate: string;
    finalDate: string;
    completionDate: string;
    stageBurnDown: Graph[];
    setBurnDown: Graph[];
    taskBurnDown: Graph[];
}

export class Contributors{
    teams:Team[];
    individuals:User[];
    count:number;
}

export class Stage{
    id:string;     
    stage:string;   //['Research', 'Design', 'Implementation', 'Testing', 'Deployment']
    startDate:string;
    deadline:string;
    completionDate:string;
    stageNo:number;
    stageValue:number;
}

export class Contract{
    id:string;
    contractStartDate:string;
    contractExpirationDate:string;
}


