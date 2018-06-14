import {TeamS} from '../models/services/teamServices';
import {TeamDb} from '../models/db/teamDb';
import {SearchS} from '../models/util/search';
import { SearchFor } from '../models/models/serviceValues';
export class TestTeam{
    static init(){
        //TeamS.getMyTeams(2)

        // .then((res)=>{
        //     console.log(res);
        // })
        // TeamS.getPublicTeams(3,'re')
        
        // .then((teams)=>{
        //     console.log(teams);
        // });
        // TeamS.getTeamMembers(2)
        
        // .then((members)=>{
        //     console.log(members);
        // });

        //TeamS.getTeamAnnouncement(4,1)
        TeamDb.getLastAnnId(4,1)
        
        // .then((announcements:any)=>{
        //     console.log(announcements);
        // });
        //TeamS.getTeamIdList(2);
        //TeamS.testMet();

        //TeamS.getFriends(2);

        //SearchS.searchTeams(3,'bl',SearchFor.Specific)


        .then((res:any)=>{
            console.log(res);
        })
    }
}