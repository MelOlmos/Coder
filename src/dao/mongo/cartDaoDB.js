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
        // Si el producto ya está en el carrito, aumento
        cart.products[existingProductIndex].quantity = quantity;
      }
      // Guarda el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      throw error;
    }
  }

  async get() {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.log(`Se produjo un error: ${error.message}`);
      throw error;
    }
  };

  async getBy(cartId) {
    try {
      const cartById = await cartsModel.findById(cartId).populate('products.product').lean();
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

  async update(cartId, updatedCartData) {
    try {
        const updatedCart = await cartsModel.findOneAndUpdate(
          { _id: cartId }, // Filtrar por ID del carrito
          { $set: { products: [...updatedCartData.products] } }, // Actualizar todo el array 'products'
          { new: true } // Devolver el documento actualizado
        );
      return updatedCart;
    } catch (error) {
      console.log(`Se produjo un error al actualizar el carrito: ${error.message}`);
      throw error;
    }
  }

  async delete(cartId) {
    try {
      const deletedCart= await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      console.log(`Error al eliminar el carrito: ${error.message}`);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const deleteCart = await cartsModel.findById(cartId);
      if (!deleteCart) {
        throw new Error('Carrito no encontrado');
      }
      deleteCart.products = [];
      // Guarda el carrito actualizado
      const updatedCart = await deleteCart.save();
      
      return updatedCart;
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const idCart = await cartsModel.findById(cartId);
    if (!idCart) {
      throw new Error('El carrito no existe');
    }
    //pruebas de consola
    console.log('Cart:', idCart);
    console.log('Product ID:', productId);
    //Acá busco el id dentro de productos
    const productIndex = 
    idCart.products.findIndex(product => product.product._id.toString() === productId);
    console.log('Product Index:', productIndex);
    
    if (productIndex === -1) {
      throw new Error('El producto no está en el carrito');
    }
    idCart.products[productIndex].quantity = quantity;
    console.log('Updated Cart:', idCart);

    await idCart.save();
    return idCart;
  }
catch (error) {
  console.error('Error al actualizar la cantidad:', error);
  throw error;
  }
};

async deleteItem(cid, pid) {
  try {
      await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $pull: { products: { product: { _id: pid } } } },
          { new: true }
      )
  } catch (error) {
      return new Error('Error deleting product from cart'+error)
  }
};

async calculateCartAmount(cartId) {
  try {
    const cart = await cartsModel.findById(cartId).populate('products.product').lean();
    
      if (!cart) {
          throw new Error('Carrito no encontrado');
      }

      let totalAmount = 0;
      for (const product of cart.products) {
          totalAmount += product.product.price * product.quantity;
      }

      return totalAmount;
  } catch (error) {
      throw new Error(`Error al calcular el monto del carrito: ${error.message}`);
  }
};

}

module.exports = CartManagerDB