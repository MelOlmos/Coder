const express = require('express');
const router = express.Router();
const { CartManager } = require('./CartManager.js');

const cartManager = new CartManager('carrito_test.json');


/* Acá genero nuevo carrito */
router.post('/', (req, res) => {
    const newCart = {
        id: cartManager.generateUniqueId(),
        products: []
    };
    cartManager.createCart(newCart);
    res.json(newCart);
});

/* Obtengo carrito por id */
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

/* Agrego producto al carrito */
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    cartManager.addProductToCart(cartId, productId);
    res.json({ success: true });
});

module.exports = router;
