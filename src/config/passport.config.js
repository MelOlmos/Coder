const { isValidPassword } = require('../utils/hashBcrypt');

const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2')
const {usersModel} = require('../dao/models/users.model.js') ;
const {createHash} = require('../utils/hashBcrypt.js');

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy ( 
        //accediendo al req
        {passReqToCallback: true,
        //mapeo que el user sea el email 
        usernameField:'email'},
        async (req,username,password,done) => {
            const {first_name, last_name, email} = req.body;
            // Verifica si falta alguno de los datos obligatorios
    if (!email || !password) {
        // Muestra un mensaje de error en la página de registro
        return res.status(400).send('Faltan datos obligatorios: email o clave');
    }
    // Define el rol del usuario
    let role = 'user';
    if (email === 'adminCoder@coder.com') {role = 'admin'};

        try {
            // Verifica si ya existe un usuario con el mismo correo electrónico
            const existingUser = await usersModel.findOne({ email:username });

            // Si ya existe, devuelve un mensaje de login
            if (existingUser) {
                return done(null, false, { message: 'El correo electrónico ya está en uso.' });
            }

            // Si no existe, crea un nuevo usuario
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            };
            let result = await usersModel.create(newUser);
            return done(null, result)
        }
        catch (error) {
            return done ('Error al obtener usuario: ' +error)
        }
}));

passport.use('login', new LocalStrategy(
    {usernameField: 'email'},
    async(username,password,done) => {
        try {
            const user = await usersModel.findOne({email:username})
            if (!user) {
                return done(null,false);
            }
            if(!isValidPassword(user,password)) return done(null,false);
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id,done) => {
    let user = await usersModel.findById(id);
    done(null,user);
})
}


module.exports = {initializePassport};