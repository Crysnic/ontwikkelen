var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");

var route = require("./ontwikkelen_router")

var app = express();

app.use(bodyParser.json());
app.use('/', route);

// Запуск сервера
var server = app.listen(3000, function() {
    var address = server.address().address;
    var port = server.address().port;
    address = (address == "::") ? "127.0.0.1" : address;
    
    console.log("Server start on http://%s:%s\n", address, port);
});