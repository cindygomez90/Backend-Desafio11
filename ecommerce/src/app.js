//importación de módulos
const express = require ("express")
const handlebars  = require('express-handlebars')
const { Server }  = require('socket.io') 
const ProductManagerMongo = require('./daos/Mongo/productsDaoMongo.js')
const productManager = new ProductManagerMongo()
const router = require ("./routers/index.js")
const messageModel = require ('./daos/Mongo/messagesDaoMongo.js')
const cookieParser = require ('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./config/initializePassport.config.js')
const MongoStore = require ('connect-mongo')
const { configObject } = require ('./config/connectDB.js')
const { handleErrors } = require ('./middleware/errors-midd/index.js')
const { addLogger } = require("./utils/logger.js")

const app = express()
const PORT = configObject.port


//configuración de handlebars
app.engine("handlebars", handlebars.engine(
    ({runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true}
        })))
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")  

//para servir los archivos estáticos
app.use(express.static(__dirname + '/public'))
app.use(express.json())   
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())

app.use(addLogger)
app.use (router)
app.use(handleErrors)

//configuración socket del lado del server
const httpServer = app.listen(PORT, () => {
    console.log('Entrega: Documentar API')
} )

const io = new Server (httpServer)

let messages = []

io.on('connection', async (socket) => {
    console.log('cliente conectado')

//Mongo
    socket.on("addProduct", async (data) => {
        const newProduct = {
            title: data.title,
            description: data.description,
            price: data.price,
            thumbnail: data.thumbnail,
            code: data.code,
            stock: data.stock,            
        }
        try {
            await productManager.createProduct(newProduct)

            const updatedProducts = await productManager.getProducts()
            io.emit("updateProducts", updatedProducts)
        } catch (error) {
            console.error("Error al agregar producto:", error);
            socket.emit("productError", { error: "Error al agregar producto" })
        }
    })
        
    socket.on("deleteProduct", async (data) => {
        const pid = data.pid

        try {
            await productManager.deleteProduct(pid)

            const updatedProducts = await productManager.getProducts()
            io.emit("updateProducts", updatedProducts)
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            socket.emit("productError", { error: "Error al eliminar producto" })
        }
    })



    socket.on('message', async (data) => {
        try {
            const newMessage = {
                user: data.user,
                message: data.message
            }
    
            await messageModel.create(newMessage)    //probar reemplazando por esto: await messageManager.saveMessage(newMessage.user, newMessage.message)
    
            io.emit('chat', [newMessage])
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    })
})


