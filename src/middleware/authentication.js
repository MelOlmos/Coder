const authorization = (roleArray) => {
    return async (req, res, next) => {
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

module.exports = { 
    auth,
    authorization 
 } 