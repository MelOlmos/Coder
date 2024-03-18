class CartRepository {
    constructor(cartDao){
        this.dao = cartDao;
    }

    
    getCarts = async () => await this.dao.get({ isActive: true });
    getCart = async (filter) => await this.dao.get(filter);
    createCart = async (username) => await this.dao.create(username);
    updateCart = async (cartId, cartToUpdate) => await this.dao.update(cartId, cartToUpdate);
    deleteCart = async (cartId) => await this.dao.update(cartId, { isActive: false });
    addProductToCart = async (cartId, productId, quantity) => {
        const updatedCart = await this.dao.addProductToCart(cartId, productId, quantity);
        return updatedCart
    }
    deleteProductFromCart = async (cid, pid)=> await this.dao.deleteItem(cid, pid)
    calculateCartAmount = async (cartId) => await this.dao.calculateCartAmount(cartId)

}

module.exports = CartRepository;