var express = require("express");
var moment = require("moment");
var path = require("path");
var DBoperation = require("DBoperations");

var router = express.Router();

var options = {
    root: path.join(__dirname, "../public")
};

// для всех запросов
router.use(function(req, res, next) {
    console.log("%s '%s' %s '%s'",
        req.method,
        req.ip,
        moment().format("YYYY-MM-DD HH:mm:ss"),
        req.originalUrl
        );  
    next();
});

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
    DBoperation.checkUser(req.body, res);
});

router.post('/registration', function(req, res) {   
    DBoperation.addUser(req.body, res);
});

// статика
router.use( express.static(options.root) );

// Если нет страницы
router.use(function(req, res) {
    res.status(404).send("Page not found :(");
});

module.exports = router;


//-------Internal functions --------------------------------------------------
function resErrorHandler(err) {
    if (err) {
        console.log(err);
        res.status(err.status).end();
    }
}