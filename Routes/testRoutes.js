const { Router } = require('express');
const router = Router();

/*Test de cookies*/

router.get('/setcookie', (req, res) => {
    res.cookie('CoderCookie', 'Esta es una cookie', {maxAge:100000}).send('Seteando cookie')
});
router.get('/setcookiesigned', (req, res) => {
    res.cookie('CoderCookie', 'Esta es una cookie firmada', {maxAge:100000, signed: true}).send('Seteando cookie firmada')
});
router.get('/getcookie', (req, res) => {
    console.log(req.cookies)
    res.send(req.cookies)
});
router.get('/getcookiesigned', (req, res) => {
    res.send(req.signedCookies)
});
router.get('/deletecookie', (req, res) => {
    console.log(req.cookies)
    res.clearCookie('CoderCookie').send('Cookie borrada')
});

/*Sessions*/

router.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Visitaste esta página ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido a la tienda :D')
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send('Logout error')
        res.send({status:'success', message: 'Logout ok'})
    })
})


module.exports = router