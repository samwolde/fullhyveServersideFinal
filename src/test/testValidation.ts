import {Validation} from '../models/util/validate';
import {actionRequiredFields} from '../models/util/validationInfo'
import { ValidateM } from '../middlewares/validateM';
import { ProjectS } from '../models/services/projectServices';

export class TestValidation{
    static init(){
        let data = {
            name:'a',
            image:'',
            field:'a',
            description:'kahsfkaa',
            grade:''
        }
    
        console.log(Validation.validateData(data,actionRequiredFields.newProject));

        ProjectS.getNextTasksetNumber(1)

        .then((count:any)=>{
            console.log(count);
        })
    }
}