var express = require('express');
var router = express.Router();

/* GET test page. */
router.get('/', function(req, res, next) {
  res.render('test', {
    name: 'Владимир',
    surname: 'Удалых',
    birthdate: '11-11-1992',
    city: 'Днепропетровск',
    email: 'vovarx@gmail.com'
  });
});

module.exports = router;