const express = require('express');
const { logger } = require('../utils/logger.js');
const { cartService, ticketService, productService } = require('../repositories/index.js');
const { cartsModel } = require('../dao/mongo/models/carts.model.js');
const CartManagerDB = require('../dao/mongo/cartDaoDB.js');


class CartController {
    constructor() {
        this.cartManager = cartService
    }


    addProductToCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const { products } = req.body;

            if (products && Array.isArray(products) && products.length > 0) {
                for (const product of products) {
                    const { productId, quantity } = product;

                    // Llama al service para agregar cada producto al carrito
                    await cartService.addProductToCart(cartId, { productId, quantity });
                }

                // Obtener el carrito actualizado después de agregar todos los productos
                const updatedCart = await cartService.getCart(cartId);
                res.json(updatedCart);
            } else {
                res.status(400).json({ error: 'Incorrect request format' });
            }
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

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const updatedCartData = req.body;
            const updatedCart = await cartService.updateCart(cartId, updatedCartData);
            res.json(updatedCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    updateAllProducts = async (req, res) => {
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


    /*Para finalizar compra*/
    purchaseCart = async (req, res) => {
        try {
            const cartId = req.params.cartId;
            const cart = await cartService.getCart(cartId); //busco por id de carrito
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado :C' });
            }

            const userEmail = req.session.user.email;
            const purchase = await cartService.purchaseCart(cartId, userEmail)

            const createdTicket = await ticketService.createTicket(ticketData);

            res.json({ products, productsNotPurchased, createdTicket });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    /*Para borrar un solo item del cart*/
    deleteProductFromCart = async (req, res) => {
        try {
            const { cartId, pid } = req.params
            const resp = await cartService.deleteProductFromCart(cartId, pid)
            res.status(200).json({
                status: 'success',
                message: 'Product deleted from cart'
            })
        } catch (error) {
            logger.debug(error)
        }
    }
}


module.exports = CartController