//acá va el modelo(schema) que queramos modelar de la db
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cartsCollection = 'carts';


const cartsSchema = new schema ({
    
        id: Number || String,
        products: [{type: schema.Types.ObjectId,
                    ref: 'product'}]

})


const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = {
    cartsModel
};