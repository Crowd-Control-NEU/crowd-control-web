var username = require('os').userInfo().username;
var options = {
    development: {
        client: 'pg',
        connection: 'postgres://postgres:5432@localhost/' + username,
        pool : {
            min: 1,
            max:3
        }
      },
    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        pool : {
            min: 1,
            max:3
        }
      },
  };

var environment = process.env.NODE_ENV || 'development';
var config = options[environment];
module.exports = require('knex')(config);