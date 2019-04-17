var express = require('express');
var app = express();
var router = express.Router();
const galleryController = require('../../controllers/api/GalleryController');
const verifyToken = require('../../Middlewares/JwtAuthMiddleware');

//========Fix upload image
// var multer = require('multer')
// var cors = require('cors');
// app.use(cors())
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//     cb(null, 'public')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' +file.originalname )
//   }
// })
// var upload = multer({ storage: storage }).single('file')

// router.post('/profile', (req, res, next) => {
//     upload(req, res, function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.status(500).json(err)
//         } else if (err) {
//             return res.status(500).json(err)
//         }
//    return res.status(200).send(req.file)

//  })
// })
//========End fix upload image
router.get('/getAll', galleryController.getAll);
router.get('/show/:id', galleryController.show);
router.post('/store', galleryController.store);
module.exports = router;