var express = require('express');
var router = express.Router();
var db = require("../database/mongo");
const fs = require('fs');
//----controlers add manual-----------
// var User = require("../Controlers/UserCtrl")(db);
// var Book = require("../Controlers/BookCtrl")(db);
//---------------------------------------------
function trace(obj, msg) {
    if (undefined == msg || null == msg || "" == msg) msg = "\ndebug log:";
    console.log(msg);
    console.log(obj);
}
//--------------Auto load controlser----------------------------
try {
    var pathCtrl = __dirname + "/../Controlers";
    var files = fs.readdirSync(pathCtrl);
    files.forEach(file => {
        var name = file.substr(0, file.length - 3);
        var pathName = "../Controlers/" + name;
        eval(name + "=" + "require('" + pathName + "')(db)")
    });
} catch (exc) {
    trace(exc);
}

/* GET api listing. */
router.get('/', function(req, res, next) {
    res.send(null);
});
//=======================

router.get('/users/', UserCtrl.getUser);
router.get('/books/', BookCtrl.getBooks);
//=======================

router.post('/users/', function(req, res, next) {
    var param = req.body;
    User.find({}, "", function(err, us) {
        users = us;
        return res.json({
            users: users,
            params: param
        });
    });
});

module.exports = router;