const express = require('express');
const app = express();
const { ProductManager } = require('./Productmanager.js');

const productManager = new ProductManager('productos_test.json');

app.listen(8080, () => console.log("Soy el puerto 8080"));

app.get('/', (req, res) => {
    res.send("Soy el puerto 8080 :)")
});

app.use(express.urlencoded({extended:true}));

app.get('/products', async (req, res) => {
    const products = await productManager.getProducts();
    let limit = req.query.limit;
    if (!limit) {
    res.json({ products })
    } else {
    let limitFilter= products.slice(0, limit);
    res.json({ products:limitFilter })
}
});


app.get('/products/:pid', async (req, res) => {
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