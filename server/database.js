const util = require('util');
const mysql = require ('mysql');
const dotenv = require('dotenv');
dotenv.config();

function makeDb( ) {
    const config={
        host: process.env.DB_HOST,
        user: "root",
        password: process.env.DB_PASSWORD,
        database:"weather_db"
        }
    const connection = mysql.createConnection( config );
    return {
      query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        return util.promisify( connection.end ).call( connection );
      }
    };
  }

  module.exports = makeDb