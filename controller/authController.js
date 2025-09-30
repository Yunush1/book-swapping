const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');
const logger = require('../utils/logger')
exports.register = async (req, res) => {
  try {
    logger.info("AuthController: signUpAstrologer request");
    const { email, password, name, role, mobileNumber } = req.body;
    logger.warn("request data ", email, password, name, mobileNumber)
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }
    const result = await authService.register({ email, password, name, role, mobileNumber });
    logger.info("AuthController: signUp user success");
    return res.status(result.statusCode).json({ success: true, ...result });

  } catch (error) {
    logger.error("AuthController: signUp user failed", error);
    return res.status(error?.statusCode).json({
      success: false,
      message: error.message || "User signup failed",
    });
  }
};

exports.loginByPassword = asyncHandler(async (req, res) => {
  try {
    const { email, mobileNumber, password, deviceId, longitude, latitude, os, modelNumber, fcmToken } = req.body;
    const identifier = email || mobileNumber;
    const requestOrigin = req.headers.origin;
    logger.info(`AuthController: loginByPassword request: ${JSON.stringify({ identifier, requestOrigin })}`);
    const response = await authService.loginByPassword({
      identifier,
      password,
      deviceId,
      longitude,
      latitude,
      requestOrigin,
      os,
      modelNumber,
      fcmToken
    });
    logger.info("AuthController: loginByPassword successful", { user: response.user?.id });
    return res.json({ success: true, ...response });
  } catch (error) {
    console.log(error);
    logger.error("AuthController: loginByPassword failed", { error: error?.message });
    const responseBody = {
      success: false,
      message: error.message || "Login failed",
    };
    if (error.deviceList) {
      responseBody.deviceList = error.deviceList;
    }
    return res.status(400).json(responseBody);
  }
});