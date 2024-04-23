const { EErrors } = require('../../utils/errors/enums.js')

handleErrors = (error, req, res, next) => {
    console.log(error)

    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:    
            return res.send({status: 'error', error: error.name, cause: error.cause})          
            break;
        case EErrors.PRODUCT_CREATION_ERROR: 
            return res.send({ status: 'error', error: error.name, cause: error.cause })
            break;
        case EErrors.CART_NOT_FOUND_ERROR: 
            return res.send({ status: 'error', error: error.name, cause: error.cause })
            break;
        case EErrors.PRODUCT_NOT_FOUND_ERROR: 
            return res.send({ status: 'error', error: error.name, cause: error.cause })
            break;

        default:    
            return res.send({status: 'error', error: 'Error de servidor'})
            break;
    }
}

module.exports = { handleErrors }