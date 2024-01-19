const express = require('express');
const router = express.Router();

/* Líneas con FS */

const { ProductManager } = require('../src/Productmanager.js');
const productManager = new ProductManager('productos_test.json');

/* Líneas con MongoDB */

const { MessagesManagerDB } = require('../src/dao/messageManagerDB.js');
const { messagesModel } = require('../src/dao/models/messages.model.js');
// const { ProductManagerDB } = require('../src/dao/productManagerDB.js');
// const productManagerDB = new ProductManagerDB();


router.get('/',(req,res)=>{
    res.render('index', {});
});


//Vista de home
router.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

//Vista de real time products
router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
}); 

//Vista del chat
router.get('/chat', (req, res) => {
    const messages = messagesModel.find();
    res.render('chat', { messages });
}); 

module.exports = router;