import * as express from "express";
import {UserM} from "../middlewares/userM";
import {Authentication} from "../middlewares/authenticationM";
import { ValidateM } from "../middlewares/validateM";
import {UploadM} from '../middlewares/uploadImageM';
import { Authorization } from "../middlewares/authorizationM";
import { Validation } from "../models/util/validate";

// const routers:express.Router = express.Router();

// // no authentication

// routers.post('/signup', ValidateM.validateNewUser, Authentication.hashPassword, UserM.register);

// routers.post('/checkUserName', UserM.checkUsername);

// // authentication

// routers.post('/signin', Validation.validate, Authentication.createToken);


// routers.use(Authentication.verifyToken);

// routers.use(Validation.validate);

// routers.post('/signout', UserM.logout);

// routers.post('/editProfile', UserM.editProfile);

// routers.post('/addFriend', UserM.addFriend);

// routers.post('/replyFriendRequest/:decision', Authorization.verifyFriendRequestReceiver, UserM.replyFriendRequest);

// routers.post('/unfriend', Authorization.verifyFriendship, UserM.replyFriendRequest);

// routers.post('/getNotifications',  UserM.getNotifications);

// // ================================================================

// routers.post('/getProfile', Authentication.verifyToken, UserM.getProfile);

// routers.post('/getUserProfile',Authentication.verifyToken, UserM.getUserProfile);

// export = routers;

export class AccountR{
    static init():express.Router{
        let routers:express.Router = express.Router();

        routers.post('/signup', ValidateM.validateNewUser, Authentication.hashPassword, UserM.register);
        
        routers.post('/checkUserName', UserM.checkUsername);
        
        // authentication
        
        routers.post('/signin', Validation.validate, Authentication.createToken);
        
        
        routers.use(Authentication.verifyToken);
        
        routers.use(Validation.validate);
        
        routers.post('/signout', UserM.logout);
        
        routers.post('/editProfile', UserM.editProfile);
        
        routers.post('/addFriend', UserM.addFriend);
        
        routers.post('/replyFriendRequest/:decision', Authorization.verifyFriendRequestReceiver, UserM.replyFriendRequest);
        
        routers.post('/unfriend', Authorization.verifyFriendship, UserM.replyFriendRequest);
        
        routers.post('/getNotifications',  UserM.getNotifications);
        
        // ================================================================
        
        routers.post('/getProfile', Authentication.verifyToken, UserM.getProfile);
        
        routers.post('/getUserProfile',Authentication.verifyToken, UserM.getUserProfile);

        return routers;
    }
}
