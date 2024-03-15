class TicketRepository {
    constructor(ticketDao){
        this.dao = ticketDao;
    }

    createTicket = async (newTicket) => await this.dao.create(newTicket);
}

module.exports = TicketRepository