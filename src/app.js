const express = require('express');
const app = express();
const path = require('path');

/*Líneas que usan FS -FileSystem*/

const productsRouter = require("../Routes/productsRoutes.js"); 
const cartRouter = require("../Routes/cartRoutes.js");
const fs = require('fs');
const viewsRouter = require('../Routes/views.router.js');
const filePath = path.join(__dirname, 'productos_test.json');
const { ProductManager } = require('./Productmanager.js');
const productManager = new ProductManager('productos_test.json');

/*Reemplazando FS por MongoDB*/

const productsRouterDB = require("../Routes/productsRoutesDB.js"); 
const cartRouterDB = require("../Routes/cartRoutesDB.js");
const messagesRouter = require('../Routes/messagesRoutesDB.js');
const { ProductManagerDB } = require('./dao/productManagerDB.js');
const productManagerDB = new ProductManagerDB();
const { CartManagerDB } = require('./dao/cartManagerDB.js');
const cartManagerDB = new CartManagerDB();
const { MessagesManagerDB } = require('./dao/messageManagerDB.js');
const messageManager = new MessagesManagerDB();

/*Express, handlebars y DB */

const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const { connectDB } = require('./config/connectDB.js')
const PORT = 8080;
const httpServer = app.listen(PORT,()=>console.log("Escuchando puerto 8080"));
connectDB();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));

const io = new Server(httpServer);


/*Debajo todas las interacciones con Socket*/

let productList = [];
let messages = [];

io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    // Escuchando newProduct
    socket.on('newProduct', data => {
        let newProductId = productManager.addProduct(data);
        let newProduct = { ...data, id: newProductId };
        productList.push(newProduct);
        
        // Emitiendo updateList
        io.emit('updateList', productManager.getProducts());
        
    });
    // Escuchando deleteProducts
    socket.on('deleteProduct', productId => {
        const productList = productManager.getProducts();
        const filteredList = productList.filter(product => product.id != productId.id);
        productManager.deleteProduct(productId.id);
        // Emitiendo updateList
        io.emit('updateList', filteredList);
    });

    //Escuchando message del chat
    socket.on('message', async data => {
        messages.push(data)
    // Emitiendo messageLogs
    io.emit('messageLogs', messages);
    try {
        await messageManager.addMessage(data.user, data.message);
        console.log('Mensaje agregado a MongoDB correctamente');
      } catch (error) {
        console.log(`Error al guardar mensaje en MongoDB: ${error.message}`);
      }
    })
});

/*Fin de interacciones socket*/


/*RUTAS CON FS*/
/* // Rutas para productos 
app.use('/api/products',productsRouter);
// Rutas para carritos
app.use('/api/carts',cartRouter); */

// Rutas para vistas
app.use('/', viewsRouter);

/*RUTAS CON MONGODB*/
// Rutas para productos
app.use('/api/products-db', productsRouterDB);
// Rutas para carritos
app.use('/api/carts', cartRouterDB);
// Rutas para mensajes
app.use('/api/messages', messagesRouter);


module.exports = io;