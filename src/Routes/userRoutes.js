const Router = require('express')
const {passportCall} = require('../middleware/passportCall.js')
const {authorization} = require('../middleware/authentication.js')

const usersRouter = Router();
const {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = new UserController ();

usersRouter
    .get('/', passportCall('jwt'), authorization (['premium_user', 'admin']), getUsers)

    .post('/', createUser)
    .get('/:uid', getUser)
    .put('/:uid', updateUser)
    .delete('/:uid', deleteUser)

module.exports = usersRouter