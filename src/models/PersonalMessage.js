const mongoose = require('mongoose');

const msg =  new mongoose.Schema({
    body: {
        type: String,
        required: true,
    },
    sentBy: {
        type: String,
        required: true
    },
    isFile: {
        required: false,
        default: false,
        type: Boolean
    },
    sendingTime: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('PersonalMessage', msg);