const express = require('express');
const mongoose = require('mongoose');
const PersonalInfo = require('../models/PersonalInfo');

require('dotenv').config();

const router = express.Router();

router.put('/signin', async(req, res) => {
    try {
        const user = new PersonalInfo(req.body);

        await mongoose.connect(process.env.MONGO_URL + user.firebaseId);

        console.log('Connected to database');

        const existingUser = await PersonalInfo.findOne();

        if(existingUser){
            await PersonalInfo.findOneAndUpdate(null, {
                fullName: user.fullName, 
                about: user.about, 
                profilePicUrl: user.profilePicUrl
            });

            console.log('Updated the document');
            console.log({
                fullName: user.fullName,
                about: user.about,
                profilePicUrl: user.profilePicUrl
            });
        }
        else if(!existingUser){
            await user.save();
            console.log(user);
        }

        res.status(200).send('Signed in successfully!!');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/signout', async(req, res) => {
    try {
        await mongoose.disconnect();

        console.log('Disconnected from database');

        res.status(200).send('Disconnected from database');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;