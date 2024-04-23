const mongoose = require('mongoose')

const ticketCollection = 'tickets'


const ticketsSchema = new mongoose.Schema({   
    code: {
        type: String,
        unique: true,
        required: true,
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: String,

    purchasedProducts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' }]
}) 


const ticketModel = mongoose.model (ticketCollection, ticketsSchema) 

module.exports = { ticketModel }