const { Router } = require('express');
const { auth } = require('../src/middleware/authentication.middleware');
const UserManagerDB = require('../src/dao/userManagerDB');
const router = Router();
const sessionsService = new UserManagerDB();
const { usersModel } = require('../src/dao/models/users.model.js');


//Login post

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Busco el usuario en la DB
    const user = await usersModel.findOne({ email: username });
    if (!user) {
        return res.send('login failed');
    }
    // Guarda el usuario en la sesión
    req.session.user = user;
    // si el user o pass difieren de los establecidos
    if (username !== 'adminCoder@coder.com' || password !== 'adminCod3r123') {
        // por defecto asigno rol user
        req.session.username = username;
        req.session.role = 'user';
        // y redirijo a products
        return res.redirect('/products');
    }
    // si el user es admin, asigna rol admin y redirije a products
    req.session.username = 'admin'; req.session.role = 'admin';
    return res.redirect('/products');
});

//Register post

router.post('/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body
    try {
        if (email === '' || password === '') return res.send('Faltan campos obligatorios')
        
        const newUser = {
            first_name,
            last_name,
            email,
            password
        }

        const createdUser = sessionsService.createUser(newUser)
        if (createdUser) {
        return res.send(`El correo electrónico ya está registrado. <a href="/login">IR AL LOGIN</a>`)
        } return res.redirect('/products');
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
})

//Logout post

router.post('/logout', (req, res) => {
    req.session.destroy( error => {
        if (error) return res.send('Logout error')
        res.redirect('/login')
    })
})

//Pruebas de auth con get

router.get('/current', auth, (req, res) => {
    res.send('datos sensibles')
})

module.exports = router
