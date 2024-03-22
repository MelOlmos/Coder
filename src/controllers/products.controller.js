const { productService } = require('../repositories')
const httpServer = require('../app.js');
const CustomError = require('../utils/errors/customError.js');
const { generateProductErrorInfo } = require('../utils/errors/info.js');
const { EErrors } = require('../utils/errors/enums.js');
const io = require('socket.io')(httpServer);


class ProductController {
    constructor(){
        this.service = productService
    }

    getProducts = async (req, res) => {
        try {
            const products = await productService.getProducts();
            res.json({ products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getProductById  = async (req, res) => {
        try {
            const productId = req.params.pid;
            const product = await productService.getProduct(productId);
            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }
            res.json({ product });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createProduct  = async (req, res, next) => {
        try {
            const newProductData = req.body;
            if(!title || !price) {
                CustomError.createError({
                    name: 'Product creation error',
                    cause: generateProductErrorInfo({
                        title,
                        price
                    }),
                    message: 'Error trying to create product',
                    code: EErrors.MISSING_PARAMETER_ERROR
                })
            }
            const createdProduct = await productService.createProduct(newProductData);
            io.emit('newProduct', { product: createdProduct });
            res.json(createdProduct.toObject());
        } catch (error) {
            next(error);
        }
    }

    updateProduct = async (req, res) => {
        try {
            const productId = req.params.pid;
            const updatedProductData = req.body;
            const updatedProduct = await productService.updateProduct(productId, updatedProductData);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteProduct  = async (req, res) => {
        try {
            const productId = req.params.pid;
            await productService.deleteProduct(productId);
            res.json({ Resultado: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = ProductController;