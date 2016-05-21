var express = require('express');
var router = express.Router();
var multer = require('multer')
require('../routes/sendinblue')
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
    var email = variables.email
    var response = getVariables(variables)
    var Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var t = "";
            var n, r, i, s, o, u, a;
            var f = 0;
            e = Base64._utf8_encode(e);
            while (f < e.length) {
                n = e.charCodeAt(f++);
                r = e.charCodeAt(f++);
                i = e.charCodeAt(f++);
                s = n >> 2;
                o = (n & 3) << 4 | r >> 4;
                u = (r & 15) << 2 | i >> 6;
                a = i & 63;
                if (isNaN(r)) {
                    u = a = 64
                } else if (isNaN(i)) {
                    a = 64
                }
                t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
            }
            return t
        },
        decode: function(e) {
            var t = "";
            var n, r, i;
            var s, o, u, a;
            var f = 0;
            e = e.replace(/[^A-Za-z0-9+/=]/g, "");
            while (f < e.length) {
                s = this._keyStr.indexOf(e.charAt(f++));
                o = this._keyStr.indexOf(e.charAt(f++));
                u = this._keyStr.indexOf(e.charAt(f++));
                a = this._keyStr.indexOf(e.charAt(f++));
                n = s << 2 | o >> 4;
                r = (o & 15) << 4 | u >> 2;
                i = (u & 3) << 6 | a;
                t = t + String.fromCharCode(n);
                if (u != 64) {
                    t = t + String.fromCharCode(r)
                }
                if (a != 64) {
                    t = t + String.fromCharCode(i)
                }
            }
            t = Base64._utf8_decode(t);
            return t
        },
        _utf8_encode: function(e) {
            e = e.replace(/rn/g, "n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r)
                } else if (r > 127 && r < 2048) {
                    t += String.fromCharCode(r >> 6 | 192);
                    t += String.fromCharCode(r & 63 | 128)
                } else {
                    t += String.fromCharCode(r >> 12 | 224);
                    t += String.fromCharCode(r >> 6 & 63 | 128);
                    t += String.fromCharCode(r & 63 | 128)
                }
            }
            return t
        },
        _utf8_decode: function(e) {
            var t = "";
            var n = 0;
            var r = c1 = c2 = 0;
            while (n < e.length) {
                r = e.charCodeAt(n);
                if (r < 128) {
                    t += String.fromCharCode(r);
                    n++
                } else if (r > 191 && r < 224) {
                    c2 = e.charCodeAt(n + 1);
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                    n += 2
                } else {
                    c2 = e.charCodeAt(n + 1);
                    c3 = e.charCodeAt(n + 2);
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                    n += 3
                }
            }
            return t
        }
    }
    var client = new Mailin("https://api.sendinblue.com/v2.0", "U00SPajvryQ9h4E3", 5000); //Optional parameter: Timeout in MS
    sendRequest = {
        "to": {
            email: "name"
        },
        "from": ["x@taxhero.in", "TaxHero"],
        "subject": "Instant Tax Saver Report",
        "html": "<script type= \"text/javascript\">(function(d,n){var s,a,p;s=document.createElement(\"script\");s.type=\"text/javascript\";s.async=true;s.src=(document.location.protocol===\"https:\"?\"https:\":\"http:\")+\"//cdn.nudgespot.com\"+\"/nudgespot.js\";a=document.getElementsByTagName(\"script\");p=a[a.length-1];p.parentNode.insertBefore(s,p.nextSibling);window.nudgespot=n;n.init=function(t){function f(n,m){var a=m.split('.');2==a.length&&(n=n[a[0]],m=a[1]);n[m]=function(){n.push([m].concat(Array.prototype.slice.call(arguments,0)))}}n._version=0.1;n._globals=[t];n.people=n.people||[];n.params=n.params||[];m=\"track register unregister identify set_config people.delete people.create people.update people.create_property people.tag people.remove_Tag\".split(\" \");for(var i=0;i<m.length;i++)f(n,m[i])}})(document,window.nudgespot||[]);nudgespot.init(\"2045e2fb05b1d5bbef1fcb4ef2f43107\");</script> Hey !<br><br>We have calculated the most efficient tax structure you should negotiate with your employer .<br><br>Do write to us about how you feel about it :)<br><br><br>Cheers<br><br>Tax Hero Team",

        "attachment": {
            "Instant Tax Saver Report.pdf": Base64.encode(response.pdf)
        }
    }
    client.send_email(sendRequest).on('complete', function(data) {
        console.log(data);
        sendRequest = {
            "to": {
                "mnishamk1995@gmail.com": "nisham"
            },
            "from": ["x@taxhero.in", "TaxHero"],
            "subject": "Instant Tax Saver Report",
            "html": "<script type= \"text/javascript\">(function(d,n){var s,a,p;s=document.createElement(\"script\");s.type=\"text/javascript\";s.async=true;s.src=(document.location.protocol===\"https:\"?\"https:\":\"http:\")+\"//cdn.nudgespot.com\"+\"/nudgespot.js\";a=document.getElementsByTagName(\"script\");p=a[a.length-1];p.parentNode.insertBefore(s,p.nextSibling);window.nudgespot=n;n.init=function(t){function f(n,m){var a=m.split('.');2==a.length&&(n=n[a[0]],m=a[1]);n[m]=function(){n.push([m].concat(Array.prototype.slice.call(arguments,0)))}}n._version=0.1;n._globals=[t];n.people=n.people||[];n.params=n.params||[];m=\"track register unregister identify set_config people.delete people.create people.update people.create_property people.tag people.remove_Tag\".split(\" \");for(var i=0;i<m.length;i++)f(n,m[i])}})(document,window.nudgespot||[]);nudgespot.init(\"2045e2fb05b1d5bbef1fcb4ef2f43107\");</script> Hey !<br><br>We have calculated the most efficient tax structure you should negotiate with your employer .<br><br>Do write to us about how you feel about it :)<br><br><br>Cheers<br><br>Tax Hero Team",
            "attachment": {
                "Instant Tax Saver Report.csv": Base64.encode(response.csv)
            }
        }
        client.send_email(sendRequest).on('complete', function(data) {
            console.log(data);
            res.json({
                "code": "success",
                "data": data
            })
        })
    })
})

router.get('/post', function(req, res) {
    console.log(postData)
    res.json(postData)
})

module.exports = router;
