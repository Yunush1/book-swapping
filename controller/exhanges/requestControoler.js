const logger = require('../../utils/logger');
const requistService = require('../../services/exchange/requestService');

const createRequest = async (req, res) => {
    try {
        const { exchange, message, owner } = req.body;
        const user = req.user._id;
        const result = await requistService.createRequest({ user, exchange, message, owner });
        logger.info('[request controller]: request created successfully');
        return res.status(result.status).json(result);
    } catch (error) {
        logger.error('request controller', error);
        return res.status(400).json(error.message)
    }
}

const getRequests = async (req, res) => {
    try {
        const user = req.user._id;
        const result = await requistService.getRequests({ user });
        logger.info('[request controller]: request fetched successfully', result);
        return res.status(result.status).json(result);
    } catch (error) {
        logger.error('request controller', error);
        return res.status(400).json(error.message)
    }
}

const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params
        const user = req.user._id
        const result = await requistService.deleteRequest(id, user);
        logger.info('[request controller]: request created successfully');
        return res.status(result.status).json(result);
    } catch (error) {
        logger.error('request controller', error);
        return res.status(400).json(error.message)
    }
}

const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;
        logger.info('Request status updated');
        const result = await requistService.updateRequestStatus(id, status)
        logger.info('Request status updated successfully...')
        return res.status(result.status).json(result);
    } catch (error) {
        logger.error(`[REQUEST CONTROLLER]: Error found while updating status:`, error);
        return {
            status: error.status,
            message: error.message
        }
    }
}

module.exports = {
    createRequest,
    getRequests,
    deleteRequest,
    updateRequestStatus
}