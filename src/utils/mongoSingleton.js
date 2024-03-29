const  mongoose = require("mongoose")
const { logger } = require('./logger.js');


class MongoSingleton {
    static #instance
    constructor(){
        mongoose.connect('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/');
        this.logger = logger
    }

    static getInstance(){
        if(this.#instance){
        logger.info(`Database previously connected :) | ${new Date().toLocaleTimeString()}`)   
            return this.#instance
        }
    
        this.#instance = new MongoSingleton('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/')
        return this.#instance
    }
}

module.exports = MongoSingleton