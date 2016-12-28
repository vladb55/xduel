var config = require('./knexfile');
var env = 'development';
var knex = require('knex');

module.exports = knex(config[env]);
