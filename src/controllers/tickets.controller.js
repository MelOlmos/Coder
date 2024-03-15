const { ticketService } = require('../repositories');

class TicketController {
    constructor(){
        this.service = ticketService;
    }

    createTicket = async (req, res) => {
        try {
            const newTicketData = req.body;
            const createdTicket = await ticketService.createTicket(newTicketData);
            res.json(createdTicket.toObject());
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = TicketController;