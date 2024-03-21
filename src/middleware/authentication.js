const authorization = (roleArray) => {
    return async (req, res, next) => {
        if (roleArray[0] === 'user')  return next(); 
       // if (!req.user) return res.status(401).json({status: 'error', error: 'Unauthorized'}); // Si no hay usuario autenticado, devuelve un error de autorización
       if (!roleArray.includes('user')) return res.status(403).json({status:'error', error: 'Not permissions'})
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