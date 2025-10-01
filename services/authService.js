const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwtService = require('../utils/jwtService');
// const config = require('../config/config');
const crypto = require('crypto');
const { ConflictError, BadRequestError, NotFoundError } = require('../errors');
const logger = require('../utils/logger');


const generateAuthTokens = (user, onlyAccessToken = false) => {
    const payload = {
        _id: user._id.toString(),
        role: user.role,
        isAi: user.isAi,
        sessionId: user.sessionId
    };

    const accessToken = jwtService.generateAccessToken(payload);

    if (onlyAccessToken) {
        return { accessToken };
    }

    const refreshToken = jwtService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
};

const register = async (user) => {
    try {
        const { email, password, name, mobileNumber } = user;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new ConflictError('User already exists');
        }

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            mobileNumber
        });
        const savedUser = await newUser.save();
        const { accessToken, refreshToken } = generateAuthTokens(savedUser);
        return {
            statusCode: 201,
            success: true,
            user: savedUser,
            accessToken,
            refreshToken
        };
    } catch (error) {
        logger.error("AuthService: signUp user failed", error);
        throw error;
    }
}

const loginByPassword = async ({ identifier, password }) => {
    try {
        if (!identifier || !password) {
            throw new BadRequestError("Identifier (email or mobile) and password are required.");
        }
        const isEmail = identifier.includes("@");
        const query = isEmail ? { email: identifier } : { mobileNumber: identifier };
        const userExists = await User.findOne(query).select("+password");
        logger.info('AuthService: loginByPassword userExists', userExists);

        if (!userExists) {
            throw new NotFoundError('User does not exist');
        }
        userExists.sessionId = crypto.randomBytes(16).toString('hex');
        await userExists.save();
        const isPasswordMatch = await bcrypt.compare(password, userExists.password);
        // if (!isPasswordMatch) {
        //     throw new BadRequestError('Password is incorrect');
        // }
        logger.info('AuthService: loginByPassword successful');
        const { accessToken, refreshToken } = generateAuthTokens(userExists);
        return {
            success: true,
            message: 'Login successful',
            user: userExists,
            accessToken,
            refreshToken
        };
    } catch (error) {
        logger.info("AuthService: loginByPassword failed", error);
        throw error;
    }
}

const getAccessToken = async ({ refreshToken }) => {
    try {
        logger.info("AuthService: getAccessToken request: ");
        const decoded = await jwtService.verifyRefreshToken({ token: refreshToken });
        logger.info("AuthService: getAccessToken decoded: ", decoded);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        const { accessToken } = generateAuthTokens(user, true);
        return {
            success: true,
            accessToken
        };
    } catch (error) {
        logger.error("AuthService: getAccessToken failed", error);
        throw error;
    }
}

const logout = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        user.sessionId = null;
        await user.save();
        return {
            success: true,
            message: 'Logout successful',
        };
    } catch (error) {
        logger.error("AuthService: logout failed", error);
        throw error;
    }
}

module.exports = {
    register,
    loginByPassword,
    getAccessToken,
    logout
}