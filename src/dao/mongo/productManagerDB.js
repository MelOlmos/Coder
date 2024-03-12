const { productsModel } = require('./models/products.model.js');

class ProductManagerDB {
  async getAllProducts() {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      console.log(`Se produjo un error: ${error.message}`);
    }
  };

  async getProductById(productId) {
    try {
      const productById = await productsModel.findById(productId);
      return productById;
    } catch (error) {
      console.log(`Se produjo un error al obtener el producto: ${error.message}`);
    }
  }

  async addProduct(newProductData) {
    try {
      const newProduct = await productsModel.create(newProductData);
      console.log("Producto agregado correctamente a MongoDB");
      return newProduct;
    } catch (error) {
      console.log(`Se produjo un error al agregar el producto: ${error.message}`);
    }
  }

  async updateProduct(productId, updatedProductData) {
    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(
        productId,
        updatedProductData,
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      console.log(`Se produjo un error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      const deletedProduct= await productsModel.findByIdAndDelete(productId);
      return deletedProduct;
    } catch (error) {
      console.log(`Error al eliminar el producto: ${error.message}`);
    }
  }
};

module.exports = ProductManagerDB