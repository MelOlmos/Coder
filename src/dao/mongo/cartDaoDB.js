const path = require('path')
const { cartsModel } = require('./models/carts.model.js');
const { productsModel } = require('./models/products.model.js');
const ticketService = require('../../repositories/index.js');
const productService = require('../../repositories/index.js');
const cartService = require('../../repositories/index.js');

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

  async update(cartId, { products }) {
    try {
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cartId).populate('products.product');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      // Crear un nuevo array de productos para el carrito actualizado
      const newProducts = products.map(product => ({
        product: product.productId, quantity: product.quantity
      }));

      // Asignar el nuevo array de productos al carrito
      cart.products = newProducts;
      console.log(newProducts)

      // Guardar el carrito actualizado
      const updatedCart = await cart.save();
      return updatedCart;

    } catch (error) {
      throw new Error('Error actualizando el carrito: ' + error);
    }
  }

  async updateAllProducts(cartId, productsNotPurchased) {
    try {
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      // Vaciar el carrito
      cart.products = [];

      // Obtiene el array de ids de productos no comprados
      const productsIds =
        Array.isArray(productsNotPurchased) ? productsNotPurchased : productsNotPurchased.products;
      // Agrega los productos no comprados al carrito con cantidad 1
      productsIds.forEach(productId => {
        cart.products.push({ product: productId, quantity: 1 });
      });

      // guardar 
      const updatedCart = await cart.save();
      return {updatedCart};
    } catch (error) {
      throw new Error('Error actualizando el carrito: ' + error.message);
    }
  }

  async delete(cartId) {
    try {
      const deletedCart = await cartsModel.findByIdAndDelete(cartId);
      return deletedCart;
    } catch (error) {
      console.log(`Error al eliminar el carrito: ${error.message}`);
      throw error;
    }
  }

  async deleteAllProductsFromCart(cartId) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      cart.products = [];
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartsModel.findById(cartId);
      if (!cart) {
        throw new Error('El carrito no existe');
      }
      //Acá busco el id dentro de productos
      const productIndex =
        cart.products.findIndex(product => product.product._id.toString() === productId);

      if (productIndex === -1) {
        throw new Error('El producto no está en el carrito');
      }
      cart.products[productIndex].quantity += quantity;
      console.log('Updated Cart:', cart);

      await cart.save();
      return cart;
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
      return new Error('Error deleting product from cart' + error)
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
        if (product.product && product.product.price && product.product.stock > 0) {
          totalAmount += product.product.price * product.quantity;
        }
      }

      return totalAmount;
    } catch (error) {
      throw new Error(`Error al calcular el monto del carrito: ${error.message}`);
    }
  }


  /*Para finalizar compra*/
  async purchaseCart(cartId, userEmail) {
    try {
      const cart = await cartsModel.findById(cartId); //busco por id de carrito

      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado :C' });
      }

      const products = cart.products.filter(product => product.product && product.product.stock > 0);
      const productsNotPurchased = cart.products.filter(product => product.product && product.product.stock === 0).map(product => product.product._id.toString());
      const productQuantities = {};
      // registro las cantidades de cada producto
      for (const product of products) {

        const id = product.product._id;
        const quantity = product.quantity

        if (productQuantities[id]) {
          productQuantities[id] += quantity;
        } else {
          productQuantities[id] = quantity;
        }

      }
      // resto esas cantidades al stock de cada producto
      const productsToUpdate = [];
      for (const product of products) {

        const productDetails = product.product;

        const productId = product.product._id;

        const newStock = productDetails.stock - productQuantities[productId];
        productsToUpdate.push({ productId, newStock });

      }
      //amount del carrito
      const totalAmount = await this.calculateCartAmount(cartId);
      // ticket
      const ticketData = {
        code: this._ticketCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: userEmail,
        products: products
      };

      const productsNotPurchasedTitles = [];
      // vacía el carro después de finalizar compra, deja los productos sin stock

      if (productsNotPurchased.length === 0) {
        await this.deleteAllProductsFromCart(cartId);
      } else {
        await this.updateAllProducts(cartId, { products: productsNotPurchased });
      for (const productId of productsNotPurchased) {
        const product = await productsModel.findById(productId);
        if (product) {
          productsNotPurchasedTitles.push(product.title);
        }
      }
      }

      await Promise.all(productsToUpdate.map(({ productId, newStock }) =>
        productsModel.updateOne({ _id: productId }, { stock: newStock })

      ));

      return { products, productsNotPurchased, ticketData, productsNotPurchasedTitles};

    } catch (error) {
      throw new Error(error.message);
    }
  }


  _ticketCode() {
    // Genero un código aleatorio con números y letras
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      //obtiene el caracter en la posición randomIndex y lo suma al final
      code += characters.charAt(randomIndex);
    }

    return code;
  }
}

module.exports = CartManagerDB