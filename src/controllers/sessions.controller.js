const { createHash, isValidPassword } = require('../utils/hashBcrypt.js');
const { generateToken } = require('../utils/jsonwebtoken.js');
const UserManagerDB = require('../dao/mongo/userDaoDB.js')
const { UserDto } = require('../dto/userDto.js');
const CartManagerDB = require('../dao/mongo/cartDaoDB.js');
const cartManager = new CartManagerDB();
const { generateResetToken, verifyResetToken } = require('../utils/tokenUtils.js');
const { sendEmail } = require('../utils/sendMail.js')


class SessionController {
    constructor() {
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
        if (email === 'adminCoder@coder.com') { role = 'admin' };

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
                cartID,
                last_connection: new Date()
            }

            const createdUser = await this.userService.create(newUser)

            //valida si está en la Mongo DB antes de crear user
            if (!createdUser) {
                return res.send(`Email already exists. <a href="/login">GO TO LOGIN</a>`);
            }

            // Almacena la información del usuario en la sesión
            req.session.user = {
                first_name: createdUser.first_name,
                last_name: createdUser.last_name,
                email: createdUser.email,
                role: createdUser.role,
                cartID: createdUser.cartID,
                last_connection: createdUser.last_connection
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
            res.send({ errorMessage })
        }
    }

    login = async (req, res) => {
        const { email, password } = req.body
        //busco el usuario en la DB
        const userFoundDB = await this.userService.getBy({ email })

        if (!userFoundDB) {
            return res.send('Login failed <a href="/register">REGISTER</a>');
        }
        //esto valida la password
        if (!isValidPassword(password, userFoundDB.password))
            return res.status(401).send('No coinciden las credenciales');

        const token = generateToken({
            first_name: userFoundDB.first_name, id: userFoundDB._id,
            role: userFoundDB.role, email: userFoundDB.email, cartID: userFoundDB.cartID
        })
        //envía la cookie
        res.cookie('cookieToken', token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true
        });
        req.session.user = {
            _id: userFoundDB._id,
            first_name: userFoundDB.first_name,
            last_name: userFoundDB.last_name,
            email: userFoundDB.email,
            role: userFoundDB.role,
            cartID: userFoundDB.cartID,
            last_connection: new Date()
        };

        return res.redirect('/products');
    }

    faillogin = async (req, res) => {
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

            // Verifica si req.session.user está y el id
            if (req.session.user && req.session.user._id) {
                // Actualiza la última conexión en la base de datos
                await this.userService.update(req.session.user._id, { last_connection: (new Date()) });
            }

            req.session.destroy()
            res.redirect('/login')


        } catch (error) {
            res.send({ status: 'error', error })
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

    githubcallback = async (req, res) => {
        try {
            req.session.user = req.user;
            res.redirect('/products')

        } catch (error) {
            console.log(error)
        }
    }

    forgotPasswordForm = (req, res) => {
        res.render('forgotPassword');
    };

    newPasswordForm = (req, res) => {
        res.render('newPassword', { token });
    };


    postForgotPassword = async (req, res) => {
        const { email } = req.body;
        const PORT = process.env.PORT;
        const DOMAIN = process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;

        try {
            // Busca el usuario por su correo electrónico
            const user = await this.userService.getBy({ email });

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            // Genera el token de restablecimiento
            const token = generateResetToken(user._id);

            // Crea el link de restablecimiento
            const resetLink = `${DOMAIN}/new-password?token=${token}`;

            // Envia el correo de restablecimiento
            await sendEmail({
                to: email,
                subject: 'Restablecer contraseña',
                html: `Haz clic <a href="${resetLink}">aquí</a> para restablecer tu contraseña.`,
            });

            res.render('resetEmailSent', { email });
        } catch (error) {
            res.status(500).send('Error al enviar el correo de restablecimiento.');
        }
    };


    changePassword = async (req, res) => {
        try {
            const { newPassword, token } = req.body;

            // Verifica si el token es válido
            const decodedToken = verifyResetToken(token);
            if (!decodedToken) {
                return res.status(400).send('Token inválido o expirado');
            }

            // Busca el usuario por su correo electrónico en la db
            const user = await this.userService.getBy({ _id: decodedToken.userId });

            if (!user) {
                return res.status(404).send('Usuario no encontrado');
            }

            // Verifica que las contraseñas sean distintas
            const isSamePassword = await isValidPassword(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).send('La nueva contraseña debe ser diferente a la contraseña actual');
            }

            // Actualiza la contraseña 
            user.password = createHash(newPassword);
            await user.save();

            res.send('Contraseña actualizada correctamente <a href="/login">Go to Login</a>');
        } catch (error) {
            res.status(500).send('Error al cambiar la contraseña' + error);
        }
    };

}

module.exports = SessionController