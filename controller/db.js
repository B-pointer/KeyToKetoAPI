const config = require('../config/config.js');
module.exports = require('knex')({
  client: 'mysql',
  connection: config.database
});
