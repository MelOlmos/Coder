// Archivo de rutas para messages con mongoDB
const express = require('express');
const router = express.Router();
const { MessagesManagerDB } = require('../src/dao/messageManagerDB.js');

const messagesManager = new MessagesManagerDB();

/* Obtengo todos los mensajes */
router.get('/chat', async (req, res) => {
  try {
    const messages = await messagesManager.getAllmessages();
    res.json({ messages });
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;