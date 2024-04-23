const UserRepository = require("./users.respository")
const ProductRepository = require("./products.respository")
const CartRepository = require ('./carts.respository')
const TicketRepository = require ('./tickets.repository')

const { UserDao, ProductDao, CartDao, TicketDao } = require("../daos/factory")



const userService = new UserRepository(new UserDao())
const productService = new ProductRepository(new ProductDao())
const cartService = new CartRepository(new CartDao())
const ticketService = new TicketRepository(new TicketDao())

module.exports = { userService, productService, cartService, ticketService}