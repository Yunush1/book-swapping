const logger = require('../../utils/logger');
const { BadRequestError } = require('../../errors');

const exchangeService = require('../../services/exchange/exchangeService');

const createExchange = async (req, res) => {
    try {
        const { title, author, genre, description, image, board, category, specification, purchageDate } = req.body;
        const userId = req.user._id;
        const exchange = await exchangeService.createExchange({ title, author, genre, description, image, board, category, userId, specification, purchageDate });
        return res.status(201).json(exchange);
    } catch (error) {
        logger.error(`[createExchange] Error creating exchange: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};

const getExchanges = async (req, res) => {
    try {
        const { limit, page, cursor } = req.query;
        const exchanges = await exchangeService.getExchanges(limit, page, cursor);
        logger.info(`[getExchanges] Exchanges fetched successfully`);
        return res.status(200).json(exchanges);
    } catch (error) {
        logger.error(`[getExchanges] Error fetching exchanges: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};

const getExchange = async (req, res) => {
    try {
        const { id } = req.params;
        const exchange = await exchangeService.getExchange({ id });
        logger.info(`[getExchange] Exchange fetched successfully: ${JSON.stringify(exchange, null, 2)}`);
        return res.status(200).json(exchange);
    } catch (error) {
        logger.error(`[getExchange] Error fetching exchange: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};

const updateExchange = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, description, image, board, category, specification } = req.body;
        const exchange = await exchangeService.updateExchange({ id, title, author, genre, description, image, board, category, specification });
        logger.info(`[updateExchange] Exchange updated successfully: ${JSON.stringify(exchange, null, 2)}`);
        return res.status(200).json(exchange);
    } catch (error) {
        logger.error(`[updateExchange] Error updating exchange: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};

const deleteExchange = async (req, res) => {
    try {
        const { id } = req.params;
        const exchange = await exchangeService.deleteExchange({ id });
        logger.info(`[deleteExchange] Exchange deleted successfully: ${JSON.stringify(exchange, null, 2)}`);
        return res.status(200).json(exchange);
    } catch (error) {
        logger.error(`[deleteExchange] Error deleting exchange: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};

const getMyExchanges = async (req, res) => {
    try {
        const userId = req?.user?._id;
        const exchanges = await exchangeService.getMyExchanges(userId);
        logger.info(`[getMyExchanges controller] Exchanges fetched successfully:`);
        return res.status(exchanges.status).json(exchanges);
    } catch (error) {
        logger.error(`[getMyExchanges controller] Error fetching exchanges: ${error.message}`);
        return res.status(400).json({ error: error.message });
    }
};


module.exports = { createExchange, getExchanges, getExchange, updateExchange, deleteExchange, getMyExchanges };