// Archivo de rutas para carts con mongoDB
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/carts.controller.js')
const {
  addProductToCart,
  getAllCarts,
  getCartById,
  addCart,
  updateCart
  } = new CartController()


  /* Agregar producto al carrito por ID */
router.post('/:cartId/products/', addProductToCart);

/* Obtener todos los carritos */
router.get('/', getAllCarts);

/* Obtener carrito por ID */
router.get('/:cartId', getCartById);

/* Agregar un nuevo carrito */
router.post('/', addCart);

/* Actualizar carrito por ID */
router.put('/:cartId', updateCart);


module.exports = router;




/* Obtener todos los carritos */
/* router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getAllCarts();
    res.json({ carts });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/* Obtener carrito por ID */
/* router.get('/:cartId', async (req, res) => {
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
}); */

/* Agregar un nuevo carrito */
/* router.post('/', async (req, res) => {
  try {
    const newCart = req.body;
    const createdCart = await cartManager.addCart(newCart);

    res.json(createdCart);
} catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/* Actualizar carrito por ID */
/* router.put('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const updatedCartData = req.body;
    const updatedCart = await cartManager.updateCart(cartId, updatedCartData);

    res.json(updatedCart);
} catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/* Eliminar carrito por ID */
/* router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    await cartManager.deleteCart(cartId);

    res.json({ Resultado: 'Carrito eliminado correctamente' });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */


/*Eliminar un producto seleccionado del carrito*/
/* router.delete('/:cartId/products/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    // Obtengo el carrito actual
    const newCart = await cartManager.getCartById(cartId);

    //prueba en consola
    console.log(newCart);
    if (!newCart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    // Filtro los productos excluyendo el productId indicado
    const updatedProducts = 
    newCart.products.filter(product => product.product._id.toString() !== productId);
    //prueba en consola
    console.log(updatedProducts)
    // Actualizo el carro con los productos filtrados
    const updatedCart 
    = await cartManager.updateCart(cartId, { products: updatedProducts });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 */
/*Acualizar el carrito con un arrar de productos nuevos*/
/*  
  try {
    const cartId = req.params.cartId;
    const updatedCartData = req.body;
    const updatedCart = await cartManager.updateCart(cartId, updatedCartData);

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/*Actualiza cantidad pasada por body de un producto en el carro*/
/* router.put('/:cartId/products/:productId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */

/*Eliminar todos los productos de carrito*/
/* router.delete('/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const deletedCart = await cartManager.deleteAllProductsFromCart(cartId);

    res.json({ Resultado: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); */



