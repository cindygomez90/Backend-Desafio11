const jwt = require ('jsonwebtoken') 
const { configObject } = require ('../config/connectDB.js')


const { jwt_secret_Key } = configObject

const generateToken = user => {
    const token = jwt.sign(user, jwt_secret_Key, {
        expiresIn: '1d'
    });
    console.log('Token generado:', token);
    return token;
}



module.exports = { generateToken } 