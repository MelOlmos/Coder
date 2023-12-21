const express = require('express');
const router = express.Router();
const { ProductManager } = require('./Productmanager.js');

const productManager = new ProductManager('productos_test.json');

/*Acá obtengo productos*/
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json({ products });
});


/*Acá obtengo por id*/
router.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    if (product) {
        res.json({ product });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

/* Agrego un nuevo producto */
router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.json(newProduct);
});

/* Actualizo por id */
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    productManager.updateProduct(productId, updatedProduct);
    res.json(updatedProduct);
});

/* Elimino producto por id */
router.delete('/:pid', (req, res) => {
    let id = req.params.pid;
    productManager.deleteProduct(id);
    res.json({ Resultado: 'Producto eliminado correctamente' });
});


module.exports = router;
