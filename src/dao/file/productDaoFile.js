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

    add = ({ title, description, price, thumbnail, code, stock, category }) => {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.log('No fue posible agregar producto. Todos las claves son obligatorias');
        } else if (this.isCodeUnique(code)) {
            const id = this.getNewId();
            
            const isActive = true;
            this.products.push({ id, title, description, price, thumbnail, code, stock, category, isActive });
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

    getNewId= () => {
        this.loadProductsFromFile();
        const maxId = Math.max(...this.products.map(product => product.id), 0);
        return maxId+1;
    }

    saveProductsToFile = () => {
        console.log('Guardando productos en el archivo...');
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    }

    get = () => {
        this.loadProductsFromFile();
        return this.products;
    }

    getBy = (id) => {
        let foundProduct = this.products.find(product => product.id === id);
        if (foundProduct) {
            console.log(`el id ingresado coincide con este producto (${foundProduct.title}) `);
        } else {
            console.log('ID Not found');
        }
        return foundProduct;
    }

    update = (id, updatedProduct) => {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { id, ...updatedProduct };
            this.saveProductsToFile();
        }
    }

    delete = (id) => {
        this.loadProductsFromFile();
        this.products = this.products.filter(product => product.id != id);
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