    const  { cartModel }  = require ('../Mongo/models/carts.model.js')

    class CartsDaoMongo {
        
        async create () {
            return await cartModel.create ({ products: [] })
        }
        
        async getBy(cid) {
                const cart = await cartModel.findOne({_id:cid})
                if (!cart) {
                    return 'No se encuentra el id del carrito indicado'
                }
                return cart
            } 

        async addProductToCart(cid, pid) {
                    const cart = await cartModel.findOne({_id: cid})
                    if (!cart) {
                        return 'No existe el carrito'
                    }
        
                    const productIndex = cart.products.findIndex(p => p.product.equals(pid))
        
                    if (productIndex === -1) {
                            cart.products.push({
                            product: pid,
                            quantity: 1
                        })
                    } else {          
                    cart.products[productIndex].quantity += 1
                    }   
                
                    await cart.save()
                    return cart
                }

        async update (cid, newProducts) {
                    const cart = await cartModel.findOne({_id: cid})
                    if (!cart) {
                        return null
                    }

                    cart.products = newProducts
                    await cart.save()

                    return cart
                }

        async updateProductQuantity(cid, pid, quantity) {
                    const cart = await cartModel.findOne({_id: cid})
                    if (!cart) {
                        return null
                    }
            
                    const product = cart.products.find((p) => p.product.equals(pid))
            
                    if (!product) {
                        return null
                    }
            
                    product.quantity = quantity
                    await cart.save()
            
                    return cart
                }
        
        async deleteProductFromCart(cid, pid) {
                    const cart = await cartModel.findOne({_id: cid})
            
                    if (!cart) {
                        return null
                    }
            
                    const productIndex = cart.products.findIndex((product) => product.product.equals(pid))
            
                    if (productIndex === -1) {
                        return null
                    }
            
                    cart.products.splice(productIndex, 1)
                    await cart.save()
            
                    return cart
                }
            
        async deleteAllProductsFromCart(cid) {
                    const cart = await cartModel.findOne({_id: cid})
            
                    if (!cart) {
                        return null
                    }
            
                    cart.products = []
                    await cart.save()
            
                    return cart
                }        
        }


    module.exports = CartsDaoMongo
