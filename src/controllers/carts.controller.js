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
            // Verificar si el usuario tiene el rol adecuado 
            console.log(req.session.user.role)
            if (req.session.user.role === 'admin') {
                return res.status(403).json({ error: 'No tenés permiso para agregar productos al carrito.' })
            }
    
            const cartId = req.params.cartId;
            const { productId, quantity } = req.body;
            console.log(req.body) 
    
            // Llama al service para agregar el producto al carrito
            const updatedCart = await cartService.addProductToCart(cartId, { productId, quantity });
    
            // carrito actualizado
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getAllCarts = async (req, res) => {
        try {
            const carts = await cartService.getAllCarts();
            res.json({ carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    getCartById = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const cart = await cartService.getCartById(cartId);
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
            const newCart = req.body;
            const createdCart = await cartService.addCart(newCart);
            res.json(createdCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

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

            const products = cart[0].products;
            console.log(cart)
            const productsNotPurchased = [];

            //verifica si hay stock en los productos del cart
            for (const product of products) {
                const { id, quantity } = product;
                const productDetails = await productService.getProduct({_id:id});

                if (!productDetails || productDetails.stock < quantity) {
                    productsNotPurchased.push(id);
                    continue;
                }

                // Resta la cantidad comprada del stock del product
                const newStock = productDetails.stock - quantity;
                await productService.updateProduct(id, { stock: newStock });
            }
            
            // Crea el ticket
            const ticketData = {
                code: ticketCode(),
                purchase_datetime: new Date(),
                amount: cart[0].amount,
                purchaser: req.session.user.email, 
                products: cart.products
            };

            const createdTicket = await ticketService.createTicket(ticketData);

            // Actualiza el carrito 
            /* await cartService.updateCart(cartId, { products: productsNotPurchased }); */

            // Devuelve el ticket
            res.json(createdTicket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /*Para traer los productos de un solo carrito*/ 
    getProductsInCart = async (req, res) => {
        try {
          const cartId = req.params.cartId;
          const cart = await this.cartService.getCart(cartId);
    
          if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
          }
    
          const products = cart.products;
          res.json({ products });
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