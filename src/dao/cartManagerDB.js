const { cartsModel } = require('./models/carts.model.js');

class CartManagerDB {
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
      const cartById = await cartsModel.findById(cartId);
      return cartById;
    } catch (error) {
      console.log(`Se produjo un error al obtener el carrito: ${error.message}`);
      throw error;
    }
  }

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