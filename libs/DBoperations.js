var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/ontwikkelen";
var User = require('../models/user').User;
var crypto = require("crypto");

var state;

function addUser(userObj, res) {
    // Ищем пользователя по логину
    User.findOne({login: userObj.login}, function(err, user) {
        assert.equal(err, null);
        
        if (user !== null) {
            res.end("Пользователь уже существует"); // ответ сервера
            console.log("User is exist");
            return;
        }
        
        // Если пользователя нету то создаем его
        var newUser = User({
            login: userObj.login,
            name: userObj.name,
            surname: userObj.surname,
            date: userObj.date,
            city: userObj.city,
            email: userObj.email,
            password: userObj.passw
        });
        
        newUser.save(function(err) {
            assert.equal(err, null);
            res.end("OK");
            console.log("Inserted a",userObj.login,"into the users collection");
        });
        
    });    
}
function addUserAvatar(login, avatarPath) {
    User.update({login: login}, {"$set": {"avatar": avatarPath}},
        function(err, result) {
            assert.equal(err, null);
            console.log(result);
        }
    );
}

function checkUser(userObj, res) {
    
    var salt = User.findOne({login: userObj.login}, function(err, user) {
        assert.equal(err, null);
        if (user == null) {
            res.status(401).send("Ошибка логина или пароля");
            return;
        }

        var passwd = crypto.createHmac('sha1', user.salt)
            .update(userObj.passwd).digest('hex');
    
        if (passwd === user.hashedPassword) {
            res.render('user', {
                user: user
            });
        } else {
           res.status(401).send("Ошибка логина или пароля");
        }
    });
    
}

function removeUser(login) {
    User.remove({ login: login }, function(err) {
        assert.equal(null, err);
        console.log(login," removing was successful");
    });
};

function getUserProfile(data, res) {
    User.findOne({login: data.who}, function(err, user) {
        assert.equal(err, null);
        
        var userProfileData = {
            login: user.login,
            name: user.name + " " + user.surname,
            date: user.date,
            city: user.city,
            email: user.email,
            avatar: user.avatar
        };
        res.status(200).send(userProfileData);
    });
}

exports.addUser = addUser;
exports.addUserAvatar = addUserAvatar;
exports.checkUser = checkUser;
exports.removeUser = removeUser;
exports.getUserProfile = getUserProfile;