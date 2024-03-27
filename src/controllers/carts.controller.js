const express = require('express');
const { cartService } = require('../repositories/index.js');
const { productService } = require('../repositories/index.js')
const { ticketService } = require('../repositories/index.js')


class CartController {
    constructor(){
        this.cartManager = cartService
    }


    addProductToCart = async (req, res) => {
        try {    
            const cartId = req.params.cartId;
            const { productId, quantity } = req.body;
            req.logger.debug(req.body);
    
            // Llama al service para agregar el producto al carrito
            const updatedCart = await cartService.addProductToCart(cartId, { productId, quantity });
    
            // carrito actualizado
            res.json(updatedCart);
        } catch (error) {
            req.logger.error(error.message)
            res.status(500).json({ error: error.message });
        }
    } 

    getAllCarts = async (req, res) => {
        try {
            const carts = await cartService.getCarts();
            res.json({ carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getCartById = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const cart = await cartService.getCart(cartId);
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
                return;
            }
            res.json({ cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    addCart = async (req, res) => {
        try {
            // Verifica si el usuario está autenticado y la sesión 
            if (!req.session || !req.session.user || !req.session.user._id) {
              return res.status(401).json({ error: 'Usuario no autenticado' });
            }
        
            // Obtiene el ID del usuario de la sesión
            const userId = req.session.user._id;
        
            // Crea el objeto de nuevo carrito
            const newCart = { user: userId, ...req.body };
            const createdCart = await cartService.addCart(newCart);
        
            res.status(201).json(createdCart);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        };

    updateCart = async (req, res) =>  {
        try {
            const cartId = req.params.cartId;
            const updatedCartData = req.body;
            const updatedCart = await cartService.updateCart(cartId, updatedCartData);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    updateAllProducts = async (req, res) =>  {
        try {
            const cartId = req.params.cartId;
            const productsNotPurchased = req.body;
            const updatedCart = await cartService.updateAllProducts(cartId, productsNotPurchased);
            
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            await cartService.deleteCart(cartId);
            res.json({ message: 'Carrito eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    deleteAllProductsFromCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const updatedCart = await cartService.deleteAllProductsFromCart(cartId);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }    
    }  

    updateProductQuantity = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const productId = req.params.productId;
            const quantity = req.body.quantity;
            const updatedCart = await cartService.updateProductQuantity(cartId, productId, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }    
    }    


    /*Para el ticket de compra*/
    purchaseCart = async (req, res) =>  {
        try {
            const cartId = req.params.cartId;
            const cart = await cartService.getCart(cartId); //busco por id de carrito

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado :C' });
            }    
                
            const products = cart.products.filter(product => product.product && product.product.stock > 0);            
            const productsNotPurchased = cart.products.filter(product => product.product && product.product.stock === 0).map(product => product.product._id.toString());
            const productQuantities = {};
            // registro las cantidades de cada producto
            for (const product of products) {

                const id = product.product._id;
                const quantity = product.quantity
    
                if (productQuantities[id]) {
                    productQuantities[id] += quantity;
                } else {
                    productQuantities[id] = quantity;
                }

            }
            // resto esas cantidades al stock de cada producto
            const productsToUpdate = [];
            for (const product of products) {
                
                const productDetails = product.product;
                
                const productId = product.product._id;

                const newStock = productDetails.stock - productQuantities[productId];
                productsToUpdate.push({ productId, newStock });

            }
            //amount del carrito
            const totalAmount = await cartService.calculateCartAmount(cartId);
            // ticket
            const ticketData = {
                code: ticketCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.session.user.email,
                products: products
            };
    
            const createdTicket = await ticketService.createTicket(ticketData);

            // Antes de la llamada a updateCart
            console.log('Cart ID:', cartId);
            console.log('Products not purchased:', productsNotPurchased);

            if (productsNotPurchased.length === 0) {
                await cartService.deleteAllProductsFromCart(cartId);
            } else {
                await cartService.updateAllProducts(cartId, { products: productsNotPurchased });
            }
    
            await Promise.all(productsToUpdate.map(({ productId, newStock }) =>
                productService.updateProduct(productId, { stock: newStock })
            ));

            res.json({
                purchase: {
                    comprados: products,
                    ticket: createdTicket,
                    'no-comprados': productsNotPurchased
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /*Para borrar un solo item del cart*/
    deleteProductFromCart  = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const resp = await cartService.deleteProductFromCart(cid, pid)
            res.status(200).json({
                status: 'success',
                message: 'Product deleted from cart'
            })        
        } catch (error) {
            console.log(error)
        }
    }


    /* Para calcular monto total del carrito*/
    async calculateCartAmount(req, res) {
        try {
            const cartId = req.params.cartId;
            const totalAmount = await this.cartService.calculateCartAmount(cartId);
            res.json({ totalAmount });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    }


function ticketCode() {
    // Genero un código aleatorio con números y letras
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        //obtiene el caracter en la posición randomIndex y lo suma al final
        code += characters.charAt(randomIndex);
    }

    return code;
}


module.exports = CartController