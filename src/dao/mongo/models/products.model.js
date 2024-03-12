//acá va el modelo(schema) que queramos modelar de la db
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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

productsSchema.plugin(mongoosePaginate)

//Esto para que la búsqueda por query tome nombre y categoría
productsSchema.index({ name: "text", category: "text" });

const productsModel = mongoose.model(productsCollection, productsSchema);

module.exports = {
    productsModel
};