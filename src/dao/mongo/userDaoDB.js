const { usersModel } = require('./models/users.model')

class UserManagerDB {
    constructor () {
        //Inicia la DB
    this.userModel = usersModel

    }

getUsersPaginate = async (limit=10, page=1) => await this.userModel.paginate({},{limit, page, lean: true})
get = async _ => await this.userModel.find({})
getBy = async (filter) => await this.userModel.findOne(filter)

create = async (newUser) => {
    // Busca el user
    const existsUser = await this.userModel.findOne({ email: newUser.email });
   // Lo crea si no lo encuentra
    if (!existsUser) {
        const user = await this.userModel.create(newUser);
        console.log(newUser)
        return true;
    } return false
}   

update = async (uid, userUpdate) => await this.userModel.findOneAndUpdate({_id:uid}, userUpdate)
delete = async (uid) => await this.model.findByIdAndUpdate({_id: uid}, {isActive: false}, {new: true})
}

module.exports = UserManagerDB

/*const { userModel } = require("./models/users.model") // representa persistencia bd

class UserDaoMongo { // Dao
    constructor(){
        this.modelMongoose = userModel
    }

    get = () => { // consultar usuario
        return this.userModel.find({})
    }
    
    getBy = (filter) => { // leer un usuario
        return this.userModel.findOne(filter)
    }
    create = (newUser) => { // crear usuario
        return this.userModel.create(newUser)
    } 
    update = (uid, userToUpdate) => { // actualizar usuario
        return this.userModel.findByIdAndUpdate({_id: uid}, userToUpdate, {new: true})
    } 
    delete = (uid) => {
        return this.userModel.findByIdAndDelete({_id: uid})
    } 
}

module.exports = UserDaoMongo
*/