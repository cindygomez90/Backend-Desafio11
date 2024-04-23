    const { cartService, productService, ticketService } = require ('../repositories/index.js')
    const { generateUniqueCode } = require ('../utils/uniqueCode.js')
    const { CustomError } = require ('../utils/errors/customError.js')
    const { EErrors } = require ('../utils/errors/enums.js')
    const { generateCartNotFoundErrorInfo, generateProductNotFoundErrorInfo, generateAddProductToCartErrorInfo } = require ('../utils/errors/info.js')


    class CartController {

        constructor () {
            this.cartService = cartService
            this.productService = productService
            this.ticketService = ticketService
        }

        createCart = async (req, res, next)=> {
            try {
                const result = await this.cartService.createCart ()
        
                res.status(200).json ({
                    status: "succes",
                    payload: result
                })
            } catch (error) {
                console.error('Error al crear el carrito:', error)
                next (error)
                }
            }

        
        getCart = async (req, res) => {
            try {
                const {cid} = req.params
                const cart = await this.cartService.getCart (cid) 
                res.send ({
                    status: "succes", 
                    payload: cart
                })
            } catch (error) {
                console.log (error)
                }
        }

        addProductToCart = async (req, res, next) => {
            let cid, pid  
        
            try {
                ({ cid, pid } = req.params)    
                const cart = await this.cartService.getCart(cid)
                
                if (typeof cart === 'string') {                    
                    CustomError.createError({
                        name: 'Error al identificar al carrito',
                        cause: generateCartNotFoundErrorInfo(cid),   
                        message: 'No se encuentra el carrito indicado',
                        code: EErrors.CART_NOT_FOUND_ERROR
                    })
                    
                }
                
                const product = await this.productService.getProduct(pid)
        
                if (!product) {
                    CustomError.createError({
                        name: 'Error al identificar el producto',
                        cause: generateProductNotFoundErrorInfo(pid),   
                        message: 'No se encuentra el producto indicado',
                        code: EErrors.PRODUCT_NOT_FOUND_ERROR
                    })
                    
                }
        
                // Verificar si el usuario es premium
                if (req.user && req.user.role === 'USER_PREMIUM') {
                // Verificar si el producto pertenece al usuario
                if (product.owner === req.user.email) {
                // Si el producto pertenece al usuario premium, devolver un mensaje de error
                    return res.status(403).json({
                    status: 'error',
                    message: 'No puedes agregar a tu carrito un producto que te pertenece.'
                    })
                }
            }


                if (cart && cart.products && cart.products.length > 0) {
                    const productIndex = cart.products.findIndex(p => p.product.equals(pid))
                    
                    if (productIndex === -1) {
                        cart.products.push({
                            product: pid,
                            quantity: 1
                        })
                    } else {                    
                        cart.products[productIndex].quantity += 1
                    }
                } else {
                    cart.products = [{
                        product: pid,
                        quantity: 1
                    }]
                }
        
                await cart.save()
        
                res.json({
                    status: 'success',
                    payload: cart,
                })
            } catch (error) {
                next(error)
            }
        }
        

        updateCart = async (req, res) => {
            try {
                const { cid } = req.params
                const newProducts = req.body
                const cart = await this.cartService.updateCart(cid, newProducts)
        
                if (!cart) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'No se encuentra el carrito indicado',
                    })
                }

                res.json({
                    status: 'success',
                    payload: cart,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar el carrito',
                })
            }
        }

        updateProductQuantity = async (req, res) => {
            try {
                const { cid, pid } = req.params
                const { quantity } = req.body
        
                const cart = await this.cartService.updateProductQuantity (cid, pid, quantity)
        
                if (!cart) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'No se encuentra el carrito o el producto indicado',
                    })
                } 
        
                res.json({
                    status: 'success',
                    payload: cart,
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar la cantidad del producto',
                })
            }
        }

        deleteProductFromCart = async (req, res) => {
            try {
                const { cid, pid } = req.params
                const cart = await this.cartService.deleteProductFromCart(cid, pid)
        
                if (!cart) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'No se encuentra el carrito o producto indicado',
                    })
                }
        
                res.json({
                    status: 'success',
                    payload: cart,
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar el producto del carrito',
                })
            }
        }

        deleteAllProductsFromCart = async (req, res) => {
            try {
                const { cid } = req.params
                const cart = await this.cartService.deleteAllProductsFromCart(cid)
        
                if (!cart) {
                    return res.status(404).json({
                        status: 'error',
                        message: 'No se encuentra el carrito indicado',
                    });
                }
        
                res.json({
                    status: 'success',
                    message: 'Se eliminaron todos los productos del carrito',
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error al eliminar todos los productos del carrito',
                })
            }
        }

        purchaseCart = async (req, res) => {
            try {
                    const { cid } = req.params
                    const userCart = req.user.email
                    const cart = await this.cartService.getCart(cid)
                    
                    if (!userCart || cart.products.length === 0) {
                        return res.status(400).json({ status: 'error', error: 'El carrito está vacío.' })
                    }


                    const purchasedProducts = []   
                    const failedProducts = []

                try {
                    let totalAmount = 0
                    for (const cartProduct of cart.products) {
                        const { product, quantity } = cartProduct
                        
                        if (product.stock >= quantity) {
                            totalAmount += product.price * quantity
                            purchasedProducts.push(cartProduct.product)
                        } else {
                            failedProducts.push(product._id)
                        }
                    }

                    const ticketData = {
                        code: generateUniqueCode(), 
                        purchase_datetime: new Date(),
                        amount: totalAmount,
                        purchaser: userCart, 
                        purchasedProducts,
                    }

                    const createdTicket = await this.ticketService.createTicket(ticketData)

                    const remainingProducts = cart.products.filter(cartProduct => !failedProducts.includes(cartProduct.product.toString()))
                    
                    await this.cartService.updateCart (cid, { products: remainingProducts })
                    
                    return res.json ({ createdTicket, failedProducts })  

                } catch (error) {
                    console.error('Error interno al crear el ticket', error)
                    return res.status(500).json({ 
                        status: 'error', 
                        error: 'Error al crear el ticket de compra.' 
                    })
                }
            } catch (error) {
                console.error('Error interno al recuperar el carrito', error)
                return res.status(500).json({
                    status: 'error',
                    error: 'Error al procesar la compra.',
                })   
            }
        }
    }

    module.exports = CartController