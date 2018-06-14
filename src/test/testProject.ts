import {ProjectS} from '../models/services/projectServices';
import {ProjectDb} from '../models/db/projectDb';
import {DB} from '../models/db/db';
export class TestProject{
    static init(){
        // ProjectDb.getUserOwnedProjects(2)
        // //ProjectS.getMyProjects(2)
        // //ProjectS.getMyProjectsIds(2)
        // //ProjectS.getTeamProjects(1)
        // //ProjectS.getContributors(1)
        // //ProjectS.getProjectSets(2)

        // //ProjectS.getTasks(4)

        // .then((projects:any)=>{
        //     console.log(projects.myProjects);
        // })

        // ProjectS.getUnseenTasks(2)

        // .then((projects:any)=>{
        //     console.log(projects);
        // })
        ProjectS.checkContributor(1,1)

        .then((project:any)=>{
            console.log('Reqeust has been accepted: ')
            console.log(project);
        })
    }
}