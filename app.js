var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var favicon = require('serve-favicon');

var test = require("./routes/test");
var mainRoute = require("./routes/ontwikkelen_router")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use( favicon(path.join(__dirname, 'public', 'favicon.ico')) );
// test jane
app.use('/test', test);
app.use('/', mainRoute);


app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send("Server error");
});

// Запуск сервера
var server = app.listen(3000, function() {
    var address = server.address().address;
    var port = server.address().port;
    address = (address == "::") ? "127.0.0.1" : address;
    
    console.log("Server start on http://%s:%s\n", address, port);
});