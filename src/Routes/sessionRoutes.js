const { Router } = require('express');
const { auth } = require('../middleware/authentication.middleware');
const UserManagerDB = require('../dao/userManagerDB.js');
const router = Router();
const sessionsService = new UserManagerDB();
const { usersModel } = require('../dao/models/users.model.js');
const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const passport = require('passport')



//Login post

router.post('/login', passport.authenticate('login', {failureRedirect:'/api/session/faillogin', failureMessage: true}), async (req, res) => {
    if(!req.user) return res.status(401).send({status:"error", error:"Invalid credentials :("})
    req.session.user = {
        first_name:req.user.first_name,
        last_name:req.user.last_name,
        email:req.user.email,
        id:req.user._id
    }
    return res.redirect('/products');
})

router.get('/faillogin', (req,res) => {
    // Guarda el primer msj
    let errorMessage = req.session.messages[0];
    // Limpia los mensajes de error de la sesión
    req.session.messages = [];
    res.status(200).send(errorMessage);
})

/* const { username, password } = req.body;
    // Busco el usuario en la DB
    const user = await usersModel.findOne({ email: username });
    if (!user) {
        return res.send('login failed <a href="/register">REGISTER</a>');
    }
    // Valida password
    if (!isValidPassword(password, user.password)) 
    return res.status(401).send('No coinciden las credenciales')
    // Borra el pass de la sesión
    delete user.password;
    // Guarda el usuario en la sesión
    req.session.user = user;

    return res.redirect('/products');
}); */


//Register post
router.post('/register', passport.authenticate('register', 
{ failureRedirect: '/api/session/failregister', failureMessage: true }), async (req, res) => {
    res.redirect('/products')
});

    /* const { first_name, last_name, email, password } = req.body;
    // Verifica si falta alguno de los datos obligatorios
    if (!email || !password) {
        // Muestra un mensaje de error en la página de registro
        return res.status(400).send('Faltan datos obligatorios: email o clave');
    }
    // Define el rol del usuario
    let role = 'user';
    if (email === 'adminCoder@coder.com') {role = 'admin'};
    try {
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            
        }
        
        const  createdUser = sessionsService.createUser(newUser)
        if (!createdUser) {
            return res.send(`El correo electrónico ya está registrado. <a href="/login">IR AL LOGIN</a>`);
        }
        // Asigna el nombre de usuario y el rol a la sesión
        req.session.username = email;
        req.session.user = { first_name, role };
 
        return res.redirect('/products');

    } catch (error) {
        res.status(500).json({ error: error.message });        
    }}

) */



// Fail register
router.get('/failregister', (req, res) => {
    // Guarda el primer msj
    let errorMessage = req.session.messages[0];
    // Limpia los mensajes de error de la sesión
    req.session.messages = [];
    res.status(200).send(errorMessage);
});

router.get('/github', passport.authenticate('github', {scope:['user:email']},
async(req,res) => {}));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}),
async(req,res) => {
    req.session.user = req.user;
    res.redirect('/products')
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
