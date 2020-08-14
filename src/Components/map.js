import React, {Component, useState, useEffect, Fragment} from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import {Map, TileLayer,GeoJSON, MapControl} from "react-leaflet";
import Choropleth from 'react-leaflet-choropleth';
import Control from "react-leaflet-control";
import getGJS from './land-areas';
function highlightFeature(layer) {
    



layer.openPopup();
}
function resetHighlight(layer) {
    
    layer.closePopup();

}
function getColor(d,rangeArray) {

    return d > rangeArray[4] ? '#08519c':
           d > rangeArray[3] ? '#3182bd':
           d > rangeArray[2] ? '#6baed6':
           d > rangeArray[1] ? '#bdd7e7':
                             '#eff3ff';
}
function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(10000)).toString();
  }

  function getFeatureOptions(rangeArray){
    return[
        { value: `> ${rangeArray[4]}`, label: '#08519c' },
        { value: `${rangeArray[3]} - ${rangeArray[4]}`, label: '#3182bd' },
        { value: `${rangeArray[2]} - ${rangeArray[3]}`, label: '#6baed6' },
        { value: `${rangeArray[1]} - ${rangeArray[2]}`, label: '#bdd7e7' },
        { value: `${rangeArray[0]} - ${rangeArray[1]}`, label: '#eff3ff' },
    
      ]
  }

let feature_map={
    "pre":[0,30,60,90,120],
    "sst":[-2,0,10,20,30],
    "cld":[0,20,40,60,80]
}
  const month_options = [
    { value: 'JAN', label: 'January' },
    { value: 'FEB', label: 'February' },
    { value: 'MAR', label: 'March' },
    { value: 'APR', label: 'April' },
    { value: 'MAY', label: 'May' },
    { value: 'JUN', label: 'June' },
    { value: 'JUL', label: 'July' },
    { value: 'AUG', label: 'August' },
    { value: 'SEP', label: 'September' },
  ];
  const style = {
    fillColor: '#F28F3B',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.5
    }

function MyMap(values){
    console.log(values);
    
    const data_var=values.values.dataType.slice(0,3);
    let range_array=feature_map[data_var];
    let feature_options=getFeatureOptions(range_array);
    const [states,setStates]=useState([]);
    const [key,setKey]=useState('');
    const [month,setMonth]=useState({'value':'JAN'});
    const handleChange = selectedOption => {
        setMonth(selectedOption)
        
        };
        const handleText = selectedOption => {
            setKey(selectedOption)
            
            };
        const map = (geojson) => (   <Map className='map'
        center={position}
        zoom='1'
        style={{height:"60vh",width:"90%",margin:"5% auto"}}>

<Choropleth
key={getRandomInt()}
  data={{type: 'FeatureCollection', features: geojson}}
  valueProperty={(feature) => feature.properties[data_var]}
  
  scale={['#b3cde0', '#011f4b']}

  
  steps={7}
  mode='e'
  style={style}
  onEachFeature={(feature, layer) => layer.bindPopup(`${feature.properties.name} ${feature.properties[data_var]}`)}
 
 
/>
<Control position="bottomright">
          <h6> Cloud Coverage</h6>
          <p>0.9-1.0</p>
        </Control>
</Map>
 )
    useEffect( () => {
        const fetchData=async () => {
            try{
            //const res= await DataList();
            const res=await getGJS(values.values.year,values.values.dataType,month);
            console.log('resssssssssssssss',res)
            setStates(res)
            setKey(getRandomInt(10000000));
            console.log(states);
          //  ReactDOM.render(map(res.features), document.getElementById('root'))
            }
            catch(err){
                console.log(err)
            }
        }
           fetchData(); 
        },[month])
    
    
    const sty=function(feature) {
        return {
            fillColor: getColor(feature.properties[data_var],range_array),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
        }
    const position=[1.35,103.8];
    console.log(states)



return (
        <Fragment>
        <Map className="map"
        center={position}
        zoom='1'
        
            style={{height:"60vh",width:"90%",margin:"5% auto"}}

        >
            <TileLayer
                      attribution= 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                      url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ'
                      accessToken='pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ'
                      id='mapbox/streets-v11'
            />
            <GeoJSON 
            onEachFeature={(feature, layer) => layer.bindPopup(`${feature.properties.name} \n ${feature.properties[data_var]}`)}
            key={key} data={states} style={sty} />
            <Control
             position="bottomright"
             >
             <div className="legend" style={{backgroundColor:"white"}}>
          <h6 style={{textTransform:"capitalize"}}> {values.values.name}</h6>
          {feature_options.map((item)=> {
              return<Fragment><i style={{backgroundColor:item.label}}></i>{item.value}<br></br></Fragment>
              
          })}
        </div>  
        </Control>
            
        </Map>
        <Select
        className="map-dropdown"
        id='month'
         // value={selectedOption}
          onChange={handleChange}
          options={month_options}
          
        />
        </Fragment>
    )  
}
 /*
    return(
        map(states.features)
    )

*/

export default MyMap;