const { usersModel } = require('./models/users.model')

class UserManagerDB {
    constructor () {
        //Inicia la DB
    this.userModel = usersModel

    }

getUsersPaginate = async (limit=10, page=1) => await this.userModel.paginate({},{limit, page, lean: true})
getUsers = async _ => await this.userModel.find({})
getUserBy = async (filter) => await this.userModel.findOne(filter)

createUser = async (newUser) => {
    // Busca el user
    const existsUser = await this.userModel.findOne({ email: newUser.email });
   // Lo crea si no lo encuentra
    if (!existsUser) {
        const user = await this.userModel.create(newUser);
        console.log(newUser)
        return true;
    } return false
}   

updateUser = async (uid, userUpdate) => await this.userModel.findOneAndUpdate({_id:uid}, userUpdate)
deleteUser = async (uid) => await this.userModel.findOneAndDelete({_id:uid})
}

module.exports = UserManagerDB