const nodemailer = require('nodemailer')
const { configObject } = require('../config/connectDB')

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    },
    tls: {
        rejectUnauthorized: false // Ignora errores de certificado
    }
})

const sendEmail = async ({service, to, subject, html}) => {
    return await transport.sendMail({
        from: `${service} ${configObject.gmail_user}`,
        to,
        subject,
        html
    })
}

module.exports = {
    sendEmail
}