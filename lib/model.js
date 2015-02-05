var cradle = require('cradle');
var c = new(cradle.Connection);
var db = c.database('eventsdb');

module.exports = db;
