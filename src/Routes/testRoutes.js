const { Router } = require('express');
const router = Router();
const { faker } = require('@faker-js/faker');
const { addLogger } = require('../utils/logger');

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


/*Mocking products */

router.get('/mockingproducts', (req, res) => {
    let mockingProducts = []
    for (let i = 0; i < 100; i++) {
        mockingProducts.push(createMockingProduct())        
    }
    res.send({
        status: '',
        payload: mockingProducts
    })
});

createMockingProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: faker.image.url(),
        code: faker.string.alphanumeric({length:5}),
        stock: faker.string.numeric(2),
        category: faker.commerce.department(),
        isActive: true
    }
    
}


/*Logger test*/
router.get('/loggertest', addLogger, (req, res) => {
    req.logger.info('Info ejecutándose')
    res.send('Logger ejecutándose, ¡sííí!')
})

module.exports = router