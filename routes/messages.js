const router = require('express').Router();

const { authenticateToken } = require('../middlewares/authenticate');
const PersonalRoom = require('../models/PersonalRoom');
const User = require('../models/User');

var separateUsers = require('../shared/globals').separateUsers;

require('dotenv').config();

router.put('/save_messages', authenticateToken, async(req, res) => {
    try {
        const msgList = req.body.messageList;
        const roomId = req.body.roomId;

        const room = await PersonalRoom.findOne({roomId: roomId});

        if(room){
            const oldMessages = room.messageList;
            const allMessages = oldMessages.concat(msgList);
            const latestMessage = allMessages[allMessages.length - 1];
            const oldCount = room.unreadMessages.count;
            const newCount = oldCount + req.body.unreadMessages.count;

            const newUnreadMessages = {count: newCount, phoneNumber: req.body.unreadMessages.phoneNumber};

            await PersonalRoom.updateOne(
                {roomId: roomId},
                {
                    messageList: allMessages,
                    lastActive: latestMessage.sendingTime,
                    unreadMessages: newUnreadMessages
                }
            );
            const msg = await updateActiveRooms(roomId, latestMessage, newUnreadMessages);

            console.log(msg);

            console.log('Messages added to cloud');
            res.status(200).json('Messages added to cloud');
        }
        else{
            const latestMessage = msgList[msgList.length - 1];
            
            const newRoom = new PersonalRoom({
                roomId: roomId,
                messageList: msgList,
                lastActive: latestMessage.sendingTime,
                unreadMessages: req.body.unreadMessages
            });

            await newRoom.save();

            const msg = await updateActiveRooms(roomId, latestMessage, req.body.unreadMessages);

            console.log(msg);
            
            console.log('Room added to cloud');
            res.status(200).json('Room added to cloud');
        }

        
    }catch(error){
        console.log(error.message);
        res.status(500).json(error.message);
    }
});

router.get('/of/:roomId/:myPhoneNumber', authenticateToken, async(req, res) => {
    try {
        const myPhoneNumber = req.params.myPhoneNumber;
        const roomData = await PersonalRoom.findOne({roomId: req.params.roomId});
        if(roomData){
            var msgs = [];
            if(roomData.unreadMessages.phoneNumber == myPhoneNumber){
                await PersonalRoom.updateOne(
                    {roomId: req.params.roomId}, 
                    {unreadMessages: {count: 0}}
                );
            }
            roomData.messageList.forEach(element => {
                msgs.push({
                    body: element.body,
                    sentBy: element.sentBy,
                    sendingTime: element.sendingTime,
                    isFile: element.isFile
                });
            });

            const user = await User.findOne({phoneNumber: myPhoneNumber});
            var newActiveRooms = user.activeRooms;
            for(i = 0; i < newActiveRooms.length; i++){
                if(newActiveRooms[i].roomId == roomData.roomId){
                    newActiveRooms[i].count = 0;
                }
            }

            await User.updateOne({phoneNumber: myPhoneNumber}, {activeRooms: newActiveRooms});
            console.log('active room updated');

            res.status(200).json({roomId: roomData.roomId, messageList: msgs});
        }
        else{
            const newRoom = new PersonalRoom({
                roomId: req.params.roomId,
                messageList: [],
                unreadMessages: {count: 0, phoneNumber: req.params.myPhoneNumber},
                lastActive: Date.now().toString()
            });

            console.log(newRoom);

            await newRoom.save();
            console.log('New room  added to cloud');

            res.status(200).json({
                roomId: newRoom.roomId, 
                messageList: newRoom.messageList, 
                lastActive: newRoom.lastActive,
                unreadMessages: newRoom.unreadMessages
            });
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json(error.message);
    }
});

async function updateActiveRooms(roomId, latestMessage, unreadMessages){
    
    const userPhoneNumbers = separateUsers(roomId);
    if(unreadMessages.phoneNumber == userPhoneNumbers[0]){
        await updateForSingleUser(userPhoneNumbers[0], roomId, latestMessage, unreadMessages.count);
        await updateForSingleUser(userPhoneNumbers[1], roomId, latestMessage, 0);
    }
    else{
        await updateForSingleUser(userPhoneNumbers[0], roomId, latestMessage, 0);
        await updateForSingleUser(userPhoneNumbers[1], roomId, latestMessage, unreadMessages.count);
    }

    return 'Function completed';
}

async function updateForSingleUser(userPhoneNumber, roomId, latestMessage, count){
    const user = await User.findOne({ phoneNumber: userPhoneNumber });
    if (user) {
        var newActiveRooms = user.activeRooms;

        var found = false;

        for (i = 0; i < newActiveRooms.length; i++) {
            if (newActiveRooms[i].roomId == roomId) {
                newActiveRooms[i].lastActive = latestMessage.sendingTime;
                newActiveRooms[i].lastMessage = latestMessage;
                newActiveRooms[i].count = count;
                found = true;
            }
        }
        if (!found) {
            newActiveRooms.push({
                roomId: roomId,
                lastActive: latestMessage.sendingTime,
                lastMessage: latestMessage,
                count: count
            });
        }

        await User.updateOne({ phoneNumber: userPhoneNumber }, { activeRooms: newActiveRooms });
        console.log('active rooms updated');
    }
}

module.exports = router;