const mongoose = require('mongoose');
const Enums = require('../utils/constants');
const flattenEnumValues = require('../utils/flattenEnums');
const {Schema} = mongoose;

const booksExchangeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
    },
    genre: {
        type: String,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    board:{
        university:{
            type: String,
        },
        branch:{
            type: String,
        },
        year:{
            type: String,
        }
    },
    status:{
        type: Number,
        enum: Object.values(Enums.EXCHANGE.EXCHANGE_STATUS),
        default: Enums.EXCHANGE.EXCHANGE_STATUS.ON_GOING
    },
    condition:{
        type:Number,
        enum: Object.values(Enums.EXCHANGE.CONDITION),
        default:Enums.EXCHANGE.CONDITION.NEW
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    purchageDate:{
        type: Date,
        default: null
    },
    specification:{
        type: Number,
        enum:flattenEnumValues(Enums.EXCHANGE.SPECIFICATION),
        default:Enums.EXCHANGE.SPECIFICATION.OTHERS.BIOGRAPHY
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }

},{
    timestamps: true,
    zoned: true
});

booksExchangeSchema.index({title: 1})
booksExchangeSchema.index({author: 1})
booksExchangeSchema.index({createdBy:1})
module.exports = mongoose.model('BooksExchange',booksExchangeSchema)