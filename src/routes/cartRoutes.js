const express = require('express');
const router = express.Router();


/* Acá genero nuevo carrito */
router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    console.log(newCart);
    res.json(newCart);
});

/* Obtengo carrito por id */
router.get('/:cid', (req, res) => {
    let cartId = req.params.cid;
    const cart = cartManager.get(cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});


/* Agrego producto al carrito */
router.post('/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    cartManager.addProductToCart(cartId, productId);
    res.json({ success: true });
});

module.exports = router;
