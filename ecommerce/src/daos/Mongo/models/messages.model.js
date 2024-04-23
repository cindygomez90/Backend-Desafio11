const mongoose = require('mongoose')

const messagesCollection = 'messages'


const messagesSchema = new mongoose.Schema({
    user: {            
        type: String,
        required: true, 
        unique: true              
    }, 
    message: {
        type: String,
        required: true
    }
}) 

const messageModel = mongoose.model(messagesCollection, messagesSchema) 

module.exports = messageModel 
