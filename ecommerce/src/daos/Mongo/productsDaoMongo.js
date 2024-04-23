const { productModel }  = require ('../Mongo/models/products.model.js')

class ProductDaoMongo {
    
    async get() {
        return await productModel.find({status: true})
    }

    async getBy (pid) {
        return await productModel.findOne ({ _id: pid })
    }

    async create (productNew) {
        return await productModel.create (productNew)
    }

    async update (pid, productToUpdate) {
        return await productModel.findOneAndUpdate({_id: pid}, productToUpdate, { new: true })
    }

    async delete (pid) {
        return await productModel.findByIdAndUpdate({_id: pid}, {status: false}, {new: true})
    }
}


module.exports = ProductDaoMongo