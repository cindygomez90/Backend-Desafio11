const { ticketService } = require ('../repositories/index.js')


class TicketController {

    constructor () {
        this.ticketService = ticketService
    }

    createTicket = async (req, res)=> {
        try {
            const result = await this.ticketService.createTicket()
    
            res.status(200).json ({
                status: "succes",
                payload: result
            })
        } catch (error) {            
            res.status(500).json ('Error al crear el ticket:', error)
            }
        }
}


module.exports = TicketController