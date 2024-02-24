const { Router } = require('express');
const { auth } = require('../middleware/authentication.js');
const UserManagerDB = require('../dao/userManagerDB.js');
const router = Router();
const userService = new UserManagerDB();
const { usersModel } = require('../dao/models/users.model.js');
const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const passport = require('passport');
const { generateToken } = require('../utils/jsonwebtoken.js');



// LOGIN
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    //busco el usuario en la DB
    const userFoundDB = userService.getUserBy({email})
    if (!userFoundDB) {
        return res.send('login failed <a href="/register">REGISTER</a>');
    }
    //esto valida la password
    if (!isValidPassword(password, userFoundDB.password)) 
    return res.status(401).send('No coinciden las credenciales')

    const token = generateToken({first_name: userFoundDB.first_name, id:userFoundDB._id, role:userFoundDB.role, email:userFoundDB.email})
    
    //envía la cookie
    res.cookie('cookieToken', token, {
        maxAge: 60*60*1000*24,
        httpOnly:true
    }).send('login')
})


// FAIL LOGIN
router.get('/faillogin', (req,res) => {
    // Guarda el primer msj
    let errorMessage = req.session.messages[0];
    // Limpia los mensajes de error de la sesión
    req.session.messages = [];
    res.status(200).send(errorMessage);
})


// REGISTER 
router.post('/register', async (req, res) => {
     const { first_name, last_name, email, password } = req.body;
    // Verifica si falta alguno de los datos obligatorios
    if (!email || !password) {
        // Muestra un mensaje de error en la página de registro
        return res.status(400).send('Faltan datos obligatorios: email o clave');
    }
    //define el rol de usuario
    let role = 'user';
    if (email === 'adminCoder@coder.com') {role = 'admin'};
    try {
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            
        }
        console.log(newUser)
        //valida si está en la Mongo DB antes de crear user
        const  createdUser = await userService.createUser(newUser)
        if (!createdUser) {
            return res.send(`Email already exists. <a href="/login">GO TO LOGIN</a>`);
        } 
        return res.redirect('/products');
        
    } catch (error) {
        console.log(error)
    }

})


// FAIL REGISTER
router.get('/failregister', (req, res) => {
    // Guarda el primer msj
    let errorMessage = req.session.messages[0];
    // Limpia los mensajes de error de la sesión
    req.session.messages = [];
    res.status(200).send(errorMessage);
});


//GITHUB
router.get('/github', passport.authenticate('github', {scope:['user:email']},
async(req,res) => {}));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}),
async(req,res) => {
    req.session.user = req.user;
    res.redirect('/products')
})


//LOGOUT POST
router.post('/logout', (req, res) => {
    req.session.destroy( error => {
        if (error) return res.send('Logout error')
        res.redirect('/login')
    })
})


//Pruebas de auth con get
router.get('/current', passport.authenticate('jwt',{session:false}), (req, res) => {
    res.send(req.user);
})

module.exports = router
