const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productsCollection = 'products'


const productsSchema = new mongoose.Schema({   
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    category: String,
    status: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String,
        default: 'ADMIN'
    }
}) 

productsSchema.plugin(mongoosePaginate) 
const productModel = mongoose.model (productsCollection, productsSchema) 

module.exports = { productModel }

