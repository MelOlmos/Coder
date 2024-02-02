function auth (req, res, next) {
    if (req.session?.username == 'adminCoder@coder.com' && req.session?.admin) {
        return next()
    }
    return res.status(401).send('Error de autenticación')
}

module.exports = { auth }