const router = require('express').Router();
const {verify} = require('jsonwebtoken');   
const {
    createAccessToken, 
    createRefreshToken,
    sendTokens,
} = require('../shared/tokens.js');

var getRoomId = require('../shared/globals').getRoomId;
var separateUsers = require('../shared/globals').separateUsers;

const User = require('../models/User');
const { authenticateToken } = require('../middlewares/authenticate.js');


router.put('/signin', async(req, res) => {
    try{
        const user = req.body;

        const olduser = await User.findOne({firebaseId: user.firebaseId});

        const accessToken = createAccessToken(user.firebaseId);
        const refreshToken = createRefreshToken(user.firebaseId);

        if(olduser){
            await User.updateOne(
                {firebaseId: user.firebaseId}, {
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    contactInfo: user.contactInfo,
                    about: user.about,
                    profilePicUrl: user.profilePicUrl,
                }
            );
            console.log('updated user');
        }else{
            const newUser = new User({
                firebaseId: user.firebaseId,
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
                contactInfo: user.contactInfo,
                about: user.about,
                profilePicUrl: user.profilePicUrl,
                groups: [],
                activeRooms: [],
            })

            await newUser.save();
            console.log('created user');
        }

        sendTokens(req, res, {accessToken, refreshToken});
    }catch(error){
        console.log(error.message);
        res.status(500).json(error);
    }
});

router.post('/refresh_token', async(req, res) => {
    try{
        console.log('REFRESH TOKEN ROUTE CALLED BEFORE');

        const token = req.cookies.refreshToken;

        if(!token)return res.status(440).json({message: 'No request token'});

        var firebaseId = null;

        verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if(err){
                console.log('ERROR IN VERIFICATION');
                console.log(err.message);
                return res.status(440).json({message: 'Refresh token expired. Login again!'})
            }
            console.log(user.firebaseId);
            firebaseId = user.firebaseId;
            console.log('REFRESH TOKEN ROUTE CALLED');
    
            const accessToken = createAccessToken(firebaseId);

            res.status(200).json({accessToken: accessToken});
        });
    }catch(e){
        res.status(440).json(e.message);
    }
});

router.get('/get_user_info/:phoneNumber', authenticateToken, async(req, res) => {
    const phoneNumber = req.params.phoneNumber;

    try {
        const user = await User.findOne({phoneNumber: phoneNumber});

        if(user){
            res.status(200).json({
                phoneNumber: user.phoneNumber,
                about: user.about,
                profilePicUrl: user.profilePicUrl,
            });
        }else{
            res.status(200).json({
                phoneNumber: phoneNumber,
                about: null,
                profilePicUrl: null
            });
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/get_user_dp/:phoneNumber', authenticateToken, async(req, res) => {
    const phoneNumber = req.params.phoneNumber;

    try {
        const user = await User.findOne({phoneNumber: phoneNumber});

        if(user){
            res.status(200).json({
                profilePicUrl: user.profilePicUrl,
            });
        }else{
            res.status(200).json({
                profilePicUrl: null
            });
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/get_user_about/:phoneNumber', authenticateToken, async(req, res) => {
    const phoneNumber = req.params.phoneNumber;

    try {
        const user = await User.findOne({phoneNumber: phoneNumber});

        if(user){
            res.status(200).json({
                about: user.about,
            });
        }else{
            res.status(200).json({
                about: null,
            });
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

router.get('/get_contact_info/:firebaseId', authenticateToken, async(req, res) => {
    try {
        const user = await User.findOne({firebaseId: req.params.firebaseId});

        if(user){
            const contactInfo = user.contactInfo;
            console.log('sent contact info');
            res.status(200).json({contactInfo: contactInfo});
        }
        else{
            throw new Error('User not found');
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json(error.message);
    }
});

router.put('/update_contact_info', authenticateToken, async(req, res) => {
    try{
        await User.updateOne(
            {firebaseId: req.body.firebaseId},
            {contactInfo: req.body.contactInfo}
        );

        console.log('Updated contact info');

        res.status(200).json('Updated contact info on database');
    }catch(error){
        console.log(error.message);
        res.status(500).json(error.message);
    }
});

router.get('/active_rooms/:firebaseId', authenticateToken, async(req, res) => {
    try {
        const user = await User.findOne({firebaseId: req.params.firebaseId});
        
        if(user){
            const activeRooms = user.activeRooms;
            const contactInfo = user.contactInfo;

            var roomList = [];
            var found = false;

            activeRooms.forEach(room => {
                found = false;
                contactInfo.forEach(element => {
                    if(room.roomId == getRoomId(element.phoneNumber, user.phoneNumber)){
                        roomList.push({
                            phoneNumber: element.phoneNumber,
                            displayName: element.displayName,
                            roomId: room.roomId,
                            lastActive: room.lastActive,
                            lastMessage: room.lastMessage,
                            count: room.count
                        });
                        found = true;
                    }
                });
                if(found == false){
                    var users = separateUsers(room.roomId);
                    var otherUserNumber;
                    if(users[0] == user.phoneNumber)otherUserNumber = users[1];
                    else otherUserNumber = user[0];
                    roomList.push({
                        phoneNumber: otherUserNumber,
                        displayName: otherUserNumber,
                        roomId: room.roomId,
                        lastActive: room.lastActive,
                        lastMessage: room.lastMessage,
                        count: room.count                        
                    });
                }
            });

            console.log('Sent active rooms');
            res.status(200).json({activeRooms: roomList});
        }
        else{
            console.log('User not found!!!');
            res.status(200).json({activeRooms: []});
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

module.exports = router;