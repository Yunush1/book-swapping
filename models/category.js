const mongoose = require('mongoose');
const BooksExchange = require('./exchange');
const {Schema} = mongoose;

const categorySchema = new Schema({
    name:{
        type:String,
        require:true,
    },
    image:{
        type:String
    },
    exchages:[{
        type:Schema.Types.ObjectId,
        ref:BooksExchange
    }],
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
},{
    timestamps: true
})

categorySchema.index({name: 1}, {unique: true})


module.exports = mongoose.model('Category', categorySchema)