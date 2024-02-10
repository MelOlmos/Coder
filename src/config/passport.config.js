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

        req.session.messages = [];

        // Verifica si falta alguno de los datos obligatorios
        if (!email || !password) {
        // Muestra un mensaje de error 
        return done(null,false, {message: 'Faltan campos obligatorios, chaval'})
        }
        // Define el rol del usuario
        const role = 'user';
        console.log(role)
        if (email === 'adminCoder@coder.com') {role = 'admin'};


        try {
            // Verifica si ya existe un usuario con el mismo correo electrónico
            const existingUser = await usersModel.findOne({ email:username });

            // Si ya existe, devuelve un mensaje de login
            if (existingUser) {
            return done(null,false, {message: 'El correo electrónico está en uso.<a href="/login">IR AL LOGIN</a>'});
        }

            // Si no existe, crea un nuevo usuario
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role
            };
            let result = await usersModel.create(newUser);
                       
            
            return done(null, result)
        }
        catch (error) {
            return done ('Error al obtener usuario: ' +error)
        }
}));

passport.use('login', new LocalStrategy(
    {passReqToCallback: true, usernameField: 'email'},
    async(req,username,password,done) => {
        try {
            req.session.messages = [];
            const user = await usersModel.findOne({email: username})
            if (!user) {
                console.log('Usuario no existe')
                return done(null,false);
            }
            if(!isValidPassword(password, user.password)) {return done(null,false)};
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('github'), new GitHubStrategy({
    clientID:"Iv1.1c8a7a5641a9440",
    clientSecret:'5428d8aab70d7f30d95d1a60f5d4bac628c110d1',
    callbackURL:''
}, async (accessToken, refreshToken, profile, done) =>{
    try {
        console.log(profile);
        let user = await usersModel.findOne({email:profile._json.email})
        if(!user) {
            let newUser = {
                first_name:profile._json.name,
                last_name:'',
                email:profile._json.email,
                password:''
            }
            let result = await usersModel.create(newUser);
            done(null,result);
        }
        else {done(null,user)}
    } catch (error) {
        return done(error)
    }
});

passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id,done) => {
    let user = await usersModel.findById(id);
    done(null,user);
})
}


module.exports = {initializePassport};