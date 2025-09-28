const mongoose = require('mongoose')
const Enums = require('../utils/constants')
const {Schema} = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },

    password: {
        type: String,
    },
    mobileNumber:{
        type:String,
    },
    loginMethod:{
        type:Number,
        enum:Object.values(Enums.USER.LOGIN_METHOD)
    },
    sessionId:{
        type: String
    },
    role:{
        type:Number,
        default:Enums.USER.ROLE.USER
    },
    address:{
        street:{
            type: String,
        },
        pinCode:{
            type: String,
            maxlength: 6
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    date: {
        type: Date,
        default: Date.now
    },
    isBlock:{
        type: Boolean,
        default: false
    },
    isDeleted:{
        type: Boolean,
        default: false
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

userSchema.index({email: 1}, {unique: true})
userSchema.index({name: 1})

module.exports = mongoose.model('User', userSchema)