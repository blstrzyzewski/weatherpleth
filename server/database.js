const util = require("util");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

function makeDb() {
  const config = {
    host: process.env.CLEARDB_HOST,
    user: process.env.CLEARDB_USER,
    password: process.env.CLEARDB_PASSWORD,
    database: process.env.CLEARDB_DATABASE,
  };
  const connection = mysql.createPool(config);
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}

module.exports = makeDb;
