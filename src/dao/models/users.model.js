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
        enum: ['user', 'admin'],
        default: 'user'
    }
    
})

usersSchema.plugin(mongoosePaginate)

const usersModel = mongoose.model(usersCollection, usersSchema);

module.exports = {
usersModel
}; 