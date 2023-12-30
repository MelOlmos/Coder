const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    res.render('index', {});
});



/* // Vista home
router.get('/home', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
});

// Vista real time products
router.get('/realtimeproducts', (req, res) => {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
}); */

module.exports = router;