var express = require("express");
var path = require("path");

var route = require("./ontwikkelen_router")

var app = express();

app.use('/', route);

// Запуск сервера
var server = app.listen(3000, function() {
    var address = server.address().address;
    var port = server.address().port;
    address = (address == "::") ? "localhost" : address;
    
    console.log("Server start on http://%s:%s\n", address, port);
});