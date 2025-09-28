const Enums = require('../utils/constants');
const User = require('../models/user');
const { UnauthorizedError, NotFoundError } = require('../errors');
const logger = require('../utils/logger');

const validateUserStatus = async (userId) => {
  const user = await User.findById(userId).select('role isBlock isDeleted verificationStatus isOnboarded');
  logger.info(`[validateUserStatus] User object: ${JSON.stringify(user.toObject(), null, 2)}`);

  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.isBlock) {
    throw new UnauthorizedError('User is blocked');
  }
  if (user.isDeleted) {
    logger.info(`[validateUserStatus] User is deleted: userId=${userId}`);
    throw new NotFoundError('User not found');
  }
  return true;
};

module.exports = validateUserStatus;