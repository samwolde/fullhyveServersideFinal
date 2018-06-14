import {DB} from "../models/db/db";
import {Authentication} from '../middlewares/authenticationM';
import {UtilMethods} from '../models/util/util';
import { setTimeout } from "timers";

export class TestDb{
    static init(newDb:boolean){
        TestDb.initDb(newDb);
        //TestDb.addTask();
        //TestDb.addProject();
    }
    public static initDb(newDb:boolean){
        DB.sequelize.sync({force:newDb})
        
        .then(()=>{
            return new Promise((resolve, reject)=>{
                for(let i of testUser){
                    DB.User.create(i,{
                        include:[DB.Skill]
                    }).then(()=>{
                        resolve();
                    });
                }
            })
            
        })
        
        .then(()=>{
            return new Promise((resolve, reject)=>{
                DB.Team.bulkCreate(testTeam)
                
                .then(()=>{
                    resolve();
                });
            })
            
        })

        .then(()=>{
            return new Promise((resolve, reject)=>{
                for(var i=0;i<testContacts.length;i++){
                    for(let j=1; j<testContacts[i].length;j++){
                        DB.Contact.create({
                            userId:testContacts[i][0],
                            friendId:testContacts[i][j]
                        });;
                    }
                }
    
                for(var i=0;i<testTeamMembers.length;i++){
                    for(let j=1; j<testTeamMembers[i].length;j++){
                        DB.TeamUser.create({
                            teamId:testTeamMembers[i][0],
                            userId:testTeamMembers[i][j]
                        });
                    }
                }
                resolve();
            })
        })
        
        .then(()=>{
            DB.Message.bulkCreate(testMessages);
        })
        
        .then(()=>{
            DB.Announcement.bulkCreate(testAnnouncement);
        })

        .then(()=>{
            DB.Project.bulkCreate(testProject);
        })

        .then(()=>{
            DB.ProjectTeam.bulkCreate(testProjectTeams);
        })

        .then(()=>{
            DB.ProjectUser.bulkCreate(testProjectUser);
        })

        .then(async ()=>{
            await DB.TaskSets.bulkCreate(testSet);
        })

        .then(async ()=>{
            await DB.Task.bulkCreate(testTask);
        })

        .catch(()=>{
            console.log("Error: Creating initial database values");
        });
    }

    static async addTask(){
        await DB.Task.bulkCreate(testTask);
    }

    static addProject(){
        let project = {
            name:'MySQL',
            description:`The world's most popular open source database with easy administration, excellent read performance, and transparent support for large text and binary objects make it the top choice for many Web sites.`,
            field:'Database',
            startDate:new Date(2017,10,15),
            finalDate:new Date(2019,3,15),
            leaderId:1
        };
        DB.Project.create(project)
        
        .then((proj:any)=>{
            proj.currentStageId = proj.stages[0].id;
            proj.save();
            //console.log(proj.stages[0].id);
        });
    }
}

const testUser = [
    {
        userName:'samwolde',
        password:'$2a$10$b4KVChHblYZoNAzSl0eKCu4CHfjJ.Ky76KhKSlGXkyJnparaQKE7i',    //1234
        firstName:'Samuel',
        middleName:'Woldemariam',
        lastName:'Kediso',
        email:'samuelwoldemariam@yahoo.com',
        phoneNo:'0910713717',
        title:'Software engineer',
        skills:[
            {skill:'Python'}, 
            {skill:'Js'}, 
            {skill:'Angular'}, 
            {skill:'NodeJs'},
            {skill:'C#'} 
        ],
        description:''
    },
    {
        userName:'abekebe',
        password:'$2a$10$3XxShnlYq2es77zmkLfJzekb9MgnYbmxDFMAyRK8I0AzwSu/4MnrG',    //123
        firstName:'Abebe',
        middleName:'Kebede',
        lastName:'Ayele',
        email:'abebekebede@yahoo.com',
        phoneNo:'0911554863',
        title:'Software engineer',
        skills:[
            {skill:'Python'}, 
            {skill:'Js'}, 
            {skill:'Angular'}
        ],
        description:''
    },
    {
        userName:'mulekebe',
        password:'$2a$10$XmlAMkIegJZhSpdZSb6KjeTRtGu.9kFjycgkQzAV36bdgQxKjWOeq',    //12345
        firstName:'Mulugeta',
        middleName:'Kebede',
        lastName:'Admassu',
        email:'mulugetakebede@yahoo.com',
        phoneNo:'0919634525',
        title:'Software engineer',
        skills:[
            {skill:'Js'},
            {skill:'NodeJs'},
            {skill:'C#'} 
        ],
        description:''
    },
    {
        userName:'yonhaile',
        password:'$2a$10$IPyHIBP432yCgVoITrobN.zPALeLBbYwCaJeVpXcWx0aV2p6tWnqS',    //6789
        firstName:'Yonas',
        middleName:'Haile',
        lastName:'Shimeles',
        email:'yonashaile@yahoo.com',
        phoneNo:'0916321548',
        title:'Software engineer',
        skills:[
            {skill:'Python'}, 
            {skill:'Js'},
            {skill:'C#'} 
        ],
        description:''
    },
    {
        userName:'jondoe',
        password:'$2a$10$IPyHIBP432yCgVoITrobN.zPALeLBbYwCaJeVpXcWx0aV2p6tWnqS',        //6789
        firstName:'Jon',
        middleName:'Doe',
        lastName:'Doe',
        email:'jondoe@yahoo.com',
        phoneNo:'0916321548',
        title:'Software engineer',
        skills:[
            {skill:'Python'}, 
            {skill:'Js'},
        ],
        description:''
    },
    {
        userName:'alexmarc',
        password:'$2a$10$IPyHIBP432yCgVoITrobN.zPALeLBbYwCaJeVpXcWx0aV2p6tWnqS',    //6789
        firstName:'Alex',
        middleName:'Marcus',
        lastName:'Pablo',
        email:'alexpab@yahoo.com',
        phoneNo:'0916321548',
        title:'Graphic designer',
        skills:[
            {skill:'Python'}, 
            {skill:'Js'},
            {skill:'Shader'}
        ],
        description:''
    },

];
const testTeam = [
    {
        name:'Red',
        focus:'Graphic design',
        leaderId:4
    },
    {
        name:'Blue',
        focus:'UI design',
        leaderId:2
    },
    {
        name:'Green',
        focus:'Databse design',
        leaderId:3
    },
    {
        name:'Black',
        focus:'AI',
        leaderId:1
    }
];

const testMessages = [
    {
        senderId:1,
        contactId:1,
        message: 'Do no wrong, amirite?',
        seen: false
    },
    {
        senderId:2,
        contactId:4,
        message: 'Technically, no. Because you are repeating yourself. A man knows nothing about most of what he speaks of, and that saying is all too true in your case.',
        seen: true
    },
    {
        senderId:3,
        contactId:4,
        message: 'So no meeting on the morrow? A shame, since I was kinda looking forward to it',
        seen: true
    },
    {
        senderId:4,
        contactId:6,
        message: 'Perhaps. I\'m not one to assume.',
        seen: true
    }
  ];
  
class Methods{
    static addNewTeam(team:any){

    }
}
const testTeamMembers:number[][] = [
    [1,2,3],
    [2,1,4],
    [3,1,2,4],
    [4,3,4]
];

const testContacts:number[][] = [
    [1,2,3],
    [2,4],
    [3,2,4],
    [4,1]
];

const testAnnouncement = [
    {
        message:'There will be a meeting tommorow',
        userId:2,
        teamId:1,
    },
    {
        message:'The deadline is posponed for next month',
        userId:3,
        teamId:1
    },
    {
        message:'Meeting postponed',
        userId:1,
        teamId:2
    },
    {
        message:'There will be a meeting tommorow',
        userId:4,
        teamId:2
    },
    {
        message:'New project first meeting',
        userId:3,
        teamId:4
    },
    {
        message:'There will be a meeting today',
        userId:4,
        teamId:4
    },

];

const testProject = [
    {
        name:'MySQL',
        description:`The world's most popular open source database with easy administration, excellent read performance, and transparent support for large text and binary objects make it the top choice for many Web sites.`,
        field:'Database',
        startDate:new Date(2017,10,15),
        finalDate:new Date(2019,3,15),
        leaderId:1,
    },
    {
        name:'Ubuntu',
        description:`Ubuntu is a Debian-based Linux operating system developed to increase usability and ease of use. `,
        field:'OS',
        startDate:new Date(2015,8,15),
        finalDate:new Date(2017,6,15),
        leaderId:2,
    },
    {
        name:'Apache',
        description:`The Apache HTTP Server Project is an effort to develop and maintain an open-source HTTP server for modern operating systems including UNIX and Windows.`,
        field:'Server',
        startDate:new Date(2016,4,15),
        finalDate:new Date(2018,2,15),
        leaderId:3,
    }
];

const testProjectTeams = [
    {
        projectId:1,
        teamId:1,
        request:'Accepted'
    },
    {
        projectId:1,
        teamId:2,
        request:'Accepted'
    },
    {
        projectId:1,
        teamId:4,
        request:'Accepted'
    },
    {
        projectId:2,
        teamId:3,
        request:'Accepted'
    },
    {
        projectId:2,
        teamId:4,
    },
    {
        projectId:3,
        teamId:1,
        request:'Accepted'
    },
    {
        projectId:3,
        teamId:4
    }
];

const testProjectUser = [
    {
        projectId:1,
        userId:4,
        request:'Accepted'
    },
    {
        projectId:1,
        userId:6,
        request:'Accepted'
    },
    {
        projectId:2,
        userId:2,
        request:'Accepted'
    },
    {
        projectId:3,
        userId:5,
        request:'Accepted'
    }
];

const testSet = [
    {
        name:'Query generation',
        number:1,
        projectId:1,
        description:'',
        assignmentDate:new Date('2017-11-01'),
        startDate:new Date('2017-11-03'),
        deadline:new Date('2017-12-15'),
        completionDate:new Date('2017-12-20'),
    },
    {
        name:'Query execution',
        number:1,
        projectId:1,
        description:'',
        assignmentDate:new Date('2017-11-01'),
        startDate:new Date('2017-11-03'),
        deadline:new Date('2017-12-15'),
        completionDate:new Date('2017-12-10'),
    },
    {
        name:'Terminal',
        number:1,
        projectId:2,
        description:'',
        assignmentDate:new Date('2015-09-01'),
        startDate:new Date('2015-09-03'),
        deadline:new Date('2015-10-15'),
        completionDate:new Date('2015-10-20'),
    },
    {
        name:'System calls',
        number:1,
        projectId:2,
        description:'',
        assignmentDate:new Date('2015-10-01'),
        startDate:new Date('2015-10-03'),
        deadline:new Date('2015-10-15'),
        completionDate:new Date('2015-10-13'),
    },
    {
        name:'Socket programming',
        number:1,
        projectId:3,
        description:'',
        assignmentDate:new Date('2017-02-01'),
        startDate:new Date('2017-02-03'),
        deadline:new Date('2017-02-15'),
        completionDate:new Date('2017-02-20'),
    },
    {
        name:'Request handling',
        number:1,
        projectId:3,
        description:'',
        assignmentDate:new Date('2017-02-01'),
        startDate:new Date('2017-02-03'),
        deadline:new Date('2017-02-15'),
        completionDate:new Date('2017-02-12'),
    }
];

const testTask = [
    {
        number:1,
        title:'Create directory',
        description:'',
        priority:'',
        assignmentDate:new Date('2015-10-01'),
        startDate:new Date('2015-10-03'),
        deadline:new Date('2015-10-10'),
        completionDate:new Date('2015-10-10'),  
        assignerId:1,
        assigneeId:2,
        assigneeTeamId:3,
        tasksetId:1,
        projectId:1
    }
]
