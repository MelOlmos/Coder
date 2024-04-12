const Router = require('express')
const passportCall = require('../middleware/passportCall.js')
const {authorization} = require('../middleware/authentication.js')
const UserController = require('../controllers/users.controller.js')

const usersRouter = Router();
const {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    changeUserRole,
    updateUser
} = new UserController ();

usersRouter
    .get('/', passportCall('jwt'), authorization (['premium', 'admin']), getUsers)
    .post('/', createUser)
    .get('/:uid', getUser)
    .delete('/:uid', deleteUser)
    .put('/premium/:uid', passportCall('jwt'), authorization(['admin']), changeUserRole)
    .put('/:uid', updateUser)

module.exports = usersRouter