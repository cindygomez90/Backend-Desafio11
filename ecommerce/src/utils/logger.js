const winston = require('winston')
const { program } = require ('../utils/commander.js')
const { mode } = program.opts()

const levelOptions = {
    levels: {
        fatal: 0,
        error:1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {           
        fatal: 'red',
        error: 'black',
        warning: 'yellow',
        info: 'green',
        http: 'blue',
        debug: 'white'
    }
}

// Logger para desarrollo
const developmentLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

// Logger para producción
const productionLogger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const addLogger = (req, res, next) => {
    const logger = mode === 'development' ? developmentLogger : productionLogger
    req.logger = logger
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
} 



module.exports = { addLogger }