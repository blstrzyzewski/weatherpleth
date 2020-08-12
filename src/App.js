import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import DataList from './Components/get-data';
import MyMap from './Components/map';
import Selector from './Components/slider';


import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
type State = {
  lat: number,
  lng: number,
  zoom: number,
}

function App(){
  return(
    <div className='App'>
      <Selector />

    </div>
  )
}

export default App;
