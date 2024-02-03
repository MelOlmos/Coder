const express = require('express');
const router = express.Router();

/* Líneas con FS */

const { ProductManager } = require('../src/Productmanager.js');
const productManager = new ProductManager('productos_test.json');

/* Líneas con MongoDB */

const { MessagesManagerDB } = require('../src/dao/messageManagerDB.js');
const { messagesModel } = require('../src/dao/models/messages.model.js');
const { productsModel } = require('../src/dao/models/products.model.js');
const { CartManagerDB } = require('../src/dao/cartManagerDB.js');
const { usersModel } = require('../src/dao/models/users.model.js')
const cartManagerDB = new CartManagerDB();

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

//Vista de productos 
router.get('/products', async (req, res) => {
    try {
        const username = req.session.username;
        // Consulta la DB para obtener el nombre del usuario
        const user = await usersModel.findOne({ email: username });
        const firstName = user ? user.first_name : '';

    const {limit = 5, page = 1, sort, query} = req.query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true
    }
        if (sort) {
        options.sort = { price: sort === 'asc' ? 1 : -1 };
    }
    const filter = query ? { $text: { $search: query } } : {};

    const result = await productsModel.paginate(filter, options);

    if (!result) {
        console.log('No se obtuvieron productos de la base de datos');
        return res.status(404).json({ error: 'No se encontraron productos' });
    }

    const isAdmin = req.session.admin;
    const { first_name } = req.session.user;

    res.render('products', {
        products: result.docs,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        username,
        isAdmin,
        first_name
        
    });
}   catch (error) {
        console.error('Error en la consulta de productos: ', error);
        res.status(500).send('Error de servidor');
    }
});


// Vista del carrito
router.get('/carts/:cartId', async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await cartManagerDB.getCartById(cartId);
  
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }
      // Renderizo la vista del carrito específico
      res.render('cart', { cart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Vista de login
router.get('/login', (req, res) => {
    res.render('login')
});

//Vista del registro
router.get('/register', (req, res) => {
    res.render('register')
})

module.exports = router;