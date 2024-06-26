//// Archivo de rutas para products con mongoDB
const Router = require('express');
const ProductController = require('../controllers/products.controller.js');
const passport = require('passport');
const { authorization } = require('../middleware/authentication.js');
const { premiumDeleteAuthorization } = require('../middleware/authentication.js');



const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()


const productRouter = Router();

productRouter
    .get('/', getProducts)
    .get('/:pid', getProductById)
    .post('/', passport.authenticate('jwt', { session: false }), authorization(['premium', 'admin']), createProduct)
    .put('/:pid', passport.authenticate('jwt', { session: false }), authorization(['admin']), updateProduct)
    .patch('/:pid', passport.authenticate('jwt', { session: false }), authorization(['admin']), updateProduct)
    .delete('/:pid', passport.authenticate('jwt', { session: false }), authorization(['admin', 'premium']), premiumDeleteAuthorization, deleteProduct)


module.exports = productRouter;