const mongoose = require("mongoose");
const { cartsModel } = require("../dao/models/carts.model");
const { productsModel } = require('../dao/models/products.model');

exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/')
        console.log('Base de datos conectada')        
    } catch (error) {
        console.log(error)
    }

/* await cartsModel.create({products:[]})
const cart = await cartsModel.findOne({_id: '65aad4be1c85e480cce4db83'})
cart.products.push({product: '65aae232c6234bf161a30bb5'})

    try {
        await cart.save();
        console.log('Cambios en el carrito guardados correctamente.');
        console.log(cart.products)
    } catch (error) {
            console.log(error)
        } */
    }