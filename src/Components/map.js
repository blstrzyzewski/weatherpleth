import React, {Component, useState, useEffect} from 'react';
import {Map, TileLayer,GeoJSON} from "react-leaflet";
import DataList from './get-data'
import axios from 'axios';
import getGJS from './land-areas';

function getColor(d) {
    return d > 90 ? '#800026' :
           d > 70  ? '#BD0026' :
        
           d > 40  ? '#FC4E2A' :
          
          
           d > 10   ? '#FED976' :
                      '#FFEDA0';
  }
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)).toString();
  }
function MyMap(){
    
    const [states,setStates]=useState([]);
    const [key,setKey]=useState('');
   
    useEffect( () => {
        const fetchData=async () => {
            try{
            //const res= await DataList();
            const res=await getGJS();
            console.log('resssssssssssssss',res)
            setStates(res)
            setKey(`data rendered`);
            console.log(states);
            }
            catch{
                console.log("fatal error")
            }
        }
           fetchData(); 
        },[])
    
    
    const sty=function(feature) {
        return {
            fillColor: getColor(feature.properties.cld),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
        }
    const position=[1.35,103.8];
    console.log(states)
    return(
        <Map className="map"
        center={position}
        zoom='1'
        
            style={{height:400,width:"90%",margin:"5% auto"}}

        >
            <TileLayer
                      attribution= 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                      url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ'
                      accessToken='pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ'
                      id='mapbox/streets-v11'
            />
            <GeoJSON key={key} data={states} style={sty} />
        </Map>
    )
}
export default MyMap;