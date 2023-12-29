const express = require('express');
const app = express();
const productsRouter = require("../Routes/productsRoutes.js");
const cartRouter = require("../Routes/cartRoutes.js");

app.listen(8080, () => console.log("Soy el puerto 8080"));

app.get('/', (req, res) => {
    res.send("Soy el puerto 8080 :)")
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Rutas para productos
app.use('/api/products',productsRouter);
// Rutas para carritos
app.use('/api/carts',cartRouter);