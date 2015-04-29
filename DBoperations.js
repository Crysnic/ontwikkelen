var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/ontwikkelen";

var state;

function addUser(userObj, res) { // Все функции работы с DB асинхронные
    //поэтому использую callbacks
    // Ищем пользователя по логину и если он есть...
    findUser(userObj.login, function(data) {
        
        if (data.length > 0) {
            res.end("Пользователь уже существует"); // ответ сервера
            console.log("User is exist - ", data);
            return;
        }
        
        // Если пользователя нету то создаем его
        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);

            db.collection('users').insertOne({
                "login": userObj.login,
                "name": userObj.name,
                "surname": userObj.surname,
                "date": userObj.date,
                "city": userObj.city,
                "email": userObj.email,
                "password": userObj.passw
            }, function(err, result) {
              assert.equal(err, null);
              res.end("OK");
              console.log("Inserted a",userObj.login,"into the users collection.");
              db.close();
            });
        });
        
    });    
}

function checkUser(userObj, res) {

    findUser(userObj.login, userObj.passwd, function(data) {
        if (data.length == 0) {
            // ответ сервера при отсутствии пользователя
            res.status(401).send("Ошибка логина или пароля");
        } else {
            // ответ сервера если всё правильно
            res.render('user', {
                title: data[0].login,
                name: data[0].name,
                surname: data[0].surname,
                birthdate: data[0].date,
                city: data[0].city,
                email: data[0].email
            });
        }
    });
    
}

function findUser() {
 
    if (arguments.length == 2) {
        
       var query = {"login": arguments[0]};
       var callback = arguments[1];
       
    } else if (arguments.length == 3) {
        
       query = {"login": arguments[0], "password": arguments[1]};
       callback = arguments[2];
       
    }
    
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        
        var collection = db.collection('users');
        
        collection.find(query).toArray(function(err, users) {
            assert.equal(null, err);
            db.close();
            
            callback(users);
        });
    });
    
}

function removeUser(login) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        
        db.collection('users').deleteOne(
            { "login": login }, function(err, results) {
            console.log(results.result);
            db.close();
        });
    });
}

exports.addUser = addUser;
exports.checkUser = checkUser;
exports.findUser = findUser;
exports.removeUser = removeUser;