var express = require("express");
var path = require("path");
var DBoperation = require("../libs/DBoperations");

var router = express.Router();

var options = {
    root: path.join(__dirname, "../public")
};

// домашняя страница
router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'OntwiKKelen'
    });
});

// страница регистрации
router.get('/registration', function(req, res) {
    res.sendFile("/registration.html", options, resErrorHandler());
});

// POST запросы
router.post('/login', function(req, res) {
    res.set("Content-Type", "text/html; charset=utf-8");
    DBoperation.checkUser(req.body, res);
});

router.post('/registration', function(req, res) {   
    DBoperation.addUser(req.body, res);
});

// статика
router.use( express.static(options.root) );

module.exports = router;


//-------Internal functions --------------------------------------------------
function resErrorHandler(err) {
    if (err) {
        console.log(err);
        res.status(err.status).end();
    }
}