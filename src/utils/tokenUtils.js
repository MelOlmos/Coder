const jwt = require('jsonwebtoken');

const SECRET_KEY = 'cl4v3d3t0k3n';

// Función para generar un token de reseteo de password
const generateResetToken = (userId) => {
    const payload = {
        userId,
        type: 'resetPassword',
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
};

// Verificar y decodificar un token de reseteo de pass
const verifyResetToken = (token) => {
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        console.log('Error al verificar el token:', error);
        return null;
    }
};

module.exports = { generateResetToken, verifyResetToken };
