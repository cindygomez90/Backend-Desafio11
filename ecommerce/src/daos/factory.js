const { configObject, connectBD } = require('../config/connectDB.js');

let UserDao
let ProductDao
let CartDao
let TicketDao

switch (configObject.persistence) {
    case 'FILE':
        const CartDaoFile = require('./File/cartsDaoFile.js')
        CartDao = CartDaoFile

        const ProductDaoFile = require('./File/productsDaoFile.js')
        ProductDao = ProductDaoFile    
    
        const UserDaoFile = require('./File/userDaoFile.js')
        UserDao = UserDaoFile

        break;
    case 'MEMORY':
        
        break;

    default:
        connectBD() 
        
        const CartDaoMongo = require('./Mongo/cartsDaoMongo.js')
        CartDao = CartDaoMongo

        const ProductDaoMongo = require('./Mongo/productsDaoMongo.js')
        ProductDao = ProductDaoMongo

        const UserDaoMongo = require('./Mongo/usersDaoMongo.js')
        UserDao = UserDaoMongo

        const TicketDaoMongo = require('./Mongo/ticketsDaoMongo.js')
        TicketDao = TicketDaoMongo

        break;
}

module.exports = { UserDao, ProductDao, CartDao, TicketDao }