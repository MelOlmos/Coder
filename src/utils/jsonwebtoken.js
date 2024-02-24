const jwt = require('jsonwebtoken')

const PRIVATE_KEY = 'cl4v3d3t0k3n';

//id, role
const generateToken = user => jwt.sign(user, this.PRIVATE_KEY, {
    expiresIn: '1d'
});

module.exports = {
    PRIVATE_KEY,
    generateToken
}