//// Archivo de rutas para products con mongoDB
const Router = require('express');
const ProductController = require('../controllers/products.controller');
const passport = require('passport');
const { authorization } = require('../middleware/authentication.js');


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
    .post('/', createProduct) // elimino momentáneamente el middle para hacer pruebas postman
    .put('/:pid', passport.authenticate('jwt', { session: false }),  authorization(['admin']), updateProduct) // PUT solo para admin
    .delete('/:pid', passport.authenticate('jwt', { session: false }),  authorization(['admin']), deleteProduct) // DELETE solo para admin


module.exports = productRouter;