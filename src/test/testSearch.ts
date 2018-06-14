import {SearchS} from '../models/util/search';
import {SearchType, SearchTeams,SearchFor} from '../models/models/serviceValues'; 

export class TestSearch{
    static init(){
        //SearchS.searchTeams(2,'',SearchFor.General)
        //SearchS.search(2,'')
        SearchS.getMyTeams(1,'bla')
        
        .then((usrs)=>{
            console.log(usrs);
        });
    }
}