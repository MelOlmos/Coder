const express = require('express');

const router = express.Router();

const { ProductManager } = require('../src/Productmanager.js');
const productManager = new ProductManager('productos_test.json');


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

module.exports = router;