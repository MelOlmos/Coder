const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = __dirname+'/'+filePath;
        this.initialId = 0;
        this.products = [];
        this.loadProductsFromFile();
    }

    /* newId = () => {
        this.initialId++;
        return this.initialId;
    } */

    isCodeUnique = (code) => {
        return !this.products.some(product => product.code === code);
    }

    addProduct = ({ title, description, price, thumbnail, code, stock, category }) => {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.log('No fue posible agregar producto. Todos las claves son obligatorias');
        } else if (this.isCodeUnique(code)) {
            const id = this.products.length + 1;
            const status = true;
            this.products.push({ id, title, description, price, thumbnail, code, stock, category, status });
            this.saveProductsToFile();
        } else {
            console.log('No está permitido repetir CODE al agregar productos');
        }
    }

    loadProductsFromFile = () => {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data) || []; 
            // this.updateInitialId();
        } catch (error) {
            this.products = [];
        }
    }

    /* updateInitialId = () => {
        const maxId = Math.max(...this.products.map(product => product.id), 0);
        this.initialId = maxId;
    } */

    saveProductsToFile = () => {
        console.log('Guardando productos en el archivo...');
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    getProducts = () => {
        this.loadProductsFromFile();
        return this.products;
    }

    getProductById = (id) => {
        let foundProduct = this.products.find(product => product.id === id);
        if (foundProduct) {
            console.log(`el id ingresado coincide con este producto (${foundProduct.title}) `);
        } else {
            console.log('ID Not found');
        }
        return foundProduct;
    }

    updateProduct = (id, updatedProduct) => {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { id, ...updatedProduct };
            this.saveProductsToFile();
        }
    }

    deleteProduct = (id) => {
        this.products = this.products.filter(product => product.id !== id);
        this.saveProductsToFile();
    }
}

updateProductStatus = () => {
    // Actualiza el estado (status) de todos los productos en el archivo.
    this.products.forEach(product => {
        if (!product.hasOwnProperty('status')) {
            product.status = true; 
        }
    });
    this.saveProductsToFile();
}

module.exports = { ProductManager };


/*HACIENDO LAS PRUEBAS DEL PROCESO DE TESTING*/



// console.log('Prueba del array vacío:', productManager.getProducts());

// Agrego el producto
/* productManager.addProduct({
    title: 'producto 1',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc1',
    stock: 25,
    category: 'Pantalones'
});
productManager.addProduct({
    title: 'producto 2',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc2',
    stock: 25,
    category: 'Vestidos'
});
productManager.addProduct({
    title: 'producto 3',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc3',
    stock: 25,
    category: 'Vestidos'
});
productManager.addProduct({
    title: 'producto 4',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc4',
    stock: 25,
    category: 'Pantalones'
});
productManager.addProduct({
    title: 'producto 5',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc5',
    stock: 25,
    category: 'Remeras'
});
productManager.addProduct({
    title: 'producto 6',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc6',
    stock: 25,
    category: 'Remeras'
});
productManager.addProduct({
    title: 'producto 7',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc7',
    stock: 25,
    category: 'Remeras'
});
productManager.addProduct({
    title: 'producto 8',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc8',
    stock: 25,
    category: 'Pantalones'
});
productManager.addProduct({
    title: 'producto 9',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc9',
    stock: 25,
    category: 'Vestidos'
});
productManager.addProduct({
    title: 'producto 10',
    description: 'Este es un producto prueba',
    price: 200,
    thumbnail: 'Sin imagen',
    code: 'abc10',
    stock: 25,
    category: 'Remeras'
}); */


// console.log('Prueba llamando productos:', productManager.getProducts());

 
// const productId = 1; 
// console.log('Prueba del ID:', productManager.getProductById(productId));

/* Actualizando un producto*/
// productManager.updateProduct(9, {
//     title: 'producto 9',
//     description: 'Este es un producto prueba',
//     price: 200,
//     thumbnail: 'Sin imagen',
//     code: 'abc9',
//     stock: 25,
//     category: 'Vestidos'
// });


// /* Eliminando*/
/* productManager.deleteProduct(10);
console.log('Prueba de eliminación:', productManager.getProducts()); 
 */
