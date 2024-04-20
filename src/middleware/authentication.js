const { productService } = require("../repositories");

const authorization = (roleArray) => {
    return async (req, res, next) => {
        console.log(roleArray)
        if (roleArray.includes(req.session.user.role)) {
            return next();
        } else if (!req.session.user) {
            return res.redirect('/login'); 
        } else {
            return res.status(403).json({ status: 'error', error: 'No tiene el rol necesario' });
        }
    };
};


function auth (req, res, next) {
    if (req.session?.username == 'adminCoder@coder.com' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('Error de autenticación')

}

const premiumDeleteAuthorization = async (req, res, next) => {
    try {
        if (req.session.user.role === 'premium') {
            const { pid } = req.params;
            console.log(pid);
            // Verifica si el usuario es propietario del producto
            const product = await productService.getProduct(pid);
            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
            }
            if (product.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'No tiene permiso para eliminar este producto' });
            }
        }
        return next();
    } catch (error) {
        return res.status(500).json({ status: 'error', error: error.message });
    }
};

module.exports = { 
    auth,
    authorization,
    premiumDeleteAuthorization
 } 