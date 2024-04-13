const { Router } = require('express');
const { auth } = require('../middleware/authentication.js');
const router = Router();
const SessionController = require('../controllers/sessions.controller.js');
const ProductController = require('../controllers/products.controller.js');
const passportCall = require('../middleware/passportCall.js')
const passport = require('passport');
const {authorization} = require('../middleware/authentication.js')


const {
    register,
    failregister,
    login,
    faillogin,
    logout,
    githubcallback,
    current,
    forgotPasswordForm,
    postForgotPassword,
    newPasswordForm,
    changePassword
} = new SessionController()

const productController = new ProductController();

// LOGIN
router.post('/login', login)


// FAIL LOGIN
router.get('/faillogin', faillogin)


// REGISTER 
router.post('/register', register)


// FAIL REGISTER
router.get('/failregister', failregister);


//GITHUB
router.get('/github', passport.authenticate('github', {scope:['user:email']},
async(req,res) => {}));

router.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}),
githubcallback)


//LOGOUT POST
router.post('/logout', logout)


//Pruebas de auth con get
router.get('/current', passport.authenticate('jwt',{session:false}), current)


//OLVIDÉ MI CONTRASEÑA
router.get('/forgot-password', forgotPasswordForm);


//POST DE FORMULARIO DE CONTRASEÑA OLVIDADA
router.post('/forgot-password', postForgotPassword);


//CAMBIAR LA CONTRASEÑA
router.get('/new-password', newPasswordForm);


//CONTRASEÑA ACTUALIZADA
router.post('/new-password', changePassword);
  
module.exports = router
