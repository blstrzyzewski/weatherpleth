import React from 'react';
import MyMap from './map';
import Select from 'react-select';
import ReactDOM from 'react-dom';
import { Button,Container,Row,Col } from "shards-react";
import DataList from './get-data'
const dataset_options = [
  { value: 'cruts', label: 'Cru ts' },
  { value: 'hadisst', label: 'Hadisst' },
  { value: 'vanilla', label: 'Vanilla' },
];
const variable_options=[
    {value:'pre',label:'Precipitation'},
    {value:'sst',label:'Sea temperature'},
    {value:'cld',label:'Cloud coverage'}
]
function Selector() {
    const[state,setState]=React.useState();
    const [dataType,setDataType]=React.useState()
    const handleChange = selectedOption => {
    setDataType(selectedOption)
    
    };
  
   //   const { selectedOption } = this.state;
    const renderMap= ()=>{
        //DataList(dataType)
        ReactDOM.render(<MyMap />, document.getElementById('root'))
    }
      return (
        <Container className="dr-example-container">
                  <Row>
          <Col><h1
          
          >Weather Map</h1></Col>
        </Row>
                  <Row>
                  
          <Col>       <Select
        className="slider"
        id='dataset'
         // value={selectedOption}
         // onChange={handleChange}
          options={dataset_options}
          style={{width:100}}
        /></Col>
          <Col>        <Select
        className="slider"
        id='variable'
         // value={selectedOption}
          onChange={handleChange}
          options={variable_options}
          style={{width:100}}
        /></Col>
        
        </Row>
        <Row>
          <Col> <div className="example">
                <Button size="lg" outline onClick={renderMap}>Primary</Button>
               
              </div></Col>
        </Row>
 

   
       
        
               
              </Container>
      );
    }

export default Selector;
  