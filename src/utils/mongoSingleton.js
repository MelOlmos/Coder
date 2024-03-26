const  mongoose = require("mongoose")

class MongoSingleton {
    static #instance
    constructor(){
        mongoose.connect('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/')
    }

    static getInstance(){
        if(this.#instance){
            console.log('Base de datos previamente conectada')
            return this.#instance
        }
    
        this.#instance = new MongoSingleton('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/')
        return this.#instance
    }
}

module.exports = MongoSingleton