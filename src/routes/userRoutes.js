const Router = require('express')
const passportCall = require('../middleware/passportCall.js')
const {authorization} = require('../middleware/authentication.js')
const UserController = require('../controllers/users.controller.js')
const upload = require('../utils/multer.js')
const usersRouter = Router();

const {
    getUser,
    getUsers,
    createUser,
    deleteUser,
    changeUserRole,
    updateUser,
    uploadFiles
} = new UserController ();

usersRouter
    .get('/', passportCall('jwt'), authorization (['premium', 'admin']), getUsers)
    .post('/', createUser)
    .get('/:uid', getUser)
    .delete('/:uid', deleteUser)
    .post('/premium/:uid', changeUserRole)
    .put('/:uid', updateUser)
    .post('/:uid/documents', upload.fields([
        { name: 'profileFile', maxCount: 1 },
        { name: 'productFile', maxCount: 1 },
        { name: 'identificationFile', maxCount: 1 },
        { name: 'proofOfAddressFile', maxCount: 1 },
        { name: 'accountStatementFile', maxCount: 1 }]), uploadFiles)

module.exports = usersRouter