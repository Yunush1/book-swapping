const Enums = require("../utils/constants");
const logger = require("../utils/logger");

const getHomeInfo = async () => {
  try {
    logger.info("HomeService: Preparing root API metadata");
    return {
      success: true,
      message: "AstroUp Backend API is running",
      version: "1.0.0",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      constants: Enums,
    };
  } catch (error) {
    logger.error("HomeService: Failed to generate root metadata", error);
    return {
      success: false,
      message: "Health check failed",
      error: error.message,
    };
  }
};

module.exports = {
  getHomeInfo,
};