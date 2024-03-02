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
    .get('/', passportCall('jwt'), authorization (['premium_user', 'admin']), getUsers /* async (req,res) => {
        try {
            const users = await userService.find({isActive: true})
            res.json ({
                status: 'success',
                result: user
            })
        } catch (error) {
            console.log(error)
        }
    } */)

    .post('/', createUser /* async (request, responses)=>{
        try {
            const { body } = request
            const result = await userService.createUser(body)

            responses.send({
                status: 'success',
                result
            })
        } catch (error) {
            console.log(error)
        }
    } */)
    .get('/:uid', getUser /* async (request, responses)=>{
        try {
            const { uid } = request.params
            const user = await userService.getUser({_id: uid})
            responses.json({
                status: 'success',
                result: user
            })
        } catch (error) {
            console.log(error)
        }
    } */)
    .put('/:uid', updateUser /* async (request, responses)=>{
        try {
            const { uid } = request.params
            const userToUpdate = await userService.updateUser(uid, userToUpdate)
            responses.status(200).send({
                status: 'success',
                result: userToUpdate
            })
        } catch (error) {
            console.log(error)
        }
    } */)
    .delete('/:uid', deleteUser /* async (request, responses)=>{
        try {
            const {uid} = request.params
            const result = await userService.deleteUser({_id:uid}, {isActive: false})
            responses.send('deleted user')
        } catch (error) {
            console.log(error)
        }
    } */)

module.exports = usersRouter