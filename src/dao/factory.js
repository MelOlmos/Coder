const configObject  = require('../config/connectDB');
const {connectDB}  = require('../config/connectDB');

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

        const CartDaoMongo = require('./mongo/cartDaoDB')
        CartDao = CartDaoMongo

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