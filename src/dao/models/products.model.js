//acá va el modelo(schema) que queramos modelar de la db
const mongoose = require("mongoose");

const productsCollection = 'products';


const productsSchema = new mongoose.Schema ({
    
        title: String,
        description: String,
        price: Number,
        thumbnail: String,
        code: String,
        stock: Number,
        category: String,
        
})

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = {
    productsModel
};