const User = require('../../models/user');
const BooksExchange = require('../../models/exchange');
const Enums = require('../../utils/constants');
const Category = require('../../models/Category');
const logger = require('../../utils/logger');
const { buildPaginationResponse } = require('../../utils/pagination');
const { default: mongoose } = require('mongoose');

const createExchange = async ({ title, author, genre, description, image, board, category, userId, specification, condition, purchageDate }) => {
    try {
        logger.info(`[createExchange] Exchange created successfully: ${JSON.stringify({ title, author, genre, description, image, board, category, userId, specification }, null, 2)}`);
        const exchanges = await BooksExchange.create({
            title,
            author,
            genre,
            description,
            image,
            board,
            category,
            specification,
            createdBy: userId,
            condition,
            purchageDate
        });
        await exchanges.save();
        return {
            success: true,
            message: 'Exchange created successfully',
            exchanges
        };
    } catch (error) {
        logger.error(`[createExchange] Error creating exchange: ${error.message}`);
        return {
            success: false,
            message: 'Error creating exchange',
            error: error.message
        };
    }
}

const getExchanges = async (limit = 10, page = 1, cursor = null) => {
    try {
        const query = { isDeleted: false };

        // If cursor is provided, fetch records after that cursor (using _id)
        if (cursor) {
            query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
        }

        // Fetch with sorting by _id descending (newest first)
        const exchanges = await BooksExchange.find(query).populate('createdBy', '-password')
            .sort({ _id: -1 })
            .limit(limit + 1); // fetch 1 extra to check if there's a next page

        // Check if more results are available
        const hasNextPage = exchanges.length > limit;

        // Slice to return only requested limit
        const results = hasNextPage ? exchanges.slice(0, limit) : exchanges;

        logger.info(`[getExchanges sevices] Exchanges fetched successfully:`);
        return {
            success: true,
            message: 'Exchanges fetched successfully',
            exchanges: buildPaginationResponse({
                totalDocs: results,
                nextCursor: hasNextPage ? results[results.length - 1]?._id : null,
                page: page,
                hasNextPage,
                limit
            })
        };
    } catch (error) {
        logger.error(`[getExchanges] Error fetching exchanges: ${error.message}`);
        return {
            success: false,
            message: 'Error fetching exchanges',
            error: error.message
        };
    }
};


const getExchange = async ({ id }) => {
    try {
        const exchange = await BooksExchange.findById(id);
        logger.info(`[getExchange] Exchange fetched successfully: ${JSON.stringify(exchange, null, 2)}`);
        return {
            success: true,
            message: 'Exchange fetched successfully',
            exchange
        };
    } catch (error) {
        logger.error(`[getExchange] Error fetching exchange: ${error.message}`);
        return {
            success: false,
            message: 'Error fetching exchange',
            error: error.message
        };
    }
}
const updateExchange = async ({ id, title, author, genre, description, image, board, category, specification }) => {
    try {
        const exchange = await BooksExchange.findByIdAndUpdate(id, { title, author, genre, description, image, board, category, specification }, { new: true });
        logger.info(`[updateExchange] Exchange updated successfully: ${JSON.stringify(exchange, null, 2)}`);
        return {
            success: true,
            message: 'Exchange updated successfully',
            exchange
        };
    } catch (error) {
        logger.error(`[updateExchange] Error updating exchange: ${error.message}`);
        return {
            success: false,
            message: 'Error updating exchange',
            error: error.message
        };
    }
}
const deleteExchange = async ({ id }) => {
    try {
        const exchange = await BooksExchange.findByIdAndUpdate(id, { isDeleted: true }, { new: false });
        logger.info(`[deleteExchange] Exchange deleted successfully: ${JSON.stringify(exchange, null, 2)}`);
        return {
            success: true,
            status: 204,
            message: 'Exchange deleted successfully',
        };
    } catch (error) {
        logger.error(`[deleteExchange] Error deleting exchange: ${error.message}`);
        return {
            success: false,
            message: 'Error deleting exchange',
            error: error.message
        };
    }
}

const getMyExchanges = async (userId) => {
    try {
        // Query for exchanges created by this user
        const exchanges = await BooksExchange.find({ createdBy: new mongoose.Types.ObjectId(userId) });
        logger.info('[MY books exchanges]: Fetched successfully')
        return {
            status: 200,
            message: "Exchanges fetched successfully",
            exchanges,
        };
    } catch (error) {
        return {
            status: 400,
            message: "Error fetching exchanges",
            error: error.message,
        };
    }
};



module.exports = {
    createExchange,
    getExchanges,
    getExchange,
    updateExchange,
    deleteExchange,
    getMyExchanges
}

