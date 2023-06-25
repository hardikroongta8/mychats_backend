const router = require('express').Router();
var getRoomId = require('../shared/globals').getRoomId;

const User = require('../models/User');

require('dotenv').config();

router.put('/create', async(req, res) => {
    try{
        const user = req.body;

        const olduser = await User.findOne({firebaseId: user.firebaseId});


        if(olduser){
            await User.updateOne(
                {firebaseId: user.firebaseId}, {
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    contactInfo: user.contactInfo,
                    about: user.about,
                    profilePicUrl: user.profilePicUrl
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
    
        res.status(200).json(user);
    }catch(error){
        console.log(error.message);
        res.status(500).json(error);
    }
});

router.get('/get_contact_info/:firebaseId', async(req, res) => {
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

router.put('/update_contact_info', async(req, res) => {
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

router.get('/active_rooms/:firebaseId', async(req, res) => {
    try {
        const user = await User.findOne({firebaseId: req.params.firebaseId});
        
        if(user){
            const activeRooms = user.activeRooms;
            const contactInfo = user.contactInfo;

            var roomList = [];

            activeRooms.forEach(room => {
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
                    }
                });
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
        res.status(500).json(error.message);
    }
});



module.exports = router;