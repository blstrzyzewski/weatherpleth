const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const mysql=require('mysql');
const util = require('util');
const dotenv=require('dotenv')
dotenv.config();
const app = express();

const {Dataset} = require('data.js');

const path = 'https://datahub.io/core/geo-ne-admin1/datapackage.json'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);




function makeDb( config ) {
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
const config={
host: process.env.DB_HOST,
user: "root",
password: process.env.DB_PASSWORD,
database:"weather_db"
}
console.log(config)
const db=makeDb(config)
async function gg(){
  let sql='SELECT * from sst WHERE year=1991 AND month="JAN" AND sst>25'
  const res=await db.query(sql)
  console.log(res);

}



app.get('/api/greeting', (req, res) => {
  const name = req.query.name || 'World';
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ greeting: `Hello ${name}!` }));
});

app.get('/api/test',async (req,res)=>{
  console.log('route_working')
 // res.send({"data":"Sdfasdf"})
  let sql='SELECT * from sst WHERE year=1991 AND month="JAN" AND sst>25'
  const response= await db.query(sql)
  res.send(response)
  


})
app.get('/api/data_points',async function(req,res){
  //let dataset=req.query.dataset;
  //console.log(dataset)
  
  let month= req.query.month;
  let year = parseInt(req.query.year)
  let min = parseInt(req.query.min);
  let max= parseInt(req.query.max);
 // let sql= `SELECT * FROM precipitation2 WHERE year=${year} AND month='${month}' AND pre>${min} AND pre<${max}`
    let sql= `SELECT * FROM  cld_mean WHERE year=${year} AND month='${month}' `

  const response= await db.query(sql)
  console.log(response);
  res.send(response)
})


app.get('/api/geojson',async function(req,res){

      const gjs=await getGJS();
      //console.log(gjs);
      res.send('test')



});


function streamToString (stream) {
  console.log('begin stream function')
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }
  

async function getGJS(){
    console.log('begin gjs')
    const dataset = await Dataset.load(path);
    let file=dataset.resources[2];
    const stream = await file.stream();
    const result = await streamToString(stream);
    console.log('post stream gjs')
    
   

    return result;
    
}
app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
