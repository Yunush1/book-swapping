const mongoose = require('mongoose');
const Enums = require('../utils/constants')
const { Schema } = mongoose;

const requestedSchemea = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exchange: {
        type: Schema.Types.ObjectId,
        ref: 'BooksExchange',
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        default: null
    },
    status: {
        type: Number,
        enum: Object.values(Enums.EXCHANGE.EXCHANGE_STATUS),
        default: Enums.EXCHANGE.EXCHANGE_STATUS.PENDING
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

requestedSchemea.index({ exchange: true })
requestedSchemea.index({ user: true })

module.exports = mongoose.model('Request', requestedSchemea)