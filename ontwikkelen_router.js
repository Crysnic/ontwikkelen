var express = require("express");
var moment = require("moment");
var path = require("path");

var router = express.Router();

var options = {
    root: path.join(__dirname, "public")
};

// для всех запросов
router.use(function(req, res, next) {
    console.log("Request '%s': %s",
        req.originalUrl,
        moment().format("YYYY-MM-DD HH:mm:ss"));  
    next();
});

// домашняя страница
router.get('/', function(req, res) {
    res.sendFile("/index.html", options, resErrorHandler());
});

// страница регистрации
router.get('/registration', function(req, res) {
    res.sendFile("/registration.html", options, resErrorHandler());
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