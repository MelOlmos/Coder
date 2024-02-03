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
        return res.send('login failed <a href="/register">REGISTER</a>');
    }
    // Guarda el usuario en la sesión
    req.session.user = user;

    return res.redirect('/products');
});

//Register post

router.post('/register', (req, res) => {
    const { first_name, last_name, email, password } = req.body
    try {
        if (email === '' || password === '') return res.send('Faltan campos obligatorios')
        // Definir el rol del usuario
        let role = 'user';
        if (email === 'adminCoder@coder.com') {
            role = 'admin';
        }
          
        const newUser = {
            first_name,
            last_name,
            email,
            password,
            role
        }

        const createdUser = sessionsService.createUser(newUser)
        if (createdUser) {
            // Asignar el nombre de usuario y el rol a la sesión
            req.session.username = email;
            req.session.admin = role === 'admin'; 
            console.log('Email:', email);
console.log('Role:', role);
            return res.send(`El correo electrónico ya está registrado. <a href="/login">IR AL LOGIN</a>`);
        }
        
        return res.redirect('/products');
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
