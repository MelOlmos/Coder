const mongoose = require("mongoose");
const { program } = require("../utils/commander")
const MongoSingleton = require("../utils/mongoSingleton")
const dotenv = require('dotenv')

const { mode } = program.opts()
/* addLogger(mode); */
dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

exports.configObject = {
    port:           process.env.PORT || 8080,
    mongo_url:      process.env.MONGO_URL,
    jwt_secret_Key: process.env.JWT_SECRET_KEY,
    persistence:    process.env.PERSISTENCE
}

exports.connectDB = async () => {
    try {
        await MongoSingleton.getInstance(process.env.MONGO_URL)         
    } catch (error) {
        console.log(error)
    }
}