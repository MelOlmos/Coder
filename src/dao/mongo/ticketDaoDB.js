const {ticketsModel} = require('./models/tickets.model');

class TicketManagerDB {
  constructor(){
      this.model = ticketsModel; 
  }

  create = async (newTicket) => await this.model.create(newTicket) 

}

module.exports = TicketManagerDB