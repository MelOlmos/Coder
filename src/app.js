const express = require('express');
const app = express();
const path = require('path');
const appRouter = require('./routes/index.js')
const {configObject} = require('./config/connectDB.js')
const { logger, addLogger } = require('./utils/logger.js')

/*Líneas que usan FS -FileSystem*/

const productsRouter = require("./routes/productRoutes.js"); 
const cartRouter = require("./routes/cartRoutes.js");
const fs = require('fs');
const viewsRouter = require('./routes/view.router.js');
const filePath = path.join(__dirname, 'productos_test.json');
const { ProductManager } = require('./dao/file/productDaoFile.js');
const productManager = new ProductManager('productos_test.json');

/*Reemplazando FS por MongoDB*/

const productsRouterDB = require("./routes/productRoutesDB.js"); 
const cartRouterDB = require("./routes/cartRoutesDB.js");
const messagesRouter = require('./routes/messageRoutesDB.js');
const  ProductManagerDB  = require('./dao/mongo/productDaoDB.js');
const productManagerDB = new ProductManagerDB();
const  CartManagerDB  = require('./dao/mongo/cartDaoDB.js');
const cartManagerDB = new CartManagerDB();
const { MessagesManagerDB } = require('./dao/mongo/messageDaoDB.js');
const messageManager = new MessagesManagerDB();

/*Cookie, session, store*/

const session = require('express-session')
const sessionRoutes = require('./routes/sessionRoutes.js')
const cookieParser = require('cookie-parser');
app.use(cookieParser('clavedecookie'));
const FileStore = require('session-file-store')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const {initializePassport} = require('./config/passport.config.js')

//Configura session con mongo
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://melolmos27:Bocajuniors12!@ecommerce.ss8x3tx.mongodb.net/',
    mongoOptions:{
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    ttl: 3000000
  }),
  secret: '123',
  resave: false,
  saveUninitialized:false
}))
//passport
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());



//Configura el middleware de sesión
/* const FileStore = FileStore(session)
app.use(session({
    secret: 'palabrasecreta',
    resave: true,
    saveUninitialized: true
  })); */


  
  /*Express y Socket*/

const { Server } = require('socket.io');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const cors = require('cors');
app.use(cors());


/*Middleware de logger*/

app.use(addLogger)


/* Rutas */

app.use(appRouter)  


/*Middleware de errores*/

const { handleErrors } = require('./middleware/errors/index.js')
app.use(handleErrors)


/*Puerto y DB*/

const { connectDB } = require('./config/connectDB.js')
const PORT = configObject.port;
const httpServer = app.listen(PORT,()=>logger.info(`Escuchando puerto: ${PORT}`));
connectDB();


/*Handlebars*/

const handlebars = require('express-handlebars');
app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');
app.use(express.static(__dirname+'/public'));



/*Debajo todas las interacciones con Socket*/

const io = new Server(httpServer);
let productList = [];
let messages = [];

io.on('connection', socket=> {
  logger.info(`Nuevo cliente conectado | ${new Date().toLocaleTimeString()}`)
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
        logger.info('Mensaje agregado a MongoDB correctamente');
      } catch (error) {
        logger.error(`Error al guardar mensaje en MongoDB: ${error.message}`);
      }
    })
});

/*Fin de interacciones socket*/

module.exports = httpServer;