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
        {expiresIn: '30d'}
    );
};

const sendTokens = (req, res, {accessToken, refreshToken}) => {
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token'
    });
    res.send({
        accessToken,
        firebaseId: req.firebaseId
    });
};

module.exports = {
    createAccessToken,
    createRefreshToken,
    sendTokens,
};