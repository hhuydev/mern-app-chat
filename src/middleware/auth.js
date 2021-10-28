const jwt = require('jsonwebtoken');
const HttpError = require('../utils/http-error');
const User = require('../models/User');

const auth = async (req, res, next) => {
    if (req.method === 'OPTIONS') return next();
    try {
        let token = req.headers.authorization.split(' ')[1];
        // const token = req.header("Authorization").replace("Bearer ", "");
        if (!token) return next(new HttpError('Invalid token!', 400));
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decodedToken.userId);
        if (!user) return next(new HttpError('User not found!', 404));
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return next(new HttpError('Please Authenticate!', 401));
    }
};
module.exports = auth;
