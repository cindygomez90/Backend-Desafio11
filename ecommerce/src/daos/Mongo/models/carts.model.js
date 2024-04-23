    const mongoose = require('mongoose')

    const cartsCollection = 'carts'


    const cartsSchema = new mongoose.Schema({
        products: {
            type: [{
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: Number
            }]
        }
    })

    cartsSchema.pre('findOne', function () {
        this.populate('products.product')
    })

    const cartModel = mongoose.model(cartsCollection, cartsSchema) 

    module.exports = { cartModel }