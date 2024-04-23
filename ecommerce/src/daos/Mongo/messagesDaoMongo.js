const messageModel = require ('../Mongo/models/messages.model.js')

class MessageDaoMongo {

    async getMessages() {
        try {
            const messages = await messageModel.find({})
            return messages
        } catch (error) {
            console.error('Error al obtener los mensajes:', error)
            throw error
        }
    }    
    
    async saveMessage(user, message) {
        try {
            const result = await messageModel.create({ user, message })
            return result
        } catch (error) {
            console.error('Error al intentar guardar el mensaje:', error)
            throw error
        }
    }
}


module.exports = MessageDaoMongo


