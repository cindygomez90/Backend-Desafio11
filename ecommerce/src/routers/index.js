const { Router } = require ("express")
const viewsRouter = require ("./views.router.js")
const productsRouter = require ("./products.router.js")
const cartsRouter = require ("./carts.router.js")
const messagesRouter = require ("./messages.router.js")
const sessionsRouter = require("./sessions.router.js")
const usersRouter = require("./users.router.js")
const mensajeriaRouter = require("./mensajeria.router.js")
const pruebasRouter = require("./pruebas.router.js")
const specs = require('../utils/swaggerConfig.js')
const swaggerUiExpress = require('swagger-ui-express')


const router = Router()

//importación de las rutas
router.use('/api/products', productsRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/messages', messagesRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api/users', usersRouter)
router.use('/api/mensajeria', mensajeriaRouter)
router.use('/api/pruebas', pruebasRouter)
router.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))
router.use('/', viewsRouter)

router.get('*', (req, res)=>{
    res.render ('errorpagina')   
})

module.exports = router