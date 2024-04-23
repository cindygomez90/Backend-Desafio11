const { ticketModel } = require('../Mongo/models/tickets.model.js')

class TicketDaoMongo {

    async create (ticketData) {
        return await ticketModel.create( ticketData )
    }

}

module.exports = TicketDaoMongo