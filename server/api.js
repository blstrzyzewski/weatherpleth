const express=require("express");
const makeDb = require('./database');
const router= express.Router();
const fs = require('fs')
const db=makeDb();
router.get('/geojson',async (req,res)=>{
    console.log('route_working')
    let id=req.query.id;
   // res.send({"data":"Sdfasdf"})
   const resultJSON= JSON.parse(fs.readFileSync(`../geojson/${id}.geojson`,'utf8'));
    
    res.send(resultJSON);
    
  
  
  });

 router.get('/data_points',async function(req,res){
    
    
    let variable=req.query.data_var;
    console.log(variable);
    let month= req.query.month;
    let year = parseInt(req.query.year)
    let min = parseInt(req.query.min);
    let max= parseInt(req.query.max);
   // let sql= `SELECT * FROM precipitation2 WHERE year=${year} AND month='${month}' AND pre>${min} AND pre<${max}`
      let sql= `SELECT * FROM  ${variable} WHERE year=${year} AND month='${month}' `
    console.log(sql)
    const response= await db.query(sql)
    
    //console.log(response);
    res.send(response);
    
  })

  module.exports=router;