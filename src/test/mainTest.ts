import {TestDb} from './testdb';
import {TestTeam} from './testTeam';
import {TestChat} from './testChat';
import {TestSearch} from './testSearch';
import {TestProject} from './testProject';

import {UtilMethods} from '../models/util/util';
import { TestValidation } from './testValidation';

export enum state{
    connected,
    disconnected
}

export class MainTest{
    public static init(){
        TestDb.init(true);
        //TestTeam.init();
        //TestChat.init();
        //TestSearch.init();
        //TestProject.init();
        //TestValidation.init();
    }
}