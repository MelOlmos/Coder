const { messagesModel } = require('./models/messages.model');

class MessagesManagerDB {
   async getAllmessages() {
    try {
      const messages = await messagesModel.find();
      return messages;
    } catch (error) {
      console.log(`Se produjo un error: ${error.message}`);
    }
  };

  async addMessage(user, message) {
    try {
      const newMessage = await messagesModel.create({ user, message });
      return newMessage;
    } catch (error) {
      console.log(`Se produjo un error al agregar el mensaje: ${error.message}`);
    }
  }
}

module.exports = { MessagesManagerDB }