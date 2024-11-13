const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "./public/uploads")
    },
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage:storage,
    limits:{fileSize:1024 * 1024 * 30},
    fileFilter: (req, file, cb)=>{
        const fileTypes = /jpeg|jpg|png|webp|avif/
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = fileTypes.test(file.mimetype)
        if (extname && mimetype){
            return cb(null, true)
        }
        else {
            cb(new Error('Only Images are allowed'))
        }
    }
}).array('images', 10)

module.exports = upload