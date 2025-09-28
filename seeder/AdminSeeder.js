const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Enums = require('../utils/constants');
const logger = require('../utils/logger');

const createAdminUser = async () => {
  try {
    logger.info('Starting admin user seeder...');
    let existingAdmin = await User.findOne({ role: Enums.USER.ROLE.ADMIN });
    logger.info(existingAdmin ? `Found existing admin: ${existingAdmin._id}` : 'No admin found, will create new.');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin@123', salt);
    logger.info('Password hashed successfully.');
    if (existingAdmin) {
      existingAdmin.name = 'Admin';
      existingAdmin.email = 'admin@gmail.com';
      existingAdmin.mobileNumber = '9999999999';
      existingAdmin.loginMethod = Enums.USER.LOGIN_METHOD.PASSWORD;
      existingAdmin.password = hashedPassword;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      logger.info(`Admin user updated successfully: ${existingAdmin._id}`);
    } else {
      existingAdmin = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        mobileNumber: '9999999999',
        loginMethod: Enums.USER.LOGIN_METHOD.PASSWORD,
        password: hashedPassword,
        role: Enums.USER.ROLE.ADMIN,
        isActive: true,
        verificationStatus: Enums.USER.VERIFICATION_STATUS.APPROVED,
      });
      await existingAdmin.save();
      logger.info(`Admin user created successfully: ${existingAdmin._id}`);
    }
   
    logger.info('Admin seeder finished.');
  } catch (error) {
    logger.error('Error running admin seeder:', error);
  }
};
module.exports = createAdminUser;