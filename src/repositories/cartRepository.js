const UserController = require("../controllers/users.controller");

const {getUser} = new UserController()

class CartRepository {
    constructor(cartDao){
        this.dao = cartDao;
    }

    
    getCarts = async () => await this.dao.get({ isActive: true });
    getCart = async (filter) => await this.dao.get(filter);
    createCart = async (newCart) => {
        newCart.isActive = true;
        return await this.dao.create(newCart);
        }
    updateCart = async (cartId, cartToUpdate) => await this.dao.update(cartId, cartToUpdate);
    deleteCart = async (cartId) => await this.dao.update(cartId, { isActive: false });
    addProductToCart = async (cartId, userId, productId, quantity) => {
        const updatedCart = await this.dao.addProductToCart(cartId, productId, quantity);
        return updatedCart;
    }

}

module.exports = CartRepository;