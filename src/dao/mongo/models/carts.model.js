//acá va el modelo(schema) que queramos modelar de la db
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const cartsCollection = 'carts';


const cartsSchema = new schema ({
    products: {
        type: [{
            _id: false,
            product: {
                type: schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
}});

cartsSchema.pre('findOne', function() {
    this.populate('products.product')
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = {
    cartsModel
};