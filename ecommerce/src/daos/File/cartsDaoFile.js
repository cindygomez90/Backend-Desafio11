//importación de los módulos a utilizar 
const fs = require ('node:fs/promises')

//creación de clase

class CartsDaoFile {
    constructor (path) {
        this.path = path
    }


//método para leer el archivo de carritos
    async readFileCarts () {
        try {
            const CartsData = await fs.readFile (this.path, 'utf-8')
            return JSON.parse (CartsData)
        } catch (error) {
            return []
        }
    }
    

//método para crear carrito
    async create () {
        try {
            const carts = await this.readFileCarts ()
            let newCart = {
                id: carts.length +1,
                products: []
            }
            carts.push (newCart)
            await fs.writeFile (this.path, JSON.stringify (carts, null, 2), 'utf-8')
            return newCart
        } catch (error) {
            return "Error al crear el carrito"
        }
    }

//método para buscar carrito por el id
    async getBy (cid) {
        try {
            const carts = await this.readFileCarts ()
            const cart = carts.find (cart => cart.id === cid)
            if (!cart) {
                return 'No se encuentra el id del carrito indicado'
            }
            return cart
        } catch (error) {
            console.log (error)
        }
    }

//método para agregar producto al carrito 
    async addProductToCart (cid, pid) {
        try {
            const carts = await this.readFileCarts ()
            const cartIdx = carts.findIndex (cart => cart.id === cid)
            
            if (cartIdx === -1) {
                return "No existe el carrito"
            }
            const productIdx = carts[cartIdx].products.findIndex (produc => produc.product === pid)
            if (productIdx===-1) {
                carts[cartIdx].products.push ({
                    product: pid,
                    quantity: 1
                })
            }else {
                carts[cartIdx].products[productIdx].quantity +=1
            }
            await fs.writeFile (this.path, JSON.stringify (carts, null, 2), 'utf-8')
            return carts [cartIdx] 
        } catch (error) {
            return error
        }
    
    }
    async update (cid, newProducts) {
    
    }

    async updateProductQuantity(cid, pid, quantity) {
    }
    async deleteProductFromCart(cid, pid) {
    }
    async deleteAllProductsFromCart(cid) {
    
    }
}



//exportación del módulo
module.exports = CartsDaoFile