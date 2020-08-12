const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');
const fs = require('fs');

console.time('condense');





console.timeEnd("condense");


const ncdf = require('netcdfjs')
const mysql=require('mysql')
const express = require('express'); 
const util= require("util");
const { query } = require('express');
const { create } = require('domain');
//const data = fs.readFileSync('cru_ts4.03.2011.2018.cld.dat.nc');
//let reader = new ncdf(data); 
let config={
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database:"weather_db"
};

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
const db=makeDb(config)

function latLonArray(reader){
  let lon,lat;
  try{ 
      lon=reader.getDataVariable('lon');
      lat=reader.getDataVariable('lat');
  }
  catch{
      lon=reader.getDataVariable('longitude');
      lat=reader.getDataVariable('latitude');
  }
  const f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
  const cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;
  return cartesian(lat,lon)
}

function processNC(filepath,varname){
  const data=fs.readFileSync(filepath);
  let reader = new ncdf(data); 
  const latlon=latLonArray(reader);
  const feature=reader.getDataVariable(varname);
  return{
    "latlon":latlon,
    "values":feature
  }
}

async function run(nc_filepath,gj_filepath,varname){
  
  const nc_obj=processNC(nc_filepath,varname);
  //console.log(nc_obj);
  const named_map=getLocations(gj_filepath,nc_obj.latlon);
  console.log(named_map);
  const entry_map=getJSONIndex(named_map.geojson);
  await addToDB(nc_obj.values,named_map.names,entry_map);



}


function getLocations(jsonPath,latLonArray){
  const resultJSON= JSON.parse(fs.readFileSync(jsonPath,'utf8'));
  const glookup = new GeoJsonGeometriesLookup(resultJSON);
  let named_map={};
  for (const [index,coordinate] of latLonArray.entries() ){
    const point1 = {type: "Point", coordinates: [coordinate[1], coordinate[0]]};
    const out=glookup.getContainers(point1);
   
    if(out.features.length){
     // console.log('in here')
      let name=out.features[0].properties.name;
      if (name in named_map){
      named_map[name].push(index);
      }
      else{
        named_map[name]=[index]
      }
    }
  } 
return {"names":named_map,"geojson":resultJSON};
}


function getJSONIndex(geojson){
let entry_map={};
for (const [index,item]of geojson.features.entries()){
  // console.log(item.properties.name,index)
   entry_map[item.properties.name]=index;
 }

return entry_map;
}



let sql_array=[];
const month_array=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

function getMeanValues(named_map,month,entry_map,index){
  let sql_array=[];
  const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
  for (const location in named_map){
     //console.log(location);
     
     let value_array=[];
     let month_string=month_array[index%12]
     value_array.length=0;
     let year= 2011+ (index - index%12)/12; 
     let mean_cld=0;
     
       for(const inner_index of named_map[location]){
         
         let cld_value=month[inner_index];
             
         if (cld_value<1000){
          value_array.push(cld_value)
         }
       }
       mean_cld=arrAvg(value_array)
      
      
      // console.log(temp_array);
      if (location!='null' && !isNaN(mean_cld)){
       sql_array.push([location,mean_cld,month_string,year,entry_map[location]]);
      }
   }
   return sql_array;
}

async function addToDB(dataset,named_map,entry_map){
  console.log(dataset.length);
  for (const [index,month] of dataset.entries()){

    let sql_array=getMeanValues(named_map,month,entry_map,index);
    let sql = "INSERT INTO `cld_mean` (location, cld, month, year, indexval) VALUES ?"
    const res= await db.query(sql, [sql_array]);
    console.log(res)
    sql_array.length=0;


  }

}

async function createTable(){

  await db.query("DROP TABLE IF EXISTS cld_mean")
   var sql = "CREATE TABLE cld_mean (id INT AUTO_INCREMENT PRIMARY KEY, location VARCHAR(48),cld FLOAT(24),month CHAR(3), year SMALLINT(4), indexval INT(10))";
   const res= await db.query(sql)
   run('cru_ts4.03.2011.2018.cld.dat.nc','USStates.geojson','cld');
}

async function getEntries(){
  const response= await db.query("SELECT * FROM cld_mean ")
    
    console.log(response);
}

//getEntries();

//createTable();





