const multer = require('multer')
const path  = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let destinationFolder = path.join(__dirname, '../uploads');
        if (file.fieldname === 'profileFile') {
            destinationFolder = path.join(destinationFolder, 'profile');
        } else if (file.fieldname === 'productFile') {
            destinationFolder = path.join(destinationFolder, 'products');
        } else {
            destinationFolder = path.join(destinationFolder, 'documents');
        }
        cb(null, destinationFolder);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({storage: storage})

module.exports = upload;