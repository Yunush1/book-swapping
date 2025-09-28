const createAdminUser = require('./AdminSeeder')
const logger = require('../utils/logger')
const runSeeder = async () => {
    try {
        await createAdminUser()
    } catch (error) {
        logger.error('Seeder: Failed to seed admin user:', error);
    }
}

module.exports = runSeeder;