var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var multer  = require('multer');
var favicon = require('serve-favicon');
var DBoperation = require("DBoperations");

var mainRoute = require("./routes/ontwikkelen_router");

var app = express();
var expressWs = require('express-ws')(app);

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use( favicon(path.join(__dirname, 'public', 'favicon.ico')) );

var done = null;

// if server get a picture
app.use(multer({ dest: './public/images/avatars/',
    
    rename: function (fieldname, filename) {
        return fieldname.match(/[a-zA-Z]+/) + "Avatar";
     },
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
        var avatarPath = file.path.match(/\/images.*/)[0];
        console.log(file.fieldname + ' uploaded to  ' + avatarPath);
        DBoperation.addUserAvatar(file.fieldname.match(/[a-zA-Z]+/)[0], avatarPath);
        done = avatarPath;
    }
    
}));

app.post('/user_avatar', function(req, res) {
    if(done !== null){
        res.send(done);
    }
});

app.use('/', mainRoute);

// подключенные клиенты
var clients = {};

// работа с сокетом
app.ws('/', function(ws, req) {
    
    var id = Math.random();
    clients[id] = ws;
    console.log("новое соединение " + id);
    
    ws.on('message', function incoming(message) {
        var mesOBJ = JSON.parse(message);
        console.log('%s: %s', mesOBJ.from, mesOBJ.message);
        
        for (var key in clients) {
            clients[key].send(message);
        }
    });
    
    ws.on('close', function() {
        console.log('соединение закрыто ' + id);
        delete clients[id];
    });
});

// Если нет страницы
/*app.use(function(req, res, next) {
    res.status(404).send("Page not found :(");
});*/

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