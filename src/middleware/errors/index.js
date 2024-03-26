const {EErrors} = require('../../utils/errors/enums');

exports.handleErrors = (error, req, res, next) => {
    console.log(error.code)
    switch (error.code) {
        case EErrors.MISSING_PARAMETER_ERROR:
            return res.send({status: 'error', error: error})            
            break;
    
        default:
            return res.send({status: 'error', error: error})
            break
    }
}