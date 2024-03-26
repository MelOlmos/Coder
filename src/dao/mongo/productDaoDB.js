const { productsModel } = require('./models/products.model.js');

class ProductManagerDB {
  constructor(){
      this.model = productsModel
  }

  get = async () => await this.model.find({isActive: true})    
  getBy = async (filter) => await this.model.findById(filter)
  create = async (newProduct) => await this.model.create(newProduct)
  update = async (pid, productToUpdate) => await this.model.findByIdAndUpdate({_id: pid}, productToUpdate, {new: true})
  delete = async (pid) => await this.model.findByIdAndUpdate({_id: pid}, {isActive: false}, {new: true})

}

module.exports = ProductManagerDB