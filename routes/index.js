var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({})

var uploadedFile = []
var postData

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/upload', upload.single('image'), function(req, res) {
    uploadedFile = req.file.buffer
    res.json(req.file);
})

router.get('/upload', function(req, res) {
    res.send(uploadedFile)
})

router.post('/post', function(req, res) {
    postData = req.body
    console.log(postData)
    res.json(req.body)
})

router.get('/post', function(req, res) {
    console.log(postData)
    res.json(postData)
})

module.exports = router;
