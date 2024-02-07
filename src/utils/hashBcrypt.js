const bcrypt = require('bcrypt')

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync())

const isValidPassword = (password, passwordUser) => bcrypt.compareSync(password, passwordUser)

module.exports = {
    createHash, 
    isValidPassword
}