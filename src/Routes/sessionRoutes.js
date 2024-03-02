const { Router } = require('express');
const { auth } = require('../middleware/authentication.js');
const router = Router();

const SessionController = require('../controllers/sessions.controller.js');
const {
    register,
    failregister,
    login,
    faillogin,
    logout,
    githubcallback,
} = new SessionController()



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

module.exports = router
