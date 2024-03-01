//// Archivo de rutas para products con mongoDB
const express = require('express');
const router = express.Router();
const { ProductManagerDB } = require('../dao/productManagerDB.js');

const productManager = new ProductManagerDB();

const io = require('../app.js'); 
const { productsModel } = require('../dao/models/products.model.js');


/*Acá obtengo productos*/
router.get('/', async (req, res) => {
    try {
        const products = await productsModel.paginate({}, {limit:10, page:1, lean: true})
        res.send({ products });
}   catch (error) {
    res.status(500).json({error: error.message});

}
    });


/*Acá obtengo por id*/
router.get('/:pid', async (req, res) => {
    try {
        let productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json({ product });
}   catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* Agrego un nuevo producto */
router.post('/', async (req, res) => {
    try {
        const newProductData = req.body;
        const createdProduct = await productManager.addProduct(newProductData);
    
        // io.emit('newProduct', { product: createdProduct });

        res.json(createdProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/* Actualizo por id */
router.put('/:pid', async (req, res) => { 
    try {
        const productId = req.params.pid;
        const updatedProductData = req.body;
        const updatedProduct = await productManager.updateProduct(productId, updatedProductData)
        res.json(updatedProduct);

}   catch (error) {
        res.status(500).json({ error: error.message });
    }
    
});


/* Elimino producto por id */
router.delete('/:pid', async (req, res) => {
    try {
        let productId = req.params.pid;
        await productManager.deleteProduct(productId);

        io.emit('deleteProduct', { productId });

        res.json({ Resultado: 'Producto eliminado correctamente' });
}   catch {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;