
class TicketRepository {
    constructor (ticketDao) {
        this.dao = ticketDao
    }

    createTicket  = async (ticketData) => await this.dao.create(ticketData)

}


module.exports = TicketRepository