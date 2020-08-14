import axios from 'axios'
const {Dataset} = require('data.js');

const path = 'https://datahub.io/core/geo-ne-admin1/datapackage.json'


function streamToString (stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('error', reject)
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }
  
async function addFeature(geojson,month,year,variable){
  console.log('ssssssssssssssssssssssss',month,year,variable);
  const options={
    method: 'get',
    url: '/api/data_points',
    params:{
      data_var:variable,
    //dataset:value.value,
    month:month,
    year:year,
    min:95,
    max:2
    } 
  }
  console.log(options)
  const res= await axios(options);
  console.log(res.data)
    let entry_map={};

for await(const item of res.data){
    let name =item.location;
    let index=item.indexval;
    geojson.features[index].properties[variable.slice(0,3)]=item[variable.slice(0,3)];
}
return geojson;
}
export default async function getGJS(year,variable,month){
  console.log('llllllllll',year,variable);
  let geojsonId;
  if (variable=='sst_mean'){
    
    geojsonId='oceanSubdivisions'
  }
  else(geojsonId='countries')
  const options={
    method: 'get',
    url: '/api/geojson',
    params:{
    id:geojsonId,
    //dataset:value.value,
    month:'DEC',
    year:year,
    min:95,
    max:2
    } 
  }
  const res= await axios(options);

    console.log(res.data);
    let response= await addFeature(res.data,month.value,year,variable);

    return response;
    
}