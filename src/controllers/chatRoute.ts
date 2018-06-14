import * as express from "express";
import {ChatM} from "../middlewares/chatM";
import { Authorization } from "../middlewares/authorizationM";

export class ChatR{
    static init():express.Router{
        let routers:express.Router = express.Router();

        routers.post('/getMessages', Authorization.verifyFriendship, ChatM.getMessages);
        
        routers.post('/getFriends', ChatM.getFriends);
        
        routers.post('/searchUsers', ChatM.searchUsers);       // search all users including non friends
        
        routers.post('/updateMessageSeen', Authorization.verifyMessageReceiver, ChatM.updateSeen);
        
        routers.post('/sendMessage', Authorization.verifyFriendship, ChatM.sendMessage);
        
        
        routers.post('/editMessage', Authorization.verifyMessageSender, ChatM.editMessage);
        
        routers.post('/forwardMessage', Authorization.verifyMessageRecSend, ChatM.forwardMessage);
        
        routers.post('/deleteMessage', Authorization.verifyMessageSender, ChatM.deleteMessage);
        
        // to be added
        
        routers.post('/getFriendLastSeenTime', Authorization.verifyFriendship, ChatM.getFriendLastSeenTime);

        return routers;
    }
}



// const routers:express.Router = express.Router();


// routers.post('/getMessages', Authorization.verifyFriendship, ChatM.getMessages);

// routers.post('/getFriends', ChatM.getFriends);

// routers.post('/searchUsers', ChatM.searchUsers);       // search all users including non friends

// routers.post('/updateMessageSeen', Authorization.verifyMessageReceiver, ChatM.updateSeen);

// routers.post('/sendMessage', Authorization.verifyFriendship, ChatM.sendMessage);


// routers.post('/editMessage', Authorization.verifyMessageSender, ChatM.editMessage);

// routers.post('/forwardMessage', Authorization.verifyMessageRecSend, ChatM.forwardMessage);

// routers.post('/deleteMessage', Authorization.verifyMessageSender, ChatM.deleteMessage);

// // to be added

// routers.post('/getFriendLastSeenTime', Authorization.verifyFriendship, ChatM.getFriendLastSeenTime);

// export = routers;

