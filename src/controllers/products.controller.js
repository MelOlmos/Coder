const ProductManagerDB = require('../dao/mongo/productManagerDB');

class ProductController {
    constructor(){
        this.userService = new ProductManagerDB();
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.userService.getAllProducts();
            res.json({ products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            const product = await this.userService.getProductById(productId);
            if (!product) {
                res.status(404).json({ error: 'Producto no encontrado' });
                return;
            }
            res.json({ product });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addProduct(req, res) {
        try {
            const newProductData = req.body;
            const createdProduct = await this.userService.addProduct(newProductData);
            res.json(createdProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.pid;
            const updatedProductData = req.body;
            const updatedProduct = await this.userService.updateProduct(productId, updatedProductData);
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.pid;
            await this.userService.deleteProduct(productId);
            res.json({ Resultado: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;
