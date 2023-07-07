const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if(!authorization) {
        return res.status(401).json({message: 'Unauthorized user'});
    }

    const token = authorization.split(' ')[1];
    if(token == null) {
        return res.status(401).json({message: 'Unauthorized user'});
    }


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,  (err, user) => {
        if(err) {
            console.log(err.message);
            return res.status(403).json({message: err.message});
        }
        req.firebaseId = user.firebaseId;
        next();
    });
};

const verifyRefreshToken = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if(!authorization) {
        return res.status(401).json({message: 'Unauthorized user'});
    }

    const token = authorization.split(' ')[1];
    if(token == null) {
        return res.status(401).json({message: 'Unauthorized user'});
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,  (err, user) => {
        if(err) return res.status(403).json({message: err.message});
        req.firebaseId = user.firebaseId;
        next();
    });
};

module.exports = {authenticateToken, verifyRefreshToken};