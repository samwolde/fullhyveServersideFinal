import { Authorization } from "../../middlewares/authorizationMR";

export const requiredAuthorization:any = {
    // chat
    getMessages:[Authorization.verifyFriendship],
    updateMessageSeen:[Authorization.verifyMessageReceiver],
    sendMessage:[Authorization.verifyFriendship],
    editMessage:[Authorization.verifyMessageSender],
    forwardMessage:[Authorization.verifyMessageRecSend],
    deleteMessage:[Authorization.verifyMessageSender],
    getFriendLastSeenTime:[Authorization.verifyFriendship]

    // team
}