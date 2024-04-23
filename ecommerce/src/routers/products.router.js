//importación de módulos
const { Router } = require ("express")
const { passportCall}  = require ('../middleware/pasportCall.js')
const { authorization } = require ('../middleware/authentication.js')
const ProductController = require ('../controllers/products.controller.js')


const productsRouter = Router ()
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct} = new ProductController ()


//Endpoint para solicitar todos los productos
productsRouter.get('/', getProducts)

//Endpoint para solicitar un producto por id
productsRouter.get('/:pid', getProduct) 

//Endpoint para agregar un nuevo producto
productsRouter.post('/', passportCall ('jwt'), authorization (['USER_PREMIUM','ADMIN']), createProduct)

//Endpoint para actualizar campos de un producto por id
productsRouter.put('/:pid', passportCall ('jwt'), authorization (['USER_PREMIUM','ADMIN']), updateProduct)

//Endpoint para eliminar un producto por id
productsRouter.delete('/:pid', passportCall ('jwt'), authorization (['USER_PREMIUM','ADMIN']), deleteProduct)


module.exports = productsRouter

