const UserRepository = require('./userRepository')
const ProductRepository = require('./productRepository')
const CartRepository = require('./cartRepository')
const TicketRepository = require('./ticketRepository')
const { 
    UserDao, 
    ProductDao,
    CartDao,
    TicketDao
} = require('../dao/factory')


// userSevice es un objeto con todos los métodos de repository
const userService    = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService    = new CartRepository(new CartDao())
const ticketService = new TicketRepository(new TicketDao())

module.exports = {
    userService,
    productService,
    cartService,
    ticketService
}