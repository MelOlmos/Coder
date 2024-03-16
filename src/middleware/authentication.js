const authorization = (roleArray) => {
    return async (req, res, next) => {
        if (roleArray[0] === 'user') return next()
/*         if (!req.user) return res.status(401).json({status: 'error', error: 'Unauthorized'}) */
        if (!roleArray.includes(req.user.role)) return res.status(403).json({status:'error', error: 'Not permissions'})

        next()
    }
}


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