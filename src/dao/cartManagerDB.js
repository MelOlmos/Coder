const { cartsModel } = require('./models/carts.model.js');
const { productsModel } = require('./models/products.model.js')

class CartManagerDB {

  async addProductToCart(cartId, { productId, quantity }) {
    try {
      // Obtengo carrito y producto por id
      const cart = await cartsModel.findById(cartId).populate('products.product');
      const product = await productsModel.findById(productId);
      // Verificando si el producto ya está en el carrito
      const existingProductIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.product && cartProduct.product.equals(productId)
      );
      if (existingProductIndex === -1) {
        // Si el producto no está en el carrito, lo agrego
        cart.products.push({ product: productId, quantity });
      } else {
        // Si el producto ya está en el carrito, aumento en 1
        cart.products[existingProductIndex].quantity += 1;
      }
      // Guarda el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }

  async getAllCarts() {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.log(`Se produjo un error: ${error.message}`);
      throw error;
    }
  };

  async getCartById(cartId) {
    try {
      const cartById = await cartsModel.findById(cartId).populate('products.product');
      return cartById;
    } catch (error) {
      console.log(`Se produjo un error al obtener el carrito: ${error.message}`);
      throw error;
    }
  };

  async addCart(newCart) {
    try {
      const createdCart = await cartsModel.create(newCart);
      return createdCart;
    } catch (error) {
      console.log(`Se produjo un error al agregar el carrito: ${error.message}`);
      throw error;
    }
  }

  async updateCart(cartId, updatedCartData) {
    try {
        const updatedCart = await cartsModel.findByIdAndUpdate(
        cartId,
        updatedCartData,
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      console.log(`Se produjo un error al actualizar el carrito: ${error.message}`);
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      const deletedCart= await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      console.log(`Error al eliminar el carrito: ${error.message}`);
      throw error;
    }
  }
};

module.exports = { CartManagerDB }