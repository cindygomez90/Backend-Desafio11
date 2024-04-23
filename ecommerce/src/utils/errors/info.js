const generateUserErrorInfo = (user) => {
    return `One or more properties where incomplete or not valid.
    List of require properties: 
        * first_name: nedds to be a String, recived ${user.first_name}
        * last_name: nedds to be a String, recived ${user.last_name}
        * email: nedds to be a String, recived ${user.email}   
    `
}

const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties: 
        * name: needs to be a String, received ${product.title}
        * price: needs to be a Number, received ${product.price}
        * description: needs to be a String, received ${product.stock}   
    `
}

const generateCartNotFoundErrorInfo = (cartId) => {
    return `Carrito no encontrado con ID: ${cartId}. No se puede agregar productos al carrito.`
}

const generateProductNotFoundErrorInfo = (productId) => {
    return `Producto no encontrado con ID: ${productId}. No se puede agregar productos al carrito.`
}


module.exports = { generateUserErrorInfo, generateProductErrorInfo, generateProductNotFoundErrorInfo, generateCartNotFoundErrorInfo }