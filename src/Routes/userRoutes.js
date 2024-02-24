const Router = require('express')
const {usersModel} = require('../dao/models/users.model.js')
const {passportCall} = require('../middleware/passportCall.js')
const {authorization} = require('../middleware/authentication.js')

const usersRouter = Router();

usersRouter
    .get('/', passportCall('jwt'), authorization (['premium_user', 'admin']), async (req,res) => {
        try {
            const users = await usersModel.find({isActive: true})
            res.json ({
                status: 'success',
                result: user
            })
        } catch (error) {
            console.log(error)
        }
    })

    .post('/', async (req,res)=> {
        try {
            const {body} = req
        } catch (error) {
            
        }
    })