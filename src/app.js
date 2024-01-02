const express = require('express');
const app = express();
const productsRouter = require("../Routes/productsRoutes.js");
const cartRouter = require("../Routes/cartRoutes.js");

const handlebars = require('express-handlebars');
const viewsRouter = require('../Routes/views.router.js');
const { Server } = require('socket.io');

const { ProductManager } = require('./Productmanager.js');
const productManager = new ProductManager('productos_test.json');


const PORT = 8080;
const httpServer = app.listen(PORT,()=>console.log("Escuchando puerto 8080"));


app.use(express.urlencoded({extended:true}));
app.use(express.json());


const io = new Server(httpServer);

io.on('connection', socket=> {
    console.log('Nuevo cliente conectado');
    //Escuchando newProduct
    socket.on('newProduct', data => {
        //Emitiendo updateList
        io.emit('updateList', data); 
    });
    //Escuchando deleteProducts
    socket.on('deleteProduct', data => {
        //Emitiendo updateList
        io.emit('updateList', data);
    });
});

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));




// Rutas para productos
app.use('/api/products',productsRouter);
// Rutas para carritos
app.use('/api/carts',cartRouter);
// Rutas para vistas
app.use('/', viewsRouter);


module.exports = io;