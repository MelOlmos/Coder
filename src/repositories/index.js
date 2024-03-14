const UserRepository = require('./userRepository')
const ProductRepository = require('./productRepository')
const CartRepository = require('./cartRepository')
const { 
    UserDao, 
    ProductDao,
    CartDao 
} = require('../dao/factory')


// userSevice es un objeto con todos los métodos de repository
const userService    = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService    = new CartRepository(new CartDao())

module.exports = {
    userService,
    productService,
    cartService
}