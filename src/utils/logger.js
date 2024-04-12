const winston = require('winston')
const { program } = require("../utils/commander")
const dotenv = require('dotenv')
const { mode } = program.opts()
dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
})


const levelOptions = {
    levels: {
        fatal: 0,
        error:1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'light blue',
        debug: 'green'
    }
}

//configuraciones para el modo production
const loggerToProduction = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.File({
            filename: './errors.log',
            level: 'info',
            format: winston.format.simple()
        }),
        new winston.transports.Console({
            level:'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

//configuraciones para el modo development
const loggerToDevelopment = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level:'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: levelOptions.colors }),
                winston.format.simple()
                )
        })
    ]
})


//busco el logger según el entorno
const logger = mode === 'development' ? loggerToDevelopment : loggerToProduction;


//middleware
const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} | ${new Date().toLocaleTimeString()}`);
    next();
};

module.exports = {
    addLogger,
    logger
}