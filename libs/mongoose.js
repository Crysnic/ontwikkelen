var mongoose = require('mongoose');
var config = require('../config');
var assert = require('assert');

mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;