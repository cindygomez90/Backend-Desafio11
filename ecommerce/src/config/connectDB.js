const dotenv = require ('dotenv')
const { program } = require('../utils/commander')
const { mode } = program.opts() 
const MongoSingleton = require("../utils/mongoSingleton")



console.log('Modo:', mode)
console.log('Ruta del archivo .env:', mode === 'development' ? './.env.development' : './.env.production')

dotenv.config({ 
    path: mode === 'development' ? './.env.development' : './.env.production'   
})


const configObject = {        
    port: process.env.PORT || 8080, 
    jwt_secret_Key: process.env.JWT_SECRET_KEY,
    mongo_url: process.env.MONGO_URL,
    persistence: process.env.PERSISTENCE,
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    gmail_user: process.env.GMAIL_USER_APP,
    gmail_pass: process.env.GMAIL_PASS_APP,
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_number: process.env.TWILIO_NUMBER 
}

console.log ('Configuración de la base de datos:', configObject)

const connectBD = async () => {  
    try {
        await MongoSingleton.getInstance(configObject.mongo_url) 
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error)
    }
}

module.exports = { connectBD, configObject }