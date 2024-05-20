const { Router } = require('express')
const cartRouterDB = require('./cartRoutesDB.js')
const usersRouter = require('./userRoutes.js')
const viewsRouter = require('./view.router.js')
const sessionsRoutes = require('./sessionRoutes.js')
const productsRouterDB = require('./productRoutesDB.js')
const messagesRouter = require('./messageRoutesDB.js')
const testRoutes = require ('./testRoutes.js')
const passport = require('passport');
const router = Router()
 

// Rutas para vistas
router.use('/', viewsRouter);
// Rutas para sesiones
router.use('/api/session', sessionsRoutes);
// Rutas para users
router.use('/api/users', usersRouter)
// Rutas de pruebas
router.use('/api/test', testRoutes)



/*RUTAS CON MONGODB*/
// Rutas para productos
router.use('/api/products-db', passport.authenticate('jwt', { session: false }),
productsRouterDB);
// Rutas para carritos
router.use('/api/carts', cartRouterDB);
// Rutas para mensajes
router.use('/api/messages', messagesRouter);


/*RUTAS CON FS*/
/* // Rutas para productos 
router.use('/api/products',productsRouter);
// Rutas para carritos
router.use('/api/carts',cartRouter); 
 */
module.exports= router