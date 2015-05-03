var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/ontwikkelen";

var state;

function addUser(userObj, res) { // Все функции работы с DB асинхронные
    //поэтому использую callbacks
    // Ищем пользователя по логину и если он есть...
    findUser({'login': userObj.login}, function(data) {
        
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
function addUserAvatar(login, avatarPath) {
    findUser({'login': login}, function(data) {

        MongoClient.connect(url, function(err, db) {
            assert.equal(err, null);
            db.collection('users').update({login: login},
                {"$set": {"avatar": avatarPath}}, 
                { upsert: true },
                function(err, results) {
                    console.log(results.result);
                    db.close();
                });
        });
        
    });
}

function checkUser(userObj, res) {
    
    var query = {"login": userObj.login, "password": userObj.passwd};
    
    findUser(query, function(data) {
        if (data.length == 0) {
            // ответ сервера при отсутствии пользователя
            res.status(401).send("Ошибка логина или пароля");
        } else {
            // ответ сервера если всё правильно
            res.render('user', {
                user: data[0]
            });
        }
    });
    
}

function getUserPage(query, res) {
    
    findUser(query, function(data) {
        res.render('test', {
            user: data[0]
        });
    });
    
};

function findUser(query, callback) {
    
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
exports.addUserAvatar = addUserAvatar;
exports.checkUser = checkUser;
exports.getUserPage = getUserPage;
exports.findUser = findUser;
exports.removeUser = removeUser;