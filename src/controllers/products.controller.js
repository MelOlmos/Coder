const { productService } = require('../repositories')
const httpServer = require('../app.js');
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
            const product = await productService.getProductById(productId);
            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }
            res.json({ product });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createProduct  = async (req, res) => {
        try {
            const newProductData = req.body;
            const createdProduct = await productService.createProduct(newProductData);
            io.emit('newProduct', { product: createdProduct });
            res.json(createdProduct.toObject());
        } catch (error) {
            res.status(500).json({ error: error.message });
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
