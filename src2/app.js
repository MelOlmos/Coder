const express = require('express');
const app = express();
const { ProductManager } = require('./Productmanager.js');
const { CartManager } = require('./CartManager.js');

const productManager = new ProductManager('./Coder/src2/productos_test.json');
const cartManager = new CartManager('./Coder/src2/carrito_test.json');

app.listen(8080, () => console.log("Soy el puerto 8080"));

app.get('/', (req, res) => {
    res.send("Soy el puerto 8080 :)")
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());


// Rutas para productos

app.get('/api/products', async (req, res) => {
    const products = await productManager.getProducts();
    let limit = req.query.limit;
    if (!limit) {
    res.json({ products })
    } else {
    let limitFilter= products.slice(0, limit);
    res.json({ products:limitFilter })
}
});


app.get('/api/products/:pid', async (req, res) => {
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

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    productManager.addProduct(newProduct);
    res.json(newProduct);
});

app.put('/api/products/:pid', (req, res) => {
    const updatedProduct = req.body;
    let id = req.params.pid;
    let parsedId = parseInt(id);

    if (isNaN(parsedId)) {
        res.status(400).json({ error: 'Formato de id inválido' });
        return;
    }

    productManager.updateProduct(id, updatedProduct);
    res.json(updatedProduct);
});

app.delete('/api/products/:pid', (req, res) => {
    let id = req.params.pid;
    let parsedId = parseInt(id);

    if (isNaN(parsedId)) {
        res.status(400).json({ error: 'Formato de id inválido' });
        return;
    }

    productManager.deleteProduct(parsedId);
    res.json({ Resultado: 'Producto eliminado correctamente' });

});


// Rutas para carritos


app.post('/api/carts', (req, res) => {
    const newCart = cartManager.createCart();
    console.log(newCart);
    res.json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
    let cartId = req.params.cid;
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    let cartId = req.params.cid;
    let productId = req.params.pid;
    cartManager.addProductToCart(cartId, productId);
    res.json({ success: true });
});
