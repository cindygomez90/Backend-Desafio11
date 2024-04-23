const mongoose = require('mongoose')

const usersCollection = 'users'

const usersSchema = new mongoose.Schema ({
    first_name: {
        type: String,
        index: true      
    },
    last_name: String,
    email: {
        type: String,
        required: false, //se coloca "false" para que funcione la estrategia de github
        unique: true
    },
    age: Number,
    password: {
        type: String,
        required: false //se coloca "false" para que funcione la estrategia de github
    },
    isActive: {
        type: Boolean,
        default: true
    },
    cartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum :['USER', 'USER_PREMIUM', 'ADMIN'],
        default: 'USER'
    }
})


const userModel = mongoose.model(usersCollection, usersSchema) 

module.exports = { userModel }