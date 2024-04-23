const { userModel }  = require ('../Mongo/models/users.model.js')

class UserDaoMongo {
    async getPaginate(limit = 10, page = 1) {
        return await userModel.paginate({}, {limit, page, lean:true})
    }
        
    async get () {
        return await userModel.find ({})
    }

    async getBy (filter) {
        return await userModel.findOne (filter)
    }

    async create (newUser) {
        return await userModel.create (newUser)
    }

    async update (uid, userUpdate) {
        return await userModel.findOneAndUpdate({_id: uid}, userUpdate, {new: true})
    }

    async delete (uid) {
        return await userModel.findByIdAndDelete (uid)
    }
}

module.exports = UserDaoMongo
