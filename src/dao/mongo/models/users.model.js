const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2')
const usersCollection = 'users';

const usersSchema = new mongoose.Schema ({
    
    first_name: {
        type: String,
        index: true,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    },
    cartID: {
        type: mongoose.Schema.ObjectId,
        ref: 'carts'
    },
    documents: [{
        name: String,
        reference: String
    }],
    last_connection: Date,
    isActive: {
        type: Boolean,
        default: true
    }
    
})

usersSchema.plugin(mongoosePaginate)

const usersModel = mongoose.model(usersCollection, usersSchema);

module.exports = {
usersModel
}; 