const mongoose = require("mongoose");

exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }
}