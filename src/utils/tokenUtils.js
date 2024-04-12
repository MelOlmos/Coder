const jwt = require('jsonwebtoken');

const SECRET_KEY = 'cl4v3d3t0k3n';

// Función para generar un token de reseteo de password
const generateResetToken = (userId) => {
    const payload = {
        userId,
        type: 'resetPassword',
    };
 // Calcula la fecha de expiración en una hora
 const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hora en milisegundos

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: Math.floor(expirationTime / 1000) });
    return token;
};

// Verificar y decodificar un token de reseteo de pass
const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = { generateResetToken, verifyResetToken };
