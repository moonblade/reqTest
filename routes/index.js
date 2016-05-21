var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({})
var getVariables = require('../routes/getVariables')
var uploadedFile = []
var postData

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
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
    answers = postData.form_response.answers;
    var variables = {}
    for (key in answers) {
        var answer = answers[key]
        if (answer.field.id == "22780976") {
            // Email
            variables.email = answer.email;
        } else if (answer.field.id == "22780531") {
            // Rent or owned
            variables.rented = answer.choice.label;
        } else if (answer.field.id == "22780279") {
            // CTC
            variables.ctc = answer.number;
        } else if (answer.field.id == "22780394") {
            // months worked
            variables.months = answer.number;
        } else if (answer.field.id == "22800865") {
            // Rent paid
            variables.rent = answer.number;
        } else if (answer.field.id == "22780951") {
            // Children
            variables.child = answer.number;
        } else if (answer.field.id == "22781271") {
        	// Deduct pf and esi
        	variables.pfDeduct = answer.boolean;
        }
    }
    res.json(getVariables(variables))
})

router.get('/post', function(req, res) {
    console.log(postData)
    res.json(postData)
})

module.exports = router;
