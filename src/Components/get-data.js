import React, {useState} from 'react';
import axios from 'axios';

function categorize(value){

  if (value>80){
    return "high"
  }
  if(value>40){
    return "medium"
  }
  return "low"

}
function getAverage(arr){
  let output=[]
  for (let i=0;i<arr.length/4;i+=4){
    
    let average=0;
    let lon_av=0;
    let lat_av=0;

    for(let j=0;j<4;j++){
     
      let item=arr[i+j];
      console.log(item.lon,item.lat)
      lon_av+=item.lon;
      lat_av+=item.lat;
      average+=item.sst;
    }
    output.push({"sst":average/4,"lon":lon_av/4,"lat":lat_av/4})
  }
  return output;
}
function createPolygon(lon,lat){
  let output=[]
  output.push([lon+0.25,lat+0.25]);
  output.push([lon+0.25,lat-0.25]);   
  output.push([lon-0.25,lat-0.25]);
  output.push([lon-0.25,lat+0.25]);
  output.push([lon+0.25,lat+0.25]);
  return output;
}

export default async function DataList(value){

    //const [state,setState] =useState();
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
    const res= await axios(options)
    
    let map=res.data.map((item)=>{
        if (item.lat>90 || item.lat<-90){console.log("wrong")}
        let polygon = createPolygon(item.lon,item.lat);
           // console.log(polygon);
        return {
              "type": "Feature",
              "properties": {"precipitation": categorize(item.cld)},
              "geometry": {
                  "type": "Polygon",
                  "coordinates": [polygon]
  
                  
              }
      
          }
        });
    
    return map;

}


