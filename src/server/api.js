const express = require("express");
const makeDb = require("./database");
const router = express.Router();
const fs = require("fs-extra");
const db = makeDb();
router.get("/geojson", async (req, res) => {
  let id = req.query.id;

  const resultJSON = JSON.parse(
    fs.readFileSync(`./geojson/${id}.geojson`, "utf8")
  );

  res.send(resultJSON);
});

router.get("/data_points", async function (req, res) {
  let variable = req.query.data_var;
  let month = req.query.month;
  let year = parseInt(req.query.year);
  let sql = `SELECT * FROM  ${variable} WHERE year=${year} AND month='${month}' `;

  const response = await db.query(sql);
  res.send(response);
});

router.get("/data_points_by_coords", async function (req, res) {
  let variable = req.query.data_var;

  let month = req.query.month;
  let year = parseInt(req.query.year);
  let lon = [parseFloat(req.query.lon[0]), parseFloat(req.query.lon[1])];
  let lat = [parseFloat(req.query.lat[0]), parseFloat(req.query.lat[1])];
  let sql = `SELECT * FROM pre_named WHERE month='${month}' AND year=${year} AND lat>${lat[0]} AND lat<${lat[1]} AND lon>${lon[0]} AND lon<${lon[1]}`;

  const response = await db.query(sql);
  res.send(response);
});

router.get("/data_points_by_location", async function (req, res) {
  let variable = req.query.data_var;

  let month = req.query.month;
  let year = parseInt(req.query.year);
  let location = req.query.location;

  let sql = `SELECT * FROM ${variable}_named WHERE month='${month}' AND year=${year} AND location="${location}"`;

  const response = await db.query(sql);
  res.send(response);
});

module.exports = router;
