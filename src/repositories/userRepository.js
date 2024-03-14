const { UserDto } = require('../dto/userDto')

// capa de servicio
class UserRepository {
    constructor(userDao){
        this.dao = userDao
    }

    getUsers =   async () => await this.dao.get({ isActive: true })
    getUser =    async (filter) => {filter.isActive = true; await this.dao.getBy(filter)}
    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        newUserDto.isActive = true;
        return await this.dao.create(newUserDto)
        }
    updateUser = async (uid, userToUpdate) => await this.dao.update(uid, userToUpdate)
    deleteUser = async (uid) => await this.dao.update(uid, { isActive: false })

}


module.exports = UserRepository