const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const fileUpload = multer({
    limits: { fileSize: 8097152 }, //~1mb
    storage: new multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'uploads/files');
        },
        filename: (req, file, callback) => {
            const fileTypes = /pdf|docx|xlsx|csv|txt/;
            // let mimetype = fileTypes.test(file.mimetype);
            let extname = fileTypes.test(
                path.extname(file.originalname).toLowerCase(),
            );
            if (extname) {
                const uniqueSuffix =
                    Date.now() + '-' + Math.round(Math.random() * 1e9);
                return callback(null, file.originalname);
            }
            callback(
                `File upload only supports the following filetypes - ` +
                    fileTypes,
                null,
            );
        },
    }),
});
module.exports = fileUpload;
