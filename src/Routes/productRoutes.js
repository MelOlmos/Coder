const express = require('express');
const router = express.Router();
const { ProductManager } = require('../Productmanager.js');

const productManager = new ProductManager('productos_test.json');

const io = require('../app.js'); 


/*Acá obtengo productos*/
router.get('/', async (req, res) => {
        const products = await productManager.getProducts();
        let limit = req.query.limit;
        if (!limit) {
        res.json({ products })
        } else {
        let limitFilter= products.slice(0, limit);
        res.json({ products:limitFilter })
    }
    });


/*Acá obtengo por id*/
router.get('/:pid', async (req, res) => {
    const products = await productManager.getProducts();
    let id = req.params.pid;
    if (!id) {
    res.json({ products });
    return;
    }
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) {
        res.status(400).json({ error: 'Formato de id inválido' });
        return;
    }

    const idFilter = products.find(product => product.id === parsedId);

    if (!idFilter) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
    }

    res.json({ product: idFilter });
});

/* Agrego un nuevo producto */
router.post('/', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    
    io.emit('newProduct', { product: newProduct });

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

    io.emit('deleteProduct', { productId: id });

    res.json({ Resultado: 'Producto eliminado correctamente' });
});


module.exports = router;
