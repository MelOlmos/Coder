const CartManagerDB = require('../dao/mongo/cartDaoDB');

class CartController {
    constructor(){
        this.cartManager = new CartManagerDB();
    }

    async addProductToCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const { productId, quantity } = req.body;
            const updatedCart = await this.cartManager.addProductToCart(cartId, { productId, quantity });
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await this.cartManager.getAllCarts();
            res.json({ carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.params.cartId;
            const cart = await this.cartManager.getCartById(cartId);
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
                return;
            }
            res.json({ cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addCart(req, res) {
        try {
            const newCart = req.body;
            const createdCart = await this.cartManager.addCart(newCart);
            res.json(createdCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const updatedCartData = req.body;
            const updatedCart = await this.cartManager.updateCart(cartId, updatedCartData);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = req.params.cartId;
            await this.cartManager.deleteCart(cartId);
            res.json({ message: 'Carrito eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const updatedCart = await this.cartManager.deleteAllProductsFromCart(cartId);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const quantity = req.body.quantity;
            const updatedCart = await this.cartManager.updateProductQuantity(cartId, productId, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = CartController