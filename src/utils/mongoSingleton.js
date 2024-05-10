const  mongoose = require("mongoose")
const { logger } = require('./logger.js');


class MongoSingleton {
    static #instance
    constructor(){
        mongoose.connect(process.env.MONGO_URL);
        this.logger = logger
    }

    static getInstance(){
        if(this.#instance){
        logger.info(`Database previously connected :) | ${new Date().toLocaleTimeString()}`)   
            return this.#instance
        }
    
        this.#instance = new MongoSingleton(process.env.MONGO_URL)
        return this.#instance
    }
}

module.exports = MongoSingleton