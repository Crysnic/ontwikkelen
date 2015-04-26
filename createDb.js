var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var url = "mongodb://localhost:27017/ontwikkelen";

MongoClient.connect(url, function(err, db) {
    assert.equal(err, null);
    console.log("Connected corrcetly to server");
    
    db.collection('users');
    console.log("Created users collection");
    
    db.close();
});