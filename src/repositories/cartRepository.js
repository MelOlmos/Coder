class CartRepository {
    constructor(cartDao){
        this.dao = cartDao;
    }

    
    getCarts = async () => await this.dao.get({ isActive: true });
    getCart = async (filter) => await this.dao.getBy(filter);
    createCart = async (username) => await this.dao.create(username);
    updateCart = async (cartId, updatedCartData) => await this.dao.update(cartId, updatedCartData);
    updateAllProducts = async (cartId, productsNotPurchasedIds) => await this.dao.updateAllProducts(cartId, productsNotPurchasedIds);
    deleteCart = async (cartId) => await this.dao.update(cartId, { isActive: false });
    addProductToCart = async (cartId, productId, quantity) => {
        const updatedCart = await this.dao.addProductToCart(cartId, productId, quantity);
        return updatedCart
    }
    deleteProductFromCart = async (cartId, pid)=> await this.dao.deleteItem(cartId, pid);
    calculateCartAmount = async (cartId) => await this.dao.calculateCartAmount(cartId);
    deleteAllProductsFromCart = async (cartId) => {
        const updatedCart = await this.dao.deleteAllProductsFromCart(cartId);
        return updatedCart;        
    }
    purchaseCart = async (cartId, userEmail) => await this.dao.purchaseCart(cartId, userEmail);

}

module.exports = CartRepository;