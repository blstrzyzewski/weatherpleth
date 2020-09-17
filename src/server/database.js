const promisify = require("util.promisify");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

function makeDb() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
  const connection = mysql.createPool(config);
  return {
    query(sql, args) {
      return promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return promisify(connection.end).call(connection);
    },
  };
}

module.exports = makeDb;
