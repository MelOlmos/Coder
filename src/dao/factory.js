const configObject  = require('../config/connectDB');
const {connectDB}  = require('../config/connectDB');
const CartManagerDB = require('./mongo/cartDaoDB');

let UserDao
let ProductDao
let CartDao
let TicketDao


// persistence MONGO by default
switch (configObject.persistence) {
    case 'FILE':
        const UserDaoFile = require('./file/userDaoFile')
        UserDao = UserDaoFile
        break;

    case 'MEMORY':
        break;

    default:
        connectDB()

        const UserDaoMongo = require('./mongo/userDaoDB')
        UserDao = UserDaoMongo

        const ProductDaoMongo = require('./mongo/productDaoDB')
        ProductDao = ProductDaoMongo

        const CartManagerDB = require('./mongo/cartDaoDB')
        CartDao = CartManagerDB

        const TicketDaoMongo = require('./mongo/ticketDaoDB')
        TicketDao = TicketDaoMongo
        break;
}

module.exports = {
    UserDao,
    ProductDao,
    CartDao,
    TicketDao
}