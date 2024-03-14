const { authorization } = require('../middleware/authentication.js');
const { cartService } = require('../repositories/index.js');


// Middleware de autorización para el rol user
const isUser = authorization(['user']);

class CartController {
    constructor(){
        this.cartManager = cartService
    }


    async addProductToCart(req, res) {
        try {
            // Verifica si el usuario tiene el rol adecuado
        if (req.user.role !== 'user') {
            return res.status(403).json({ error: 'No tenés permiso para agregar productos al carrito.' });
        }

            const cartId = req.params.cartId;
            const { productId, quantity } = req.body;
            isUser (req, res, async () => {
                const updatedCart = await cartService.addProductToCart(cartId, { productId, quantity });
            res.json(updatedCart);
        });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllCarts(req, res) {
        try {
            const carts = await cartService.getAllCarts();
            res.json({ carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        try {
            const cartId = req.params.cartId;
            const cart = await cartService.getCartById(cartId);
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
            const createdCart = await cartService.addCart(newCart);
            res.json(createdCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const updatedCartData = req.body;
            const updatedCart = await cartService.updateCart(cartId, updatedCartData);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteCart(req, res) {
        try {
            const cartId = req.params.cartId;
            await cartService.deleteCart(cartId);
            res.json({ message: 'Carrito eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const cartId = req.params.cartId;
            const updatedCart = await cartService.deleteAllProductsFromCart(cartId);
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
            const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}


module.exports = CartController