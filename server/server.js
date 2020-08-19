const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();

const dotenv = require("dotenv");

const api = require("./api");
dotenv.config();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

//console.log(config)
//const db=makeDb(config)
async function gg() {
  let sql = 'SELECT * from sst WHERE year=1991 AND month="JAN" AND sst>25';
  const res = await db.query(sql);
  console.log(res);
}

app.use("/api", api);

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
