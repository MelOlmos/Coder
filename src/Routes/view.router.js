const express = require('express');
const router = express.Router();
const passport = require('passport')
const {authorization} = require('../middleware/authentication.js')

/* Líneas con FS */

const { ProductManager } = require('../dao/file/productDaoFile.js');
const productManager = new ProductManager('productos_test.json');

/* Líneas con MongoDB */

const { messagesModel } = require('../dao/mongo/models/messages.model.js');
const { productsModel } = require('../dao/mongo/models/products.model.js');
const CartManagerDB = require('../dao/mongo/cartDaoDB.js');
const { productService } = require('../repositories/index.js');
const ProductManagerDB = require('../dao/mongo/productDaoDB.js');
const cartManagerDB = new CartManagerDB();
const productManagerDB = new ProductManagerDB();

// const {first_name, role} = require('../config/passport.config.js')


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
router.get('/chat', passport.authenticate('jwt', { session: false }), authorization(['user']), 
(req, res) => {
    const messages = messagesModel.find();
    res.render('chat', { messages });
}); 

//Vista de productos 
router.get('/products', async (req, res) => {
    try {  
    // Parámetros de filtros 
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
        return res.status(404).json({ error: 'No se encontraron productos' });
    }
    

    res.render('products', {
        products: result.docs,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        role: req.session.user.role,
        first_name: req.session.user.first_name,
        cartId: req.session.user.cartID
        
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

//Vista de producto solo 
router.get('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManagerDB.getBy({_id: productId});
        

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.render('oneProduct', {
            product: product._doc,
            role: req.session.user.role,
            first_name: req.session.user.first_name,
            cartId: req.session.user.cartID
            
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Vista de form olvidé mi contraseña
router.get('/forgot-password', (req, res) => {
    res.render('forgotPassword')
})

//Vista de form para cambiar la clave
router.get('/new-password', (req, res) => {
    res.render('newPassword')
})

//Vista de contraseña cambiada
router.post('/password-changed', (req,res) => {
    res.render('passwordChanged')
})

module.exports = router;