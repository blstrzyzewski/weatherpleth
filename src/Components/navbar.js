import React from "react";

import ReactDOM from 'react-dom';
import About from './about';
import Home from './slider'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,

  } from "shards-react";
function renderAbout(){
    ReactDOM.render(<About/>, document.getElementById('root'))
}
 
export default function NavBar() {
  return (
    
        <Navbar  type="dark"  expand="md"
        style={{color:"#121212 !important",borderBottom:"3px solid #EDEDED ",height:"8vh",minHeight:"60px"}}>
          <NavbarBrand href="#" onClick={()=>{ReactDOM.render(<Home/>, document.getElementById('root'))}}>WeatherMap</NavbarBrand>
         
          
            <Nav  navbar>
              <NavItem> 
                <NavLink active href="#" onClick={()=>{ReactDOM.render(<About/>, document.getElementById('root'))}}>
                  About
                </NavLink>
              </NavItem>
             
              
            </Nav>     
         
        </Navbar>
  );
}