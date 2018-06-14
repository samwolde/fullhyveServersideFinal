import {ChatS} from '../models/services/chatServices';

export class TestChat{
    static init(){
        // let userId = 1;
        // ChatS.getChatFriends(userId).then((friends)=>{
        //     console.log(friends);
        // }).catch((err)=>{
        //     console.log(500);
        // });
        //ChatS.getFriendsFromDb([],undefined,userId);

        ChatS.getUnseenReceivedMessages(1)

        .then((messages:any)=>{
            console.log(messages);
        })
    }
}