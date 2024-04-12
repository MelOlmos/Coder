const { program } = require("../utils/commander")
const MongoSingleton = require("../utils/mongoSingleton")
const dotenv = require('dotenv')
const { mode } = program.opts()


dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})

configObject = {
    port:           process.env.PORT || 8080,
    mongo_url:      process.env.MONGO_URL,
    jwt_secret_Key: process.env.JWT_SECRET_KEY,
    persistence:    process.env.PERSISTENCE,
    gmail_pass:     process.env.GMAIL_PASS,
    gmail_user:     process.env.GMAIL_USER
}

connectDB = async () => {
    try {
        await MongoSingleton.getInstance(process.env.MONGO_URL)         
    } catch (error) {
        console.log(error)
    }
}

module.exports = { 
    mode,
    configObject,
    connectDB 
 }