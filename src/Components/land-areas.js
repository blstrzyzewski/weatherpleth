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
  
async function addFeature(geojson){
  const options={
    method: 'get',
    url: '/api/data_points',
    params:{
    //dataset:value.value,
    month:'DEC',
    year:2012,
    min:95,
    max:2
    } 
  }
  const res= await axios(options);
  console.log(res.data)
    let entry_map={};
  for await(const [index,item ]of geojson.features.entries()){
   // console.log(item.properties.name,index)
    entry_map[item.properties.name]=index;
  }
for await(const item of res.data){
    let name =item.location;
    let index=entry_map[name];
    geojson.features[index].properties["cld"]=item.cld;
}
return geojson;
}
export default async function getGJS(){
    
    const dataset = await Dataset.load(path);
    let file=dataset.resources[2];
    const stream = await file.stream();
    const result = await streamToString(stream);
    let resultJSON=JSON.parse(result);
    let response= await addFeature(resultJSON);

    return response;
    
}