//importación de módulos
const { Router } = require ("express")
const viewsRouter = Router()
const CartsDaoMongo = require ('../daos/Mongo/cartsDaoMongo.js')
const cartService = new CartsDaoMongo ()
const ProductDaoMongo = require ('../daos/Mongo/productsDaoMongo.js')
const productService = new ProductDaoMongo ()
const MessageDaoMongo = require ('../daos/Mongo/messagesDaoMongo.js')
const messageService = new MessageDaoMongo ()
const { productModel} = require ('../daos/Mongo/models/products.model.js')
const { cartModel} = require ('../daos/Mongo/models/carts.model.js')

//vista para home
viewsRouter.get('/home', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('home', { products })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener la lista de productos.' })
    }
})


//vista para realTimeProducts
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('realTimeProducts', { products })
        
    } catch (error) {
        console.log(error)
        res.render('error', { message: 'Error al intentar obtener la lista de productos.' })
    }
})

viewsRouter.post('/', async (req, res) => {
    try {
        const products = await productService.get()
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.log(error);
        res.render ("Error al intentar obtener la lista de productos");
        return
    }
})

//vista para chat
viewsRouter.get('/chat', async (req, res) => {
    try {
        const messages = await messageService.getMessages()   
        res.render('chat', { messages })        
    } catch (error) {
        console.error('Error al obtener los mensajes:', error);
        res.render('error', { message: 'Error al intentar obtener los mensajes.' });
    }   
})

viewsRouter.post('/api/messages/sendMessage', async (req, res) => {
    try {
        res.redirect('/chat')
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.render('error', { message: 'Error al intentar enviar el mensaje.' });
    }
})

//vista para products
viewsRouter.get('/products', async (req, res) => {    
    const {limit = 10, pageQuery = 1, category, order, status} = req.query   
    
    const filter = {}
        if (category) {
            filter.category = category;
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
    totalPages
    } = await productModel.paginate(filter, {limit, page: pageQuery, sort: sortOptions, lean: true})
    res.render('products', {
        products: docs,
        totalPages: totalPages,
        hasPrevPage, 
        hasNextPage,
        prevPage, 
        nextPage,
        page 
    })
})

//vista para cart
viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await cartModel.findOne({_id:cid})        
        res.render('cart', { cart })
    } catch (error) {
        console.error(error)
        res.render('error', { message: 'Error al obtener detalle del carrito.' })
    }
})

//vista para login
viewsRouter.get ('/login', (req, res) => {
    res.render ('login')
})

//vista para register
viewsRouter.get ('/register', (req, res) => {
    res.render ('register')
})

//vista para formulario de recuperación de contraseña
viewsRouter.get('/forgot-password', (req, res) => {
    res.render('forgotPassword')
})

//vista para formulario para crear una nueva contraseña
viewsRouter.get('/reset-password', (req, res) => {
    const token = req.query.token
    res.render('resetPassword', { token })
})


module.exports = viewsRouter