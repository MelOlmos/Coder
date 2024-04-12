const { userService } = require('../repositories/index')

class UserController {
    constructor(){
        this.service = userService
    }

    getUsers = async (req,res) => {
        try {
            const users = await userService.getUsers()
            res.send(users)
        } catch (error) {
            console.log(error)
        }
    }
    
    getUser = async (request, responses)=>{
        try {
            const { uid } = request.params
            const user = await userService.getUser({_id: uid})
            responses.send(user)
        } catch (error) {
            console.log(error)
        }
    }
    
    createUser = async (request, responses)=>{
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
    }
    
    
    updateUser = async (request, responses)=>{
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
    }
    
    
    deleteUser = async (request, responses)=>{
        try {
            const {uid} = request.params
            const result = await userService.deleteUser({_id:uid}, {isActive: false})
            responses.send('deleted user')
        } catch (error) {
            console.log(error)
        }
    }

    changeUserRole = async (req, res) => {
        const { uid } = req.params;
        const { role } = req.body;
    
        try {
          // Verifica si el usuario existe
          const user = await userService.getUser({_id: uid});
          if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
          }
    
          // Actualiza el rol del usuario
          user.role = role;
          await user.save();
    
          res.json({ message: 'Rol de usuario actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ error: 'Error al cambiar el rol del usuario' });
        }
      }
}

module.exports = UserController