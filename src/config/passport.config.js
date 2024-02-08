const { isValidPassword } = require('../utils/hashBcrypt');

const passport = require('passport');
const local = require('passport-local');
const {userService} = require('../dao/models/users.model.js') ;
const {createHash} = require('../utils/hashBcrypt.js');

const LocalStrategy = local.Strategy;
const initializePassport = function () {
    passport.use('register', new LocalStrategy ( 
        //accediendo al req
        {passReqToCallback: true,
        //mapeo que el user sea el email 
        usernameField:'email'}),
        async (req,username,password,done) => {
            const {first_name, last_name, email} = req.body;
            try {
                let user = await userService.findOne({email:username});
                if(user) return done(null,false);

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password),
                role
            }
            let result = await userService.create(newUser);
            return done(null, result)
        }
        catch (error) {
            return done ('Error al obtener usuario: ' +error)
        }
})

passport.use('login'), new LocalStrategy(
    {usernameField: 'email'},
    async(username,password,done) => {
        try {
            const user = await userService.findOne({email:username})
            if (!user) {
                return done(null,false);
            }
            if(!isValidPassword(user,password)) return done(null,false);
            return done(null,user)
        } catch (error) {
            return done(error);
        }
    }
)

passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id,done) => {
    let user = await userService.findById(id);
    done(null,user);
})
}


module.export = initializePassport;