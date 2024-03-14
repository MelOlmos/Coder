const { Router } = require('express')
const cartRouterDB = require('./cartRoutesDB.js')
const usersRouter = require('./userRoutes.js')
const viewsRouter = require('./view.router.js')
const sessionsRoutes = require('./sessionRoutes.js')
const testRoutes = require('./testRoutes.js')
const productsRouterDB = require('./productRoutesDB.js')
const messagesRouter = require('./messageRoutesDB.js')
const passport = require('passport');
const {authorization} = require('../middleware/authentication.js')

const router = Router()
 
// Rutas para vistas
router.use('/', viewsRouter);
// Rutas para sesiones
router.use('/api/session', sessionsRoutes);
// Para current quedó 'api/session/current'
// Rutas para users
router.use('/api/users', usersRouter)

/*RUTAS CON MONGODB*/
// Rutas para productos
router.use('/api/products-db', passport.authenticate('jwt', { session: false }), authorization(['admin']),
productsRouterDB);
// Rutas para carritos
router.use('/api/carts', cartRouterDB);
// Rutas para mensajes
router.use('/api/messages', messagesRouter);

/* router.get('*', (req,res)=> {
    res.send('not found')
}) */

/*RUTAS CON FS*/
/* // Rutas para productos 
router.use('/api/products',productsRouter);
// Rutas para carritos
router.use('/api/carts',cartRouter); 
 */
module.exports= router