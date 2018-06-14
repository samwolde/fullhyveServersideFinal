export const commonCriterias = {
    id:{
        int:true,
        positive:true,
    },
    message:{
        string:true,
        required:true,
        maxLen:5000
    },
    name:{
        required:true,
        string:true,
        maxLen:30
    }
}
export const validationCriterias = {
    // get methods
    offset:{
        int:true,
        minVal:0
    },
    limit:{
        int:true,
        positive:true
    },

    // account
    userName:{
        required:true,
        string:true,
        //minLen:6,
        //maxLen:30
    },
    password:{
        required:true,
        string:true,
        //minLen:2
    },

    firstName:{
        required:true,
        string:true,
        maxLen:20
    },
    lastName:{
        string:true,
        maxLen:20
    },
    email:{
        string:true,
        maxLen:255,
        email:true
    },
    image:{
        string:true,
        maxLen:255
    },
    title:{
        string:true,
        maxLen:50
    },
    skills:{
        string:true,
        maxLen:30
    },
    description:{
        string:true
    },

    lastNotificationTimestamp:{
        string:true
    },

    accepted:{
        boolean:true
    },

    // ids
    friendId:commonCriterias.id,

    friendIds:commonCriterias.id,

    requestId:commonCriterias.id,

    contactId:commonCriterias.id,

    contactIds:commonCriterias.id,

    messageId:commonCriterias.id,

    lastMessageId:commonCriterias.id,

    teamId:commonCriterias.id,

    announcementId:commonCriterias.id,

    replyId:commonCriterias.id,
    
    lastAnnId:commonCriterias.id,

    memberId:commonCriterias.id,

    memberIds:commonCriterias.id,

    projectId:commonCriterias.id,
    
    tasksetId:commonCriterias.id,

    taskId:commonCriterias.id,

    teamIds:commonCriterias.id,

    individualIds:commonCriterias.id,

    assignerId:commonCriterias.id,

    assigneeId:commonCriterias.id,

    assigneeTeamId:{
        int:true,
        positive:true,
    },

    // messages
    message:commonCriterias.message,
    
    newMessage:commonCriterias.message,

    announcement:commonCriterias.message,

    reply:commonCriterias.message,

    newAnnouncement:commonCriterias.message,

    // search names
    userSearchName:{
        required:true,
        string:true,
        maxLen:41
    },

    teamName:commonCriterias.name,

    projectName:commonCriterias.name,

    // teams
    // new team
    name:commonCriterias.name,
    
    focus:{
        required:true,
        string:true
    },

    odescription:{
        required:true,
        string:true
    },

    // new project
    field:{
        required:true,
        string:true,
        maxLen:255
    },

    number:{
        int:true,
        positive:true
    },

    // new task
    ttitle:{      // task title
        string:true,
        maxLen:30
    },
    deadline:{
        required:true
    },
    taskStatus:{
        listval:['approve','revise']
    }
}

export const actionRequiredFields:any = {
    userConnected:{
        fields:['id'],
        alias:null
    },
    signin:{
        fields:['userName','password'],
        alias:null
    },
    signup:{
        fields:['firstName','lastName','email','userName','password'],
        alias:null
    },
    editProfile:{
        fields:['firstName','lastName','email','image','title','skills','description'],
        alias:null
    },
    addFriend:{
        fields:['friendId'],
        alias:null
    },
    replyFriendRequest:{
        fields:['requestId', 'accepted'],
        alias:null
    },
    unfriend:{
        fields:['friendId'],
        alias:null
    },
    getNotifications:{
        fields:['offset','limit'/*,'lastNotificationTimestamp'*/],
        alias:null
    },
    sendMessage:{
        fields:['friendId','message'],
        alias:null
    },
    editMessage:{
        fields:['messageId','newMessage'],
        alias:null
    },
    forwardMessage:{
        fields:['friendIds','messageId'],
        alias:null
    },
    deleteMessage:{
        fields:['messageId'],
        alias:null
    },
    updateMessageSeen:{
        fields:['lastMessageId'],
        alias:null
    },
    getFriendLastSeenTime:{
        fields:['friendId'],
        alias:null
    },
    getMessages:{
        fields:['friendId','offset','limit'],
        alias:null
    },
    getFriends:{
        fields:['offset','limit'],
        alias:null
    },
    searchUsers:{
        fields:['name','offset','limit'],
        alias:{
            'name':'userSearchName'
        }
    },

    //teams
    getMyTeams:{
        fields:['offset','limit'],
        alias:null
    },
    searchTeams:{
        fields:['name','offset','limit'],
        alias:{
            'name':'teamName'
        }
    },
    getTeamMembers:{
        fields:['teamId','offset','limit'],
        alias:null
    },
    getTeamProjects:{
        fields:['teamId','offset','limit'],
        alias:null
    },
    getTeamAnnouncements:{
        fields:['teamId','offset','limit'],
        alias:null
    },
    announce:{
        fields:['announcement','teamId'],
        alias:null
    },
    removeAnnouncement:{
        fields:['announcementId'],
        alias:null
    },
    replyAnnouncement:{
        fields:['reply','teamId'],
        alias:null
    },
    editAnnouncementReply:{
        fields:['announcementId','newAnnouncement'],
        alias:null
    },
    removeReply:{
        fields:['replyId'],
        alias:null
    },
    updateAnnouncementSeen:{
        fields:['teamId','lastAnnId'],
        alias:null
    },
    newTeam:{
        fields:['name','image','focus','description'],
        alias:{
            'description':'odescription'
        }
    },
    editTeamProfile:{
        fields:['name','image','description'],
        alias:null
    },
    addMember:{
        fields:['teamId','memberIds'],
        alias:null
    },
    removeMember:{
        fields:['teamId','memberIds'],
        alias:null
    },
    replyTeamJoinRequest:{
        fields:['requestId', 'accepted'],
        alias:null
    },
    deleteTeam:{
        fields:['teamId'],
        alias:null
    },

    // project
    getMyProjects:{
        fields:['offset','limit'],
        alias:null
    },
    searchProjects:{
        fields:['name','offset','limit'],
        alias:{
            'name':'projectName'
        }
    },
    getContributors:{
        fields:['projectId','offset','limit'],
        alias:null
    },
    getTasksets:{
        fields:['projectId','offset','limit'],
        alias:null
    },
    getTasks:{
        fields:['projectId','tasksetId','offset','limit'],
        alias:null
    },
    newProject:{
        fields:['name','image','field','description'],
        alias:{
            'description':'odescription'
        }
    },
    addContributors:{
        fields:['teamIds','individualIds'],
        alias:null
    },
    replyIndividualContributorJoinRequest:{
        fields:['requestId', 'accepted'],
        alias:null
    },
    replyTeamContributorJoinRequest:{
        fields:['requestId', 'accepted'],
        alias:null
    },
    editProjectDetails:{
        fields:['name','image','field','description'],
        alias:null
    },
    deleteProject:{
        fields:['projectId'],
        alias:null
    },
    newTaskset:{    // number
        fields:['name', 'deadline','description', 'projectId'],
        alias:{
            'description':'odescription'
        }
    },
    removeTaskset:{
        fields:['projectId','tasksetId'],
        alias:null
    },
    newTask:{   // status, number
        fields:['title','description','deadline','assignerId','assigneeId','assigneeTeamId','tasksetId'],
        alias:{
            'title':'ttitle',
            'description':'odescription'
        }
    },
    startTask:{
        fields:['projectId','taskId'],
        alias:null
    },
    completeTask:{
        fields:['projectId','taskId'],
        alias:null
    },
    changeTaskStatus:{
        fields:['projectId','taskId', 'taskStatus'],
        alias:null
    },
    removeTask:{
        fields:['projectId','taskId'],
        alias:null
    },

}