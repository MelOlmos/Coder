const passport = require('passport');
const local = require('passport-local');
const { isValidPassword } = require('../utils/hashBcrypt');
const GitHubStrategy = require('passport-github2')
const {usersModel} = require('../dao/mongo/models/users.model.js');
const {createHash} = require('../utils/hashBcrypt.js');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { PRIVATE_KEY } = require('../utils/jsonwebtoken.js');
const JWTStrategy = Strategy;
const ExtractJWT = ExtractJwt;


const initializePassport = () => {
    const cookieExtractor = (req) => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['cookieToken']
        }
        return token
    }
    passport.use('jwt', new JWTStrategy ({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
           return done(error) 
        }
    }))
}




const LocalStrategy = local.Strategy;
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
            //
            
            if (user.role === 'admin') {
                const token = generateToken({ id: user._id, role: user.role });
                return done(null, user, { token });
            }
            
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


passport.use('github', new GitHubStrategy({
    clientID:'Iv1.1c8a7a5641a94405',
    clientSecret:'5428d8aab70d7f30d95d1a60f5d4bac628c110d1',
    callbackURL:'http://localhost:8080/api/session/githubcallback'
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
            return done(null,result);
        }
        return done(null,user)
    } catch (error) {
        return done(error)
    }
}));


module.exports = {initializePassport}