// Archivo de rutas para carts con mongoDB
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/carts.controller.js')
const { authorization } = require('../middleware/authentication.js');
const {
  addProductToCart,
  getAllCarts,
  getCartById,
  addCart,
  updateCart,
  purchaseCart,
/*   getProductsInCart, */
  deleteProductFromCart
  } = new CartController()


  /* Agregar producto al carrito por ID */
router.post('/:cartId/products', authorization(['user']), addProductToCart);

/* Eliminar un producto de carrito por ID*/ 
router.delete('/:cid/product/:pid', deleteProductFromCart)

/* Obtener todos los carritos */
router.get('/', getAllCarts);

/* Obtener carrito por ID */
router.get('/:cartId', getCartById);  //priorizar este endpoint

/* Agregar un nuevo carrito */
router.post('/', addCart);

/* Actualizar carrito por ID */
router.put('/:cartId', updateCart);

/* Ruta para finalizar la compra de un carrito */
router.get('/:cartId/purchase', purchaseCart);

/* Mostrar todos los productos de un carrito por Id*/
/* router.get('/:cartId/products', getProductsInCart); */ 


module.exports = router;