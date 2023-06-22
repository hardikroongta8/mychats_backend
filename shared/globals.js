var global = {
    getRoomId: function(theirPhoneNumber, myPhoneNumber){
        if(theirPhoneNumber > myPhoneNumber){
            return myPhoneNumber+theirPhoneNumber;
        }
        else{
            return theirPhoneNumber+myPhoneNumber;
        }
    },
    separateUsers: function(roomId) {
        var users = [];
        users.push(roomId.substring(0, 13));
        users.push(roomId.substring(13));
    
        return users;
    }
}

module.exports = global;