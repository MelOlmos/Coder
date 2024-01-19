// Archivo de rutas para carts con mongoDB
const express = require('express');
const router = express.Router();
const { CartManagerDB } = require('../src/dao/cartManagerDB.js');

const cartManager = new CartManagerDB();

/* Obtener todos los carritos */
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json({ carts });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Obtener carrito por ID */
router.get('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    res.json({ cart });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Agregar un nuevo carrito */
router.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    const createdCart = await cartManager.addCart(newCart);

    res.json(createdCart);
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Actualizar carrito por ID */
router.put('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const updatedCartData = req.body;
    const updatedCart = await cartManager.updateCart(cartId, updatedCartData);

    res.json(updatedCart);
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* Eliminar carrito por ID */
router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    await cartManager.deleteCart(cartId);

    res.json({ Resultado: 'Carrito eliminado correctamente' });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;