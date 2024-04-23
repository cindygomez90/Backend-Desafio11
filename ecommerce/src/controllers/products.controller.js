const { productService } = require ('../repositories/index.js')
const { CustomError } = require ('../utils/errors/customError.js')
const { EErrors } = require ('../utils/errors/enums.js')
const { generateProductErrorInfo } = require ('../utils/errors/info.js')


    class ProductController {

        constructor () {
            this.productService = productService 
        }

        getProducts = async (req, res) => {
            try {
                const { limit = 10, pageQuery = 1, category, order, status } = req.query
        
                const filter = {}
                if (category) {
                    filter.category = category
                }
        
                if (status !== undefined) {
                    filter.status = status === 'true' ? true : status === 'false' ? false : undefined
                }
        
                const sortOptions = {}
                if (order === 'asc') {
                    sortOptions.price = 1
                } else {
                    sortOptions.price = -1
                }
        
                const {
                    docs,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    page,
                    totalPages,
                } = await this.productService.getProducts(filter, { limit, page: pageQuery, sort: sortOptions, lean: true })
        
                res.json({
                    status: 'success',
                    result: {
                        products: docs,
                        totalPages: totalPages,
                        hasPrevPage,
                        hasNextPage,
                        prevPage,
                        nextPage,
                        page,
                    },
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    error: error.message,
                })
            }
        }
        
        getProduct = async (req, res)=>{  
            try {      
                const { pid } = req.params        
                const product = await this.productService.getProduct (pid)
                res.json({
                    status: 'success',
                    result: product
                })
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: 'error',
                    message: 'Error al obtener el producto por ID.'
                })
            }
        }
        
        createProduct = async (request, responses, next)=>{                
            try {                               
                const productNew  = request.body

                let owner = 'ADMIN'

                if (request.user && request.user.role === 'USER_PREMIUM') {
                    owner = request.user.email
                }

                productNew.owner = owner

                //si alguno de los campos no viene se va a instanciar el error
                if (!productNew.title || !productNew.price || !productNew.stock) {
                    CustomError.createError({
                        name: 'Error en la creación de producto',
                        cause: generateProductErrorInfo(productNew),
                        message: 'Error al intentar crear el producto',
                        code: EErrors.PRODUCT_CREATION_ERROR
                    })
                }

                const result = await this.productService.createProduct (productNew)
        
                responses.send({
                    status: 'success',
                    result
                })
            } catch (error) {
                next(error)  
            }
        }
        
        updateProduct = async (req, res) => {
            try {
                const { pid } = req.params
                const productToUpdate = req.body
        
                if (req.user && req.user.role === 'ADMIN') {    //verificar si usuario es ADMIN
                    const product = await this.productService.updateProduct(pid, productToUpdate);
                    return res.status(200).json({
                        status: 'success',
                        message: product
                    });
                }
        
                const product = await this.productService.getProduct(pid) 
                if (product && req.user && req.user.role === 'USER_PREMIUM' && product.owner === req.user.email) {  //verificar si usuario es USER_PREMIUM
                    await this.productService.updateProduct(pid, productToUpdate);
                    return res.status(200).json({
                        status: 'success',
                        message: product
                    })
                }
        
                return res.status(403).json({
                    status: 'error',
                    message: 'No tienes permisos para modificar este producto.'
                })

            } catch (error) {
                console.log(error);
                res.status(500).json({
                    status: 'error',
                    message: 'Error al actualizar el producto.'
                })
            }
        }


        deleteProduct = async (req, res) => {
            try {
                const { pid } = req.params

                if (req.user && req.user.role === 'ADMIN') {    //verificar si usuario es ADMIN
                    const result = await this.productService.deleteProduct(pid)
                    if (!result) {
                        return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
                    }
                    return res.json({ success: true, message: 'Producto eliminado correctamente.' })
                }
        
                const product = await this.productService.getProduct(pid)
                if (product && req.user && req.user.role === 'USER_PREMIUM' && product.owner === req.user.email) {  //verificar si usuario es USER_PREMIUM
                    const result = await this.productService.deleteProduct(pid)
                    if (!result) {
                        return res.status(404).json({ success: false, message: 'Producto no encontrado.' })
                    }
                    return res.json({ success: true, message: 'Producto eliminado correctamente.' })
                }
        
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para eliminar este producto.'
                })

            } catch (error) {
                console.log(error);
                res.status(500).json({ 
                    success: false, 
                    message: 'Error al eliminar el producto.' 
                })
            }
        }
        
    }


    module.exports = ProductController