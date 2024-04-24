const swaggerJsDocs = require('swagger-jsdoc')
const path = require('path')

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de app Wemí cueros',
            description: 'Descripción de nuestra app Wemí cueros'
        }
    },
    apis: [path.join(__dirname, '../docs/**/*.yaml')]   
} 
const specs = swaggerJsDocs(swaggerOptions)

module.exports = specs