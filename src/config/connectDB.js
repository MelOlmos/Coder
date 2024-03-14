const mongoose = require("mongoose");
const { program } = require("../utils/commander")
const MongoSingleton = require("../utils/mongoSingleton")
const dotenv = require('dotenv')

const { mode } = program.opts()
console.log(mode)
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
        await mongoose.connect('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}