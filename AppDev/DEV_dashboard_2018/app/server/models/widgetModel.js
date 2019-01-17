var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var widgetSchema = mongoose.Schema({
    service: String,
    name: String,
    param: {},
    refreshTime: String
});

module.exports = mongoose.model('Widget', widgetSchema);