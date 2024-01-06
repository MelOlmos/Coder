const express = require('express');
const app = express();
const productsRouter = require("../Routes/productsRoutes.js");
const cartRouter = require("../Routes/cartRoutes.js");
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'productos_test.json');


const handlebars = require('express-handlebars');
const viewsRouter = require('../Routes/views.router.js');
const { Server } = require('socket.io');

const { ProductManager } = require('./Productmanager.js');
const productManager = new ProductManager('productos_test.json');

const PORT = 8080;
const httpServer = app.listen(PORT,()=>console.log("Escuchando puerto 8080"));


app.use(express.urlencoded({extended:true}));
app.use(express.json());

const cors = require('cors');
app.use(cors());


const io = new Server(httpServer);
/* 
let productList = JSON.parse(fs.readFileSync(filePath)); */
let productList = [];

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