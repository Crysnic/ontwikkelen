var express = require("express");
var moment = require("moment");
var path = require("path");

var app = express();

var options = {
    root: path.join(__dirname, "public")
};

// для всех запросов
app.use(function(req, res, next) {
    console.log("Request '%s': %s",
        req.originalUrl,
        moment().format("YYYY-MM-DD HH:mm:ss"));
        
    next();
});

app.get('/', function(req, res) {
    
    res.sendFile("/index.html", options, function(err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
});

app.use( express.static(options.root) );

app.get('/registration', function(req, res) {
    res.setHeader("Content-Type", ["text/html", "charset='utf-8'"]);
    res.end("Registration");
});

// Если нет страницы
app.use(function(req, res) {
    res.status(404).send("Page not found :(");
});

// Запуск сервера
var server = app.listen(3000, function() {
    var address = server.address().address;
    var port = server.address().port;
    address = (address == "::") ? "localhost" : address;
    
    
    console.log("Server start on http://%s:%s\n", address, port);
});