var express = require('express');
var router = express.Router();
var DBoperation = require("DBoperations");

/* GET test page. */
router.get('/', function(req, res, next) {
    DBoperation.getUserPage({login: "Test"}, res);
});

module.exports = router;