//importación de módulos
const { Router } = require ("express")
const { passportCall}  = require ('../middleware/pasportCall.js')
const { authorization } = require ('../middleware/authentication.js')
const CartController = require("../controllers/carts.controller.js")

const cartsRouter = Router ()
const { createCart, getCart, addProductToCart, updateCart, updateProductQuantity, deleteProductFromCart, deleteAllProductsFromCart, purchaseCart } = new CartController

//Endpoint para solicitar un carrito por id
cartsRouter.get ('/:cid', getCart)  //OK

//Endpoint para crear un carrito
cartsRouter.post ('/', createCart) //OK

//Endpoint para agregar un producto a un carrito
cartsRouter.post('/:cid/products/:pid', passportCall ('jwt'), authorization (['USER', 'USER_PREMIUM']), addProductToCart) //OK

//Endpoint para actualizar el carrito con un arreglo de productos
cartsRouter.put('/:cid',updateCart) //OK

//Endpoint para actualizar solo la cantidad de un producto en el carrito
cartsRouter.put('/:cid/products/:pid', updateProductQuantity)

//Endpoint para eliminar un producto de un carrito
cartsRouter.delete('/:cid/products/:pid', deleteProductFromCart)

//Endpoint para eliminar todos los productos de un carrito
cartsRouter.delete('/:cid', deleteAllProductsFromCart)  //OK

//Endpoint para finalizar el proceso de compra
cartsRouter.post('/:cid/purchase', passportCall ('jwt'), authorization (['USER']), purchaseCart)    //OK


module.exports = cartsRouter