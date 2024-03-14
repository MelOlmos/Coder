const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const passport = require('passport');
const { generateToken } = require('../utils/jsonwebtoken.js');
const UserManagerDB = require('../dao/mongo/userDaoDB.js')
const { UserDto } = require('../dto/userDto.js');


class SessionController {
    constructor(){
        this.userService = new UserManagerDB()
    }


register = async (req, res) => {
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
        const  createdUser = await this.userService.createUser(newUser)
        if (!createdUser) {
            return res.send(`Email already exists. <a href="/login">GO TO LOGIN</a>`);
        } 
        req.session.user = {
            first_name,
            last_name,
            email,
            role
        };
        return res.redirect('/products');
        
    } catch (error) {
        res.send(error)
    }

}


failregister = async (req, res) => {
    try {
        // Guarda el primer msj
        let errorMessage = req.session.messages[0];
        // Limpia los mensajes de error de la sesión
        req.session.messages = [];
        res.status(200).send(errorMessage);
    } catch (error) {
        res.send({errorMessage})
    }
}


login = async (req, res) => {
    const {email, password} = req.body
    //busco el usuario en la DB
    const userFoundDB = await this.userService.getUser({email})
    if (!userFoundDB) {
        return res.send('login failed <a href="/register">REGISTER</a>');
    }
    //esto valida la password
    if (!isValidPassword(password, userFoundDB.password)) 
    return res.status(401).send('No coinciden las credenciales');
    
    const token = generateToken({first_name: userFoundDB.first_name, id:userFoundDB._id, role:userFoundDB.role, email:userFoundDB.email})
    
    //envía la cookie
    res.cookie('cookieToken', token, {
        maxAge: 60*60*1000*24,
        httpOnly:true
    }); 
    req.session.user = {
        first_name: userFoundDB.first_name,
        last_name: userFoundDB.last_name,
        email: userFoundDB.email,
        role: userFoundDB.role
    };
    return res.redirect('/products');
}

faillogin = async (req,res) => {
    try {
        // Guarda el primer msj
        let errorMessage = req.session.messages[0];
        // Limpia los mensajes de error de la sesión
        req.session.messages = [];
        res.status(200).send(errorMessage);
        
    } catch (error) {
        console.log(error)
    }
}

logout = async (req, res) => {
    try {
        req.session.destroy( error => {
            if (error) return res.send('Logout error')
            res.redirect('/login')
        
    })
 } catch (error) {
        res.send({status: 'error', error})
    }
}



current = async (req, res) => {
    try {
        // Obtengo la info del usuario de la sesión
        const { first_name, last_name, email, password } = req.session.user;
        // instancio un nuevo userdto
        const userDto = new UserDto({ first_name, last_name, email, password });
        res.json(userDto);
    } catch (error) {
        res.status(500).json({ status: 'error', error });
    }
}

githubcallback = async(req,res) => {
    try {
        req.session.user = req.user;
        res.redirect('/products')
        
    } catch (error) {
        console.log(error)
    }
}

}

module.exports = SessionController