var express = require('express');
var router = express.Router();

/* GET test page. */
router.get('/', function(req, res, next) {
  res.render('test', {
    user: {
        login: "Test",
        name: "Василий",
        surname: "Иванов",
        date: "23-08-1985",
        city: "Одесса",
        email: "vasil@example.com"
    }
  });
});

module.exports = router;