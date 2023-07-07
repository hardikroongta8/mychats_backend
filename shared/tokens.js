const {sign} = require('jsonwebtoken');

const createAccessToken = firebaseId => {
    return sign(
        {firebaseId: firebaseId}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '5m'}
    );
};

const createRefreshToken = firebaseId => {
    return sign(
        {firebaseId: firebaseId}, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    );
};

const sendTokens = (req, res, {accessToken, refreshToken}) => {
    res.send({
        accessToken,
        refreshToken,
        firebaseId: req.firebaseId
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendTokens,
};