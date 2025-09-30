const Request = require('../../models/requested');
const logger = require('../../utils/logger');
const { BadRequestError } = require('../../errors');

const createRequest = async ({ user, exchange, message, owner }) => {
    try {
        const request = await Request.create({ user, exchange, message, owner });
        await request.save();
        return {
            status: 201,
            message: 'Request sent successfully',
            data: { request }
        }
    } catch (error) {
        logger.error(`[createRequest] Error creating request: ${error.message}`);
        return {
            status: 400,
            message: 'Error creating request',
            data: { message: error.message }
        }
    }
}

const getRequests = async ({ user }) => {
    try {
        const requests = await Request.find({
            $or: [
                { user: user },
                { owner: user }
            ]
        }).populate('user owner exchange');
        logger.info('[getRequests] Requests fetched successfully');
        return {
            status: 200,
            message: 'Requests fetched successfully',
            data: requests.reverse()
        }
    } catch (error) {
        logger.error(`[getRequests] Error fetching requests: ${error.message}`);
        return {
            status: 400,
            message: 'Error fetching requests',
            data: { message: error.message }
        }
    }
}

const deleteRequest = async (id, user) => {
    try {
        const res = Request.deleteOne({ _id: id, user });
        logger.info('[deleteRequest] Request deleted successfully');
        return {
            status: 204,
            message: 'Request deleted successfully',
        }
    } catch (error) {
        logger.error(`[deleteRequest] Error deleting request: ${error.message}`);
        return {
            status: 400,
            message: 'Error deleting request',
            data: { message: error.message }
        }
    }
}

const updateRequestStatus = async (id, status) => {
    try {
        const result = await Request.findByIdAndUpdate(id, { status })
        logger.info('[UPDATE STATUS]: Status updated successfully...')
        return {
            status: 200,
            success: true,
            message: 'Status updated successfully',
        }
    } catch (error) {
        logger.info(`[Requestupdate status] Somthing went wrong`, error)
        return {
            status: 400,
            success: false,
            message: 'Somthing went wrong ',
        }
    }
}

module.exports = {
    createRequest,
    getRequests,
    deleteRequest,
    updateRequestStatus,
}