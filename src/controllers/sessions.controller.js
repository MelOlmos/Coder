const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const passport = require('passport');
const { generateToken } = require('../utils/jsonwebtoken.js');
const UserManagerDB = require('../dao/mongo/userDaoDB.js')
const { UserDto } = require('../dto/userDto.js');

const CartManagerDB = require('../dao/mongo/cartDaoDB.js');
const cartManager = new CartManagerDB();




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

    const newCart = { products: [], quantity: 1 };
    const createCart = await cartManager.addCart(newCart);
    
    // Verifica que se haya creado el carrito
    if (!createCart) {
       return res.status(500).send('Error al crear el carrito para el usuario');
     }

    const cartID = createCart._id;

    try {
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            role,
            cartID
        }
        
        //valida si está en la Mongo DB antes de crear user
        const  createdUser = await this.userService.create(newUser)
        console.log("created usuario" +createdUser)
        if (!createdUser) {
            return res.send(`Email already exists. <a href="/login">GO TO LOGIN</a>`);
        } 
        
        // Almacena la información del usuario en la sesión
        req.session.user = {
            first_name,
            last_name,
            email,
            role,
            cartID
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
    const userFoundDB = await this.userService.getBy({email})
    console.log(userFoundDB)
    if (!userFoundDB) {
        return res.send('login failed <a href="/register">REGISTER</a>');
    }
    //esto valida la password
    if (!isValidPassword(password, userFoundDB.password)) 
    return res.status(401).send('No coinciden las credenciales');
    
    const token = generateToken({first_name: userFoundDB.first_name, id:userFoundDB._id, 
        role:userFoundDB.role, email:userFoundDB.email, cartID:userFoundDB.cartID})
    //envía la cookie
    res.cookie('cookieToken', token, {
        maxAge: 60*60*1000*24,
        httpOnly:true
    }); 
    req.session.user = {
        first_name: userFoundDB.first_name,
        last_name: userFoundDB.last_name,
        email: userFoundDB.email,
        role: userFoundDB.role,
        cartID: userFoundDB.cartID
    };
    console.log(req.session.user.cartID)
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
        // Verifica si el usuario está definido en la sesión
        if (!req.session.user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado en la sesión' });
        }
        // Obtengo la información del usuario de la sesión
        const { first_name, last_name, email, password } = req.session.user;
        // Instancio un nuevo userdto
        const userDto = new UserDto({ first_name, last_name, email, password });

        res.json(userDto);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
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