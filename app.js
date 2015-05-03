var express = require("express");
var bodyParser = require('body-parser');
var path = require("path");
var multer  = require('multer');
var favicon = require('serve-favicon');
var DBoperation = require("DBoperations");

var test = require("./routes/test_router");
var mainRoute = require("./routes/ontwikkelen_router")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use( favicon(path.join(__dirname, 'public', 'favicon.ico')) );

var done = false;

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
        done=true;
    }
    
}));

app.post('/user_avatar', function(req, res) {
    if(done == true){
        res.send("Page is updated");
    }
});

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