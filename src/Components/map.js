import React, { Component, useState, useEffect, Fragment } from "react";
import ReactDOM from "react-dom";
import Select from "react-select";
import { Map, TileLayer, GeoJSON, MapControl, maxBounds } from "react-leaflet";
import NavBar from "./navbar";
import Control from "react-leaflet-control";
import getGJS from "./land-areas";
import { Button, Container, Row, Col } from "shards-react";
import { LatLngBounds } from "leaflet";
function highlightFeature(layer) {
  layer.openPopup();
}
function resetHighlight(layer) {
  layer.closePopup();
}
let colorArray = ["#ca0020", "#f4a582", "#f7f7f7", "#92c5de", "#0571b0"];
let colorArray2 = ["#08519c", "#3182bd", "#6baed6", "#bdd7e7", "#eff3ff"];
function getColor(d, rangeArray, colorArray) {
  return d > rangeArray[4]
    ? colorArray[0]
    : d > rangeArray[3]
    ? colorArray[1]
    : d > rangeArray[2]
    ? colorArray[2]
    : d > rangeArray[1]
    ? colorArray[3]
    : colorArray[4];
}
function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(10000)).toString();
}

function getFeatureOptions(rangeArray, colorArray) {
  return [
    { value: `> ${rangeArray[4]}`, label: colorArray[0] },
    { value: `${rangeArray[3]} - ${rangeArray[4]}`, label: colorArray[1] },
    { value: `${rangeArray[2]} - ${rangeArray[3]}`, label: colorArray[2] },
    { value: `${rangeArray[1]} - ${rangeArray[2]}`, label: colorArray[3] },
    { value: `${rangeArray[0]} - ${rangeArray[1]}`, label: colorArray[4] },
  ];
}

let featureMap = {
  pre: [0, 30, 60, 90, 120, "(mm/month)"],
  sst: [-2, 0, 10, 20, 30, "(ºC)"],
  cld: [0, 20, 40, 60, 80, "(%)"],
  dtr: [0, 5, 10, 15, 20, "(ºC)"],
  frs: [0, 5, 10, 15, 20, "/ month"],
};
const yearOptions = [
  { value: 2011, label: "2011" },
  { value: 2012, label: "2012" },
  { value: 2013, label: "2013" },
  { value: 2014, label: "2014" },
  { value: 2015, label: "2015" },
  { value: 2016, label: "2016" },
  { value: 2017, label: "2017" },
  { value: 2018, label: "2018" },
  { value: 2019, label: "2019" },
];
const areaOptions = [
  { value: "countriesWithSubdivisions", label: "Countries/subdivisions" },
  { value: "countries", label: "Countries" },
  { value: "USStates", label: "U.S. states" },
];
const variable_options = [
  { value: "pre_mean", label: "Precipitation" },
  { value: "sst_mean", label: "Sea temperature" },
  { value: "cld_mean", label: "Cloud coverage" },
  { value: "dtr_mean", label: "Diurnal temperature range" },
  { value: "frs_mean", label: "frost days" },
];
const monthOptions = [
  { value: "JAN", label: "January" },
  { value: "FEB", label: "February" },
  { value: "MAR", label: "March" },
  { value: "APR", label: "April" },
  { value: "MAY", label: "May" },
  { value: "JUN", label: "June" },
  { value: "JUL", label: "July" },
  { value: "AUG", label: "August" },
  { value: "SEP", label: "September" },
];
const style = {
  fillColor: "#F28F3B",
  weight: 2,
  opacity: 1,
  color: "white",
  dashArray: "3",
  fillOpacity: 0.5,
};

function MyMap(values) {
  console.log(values.values, "sssssssssssssssssssssssssss");
  if (values.values.name == "Diurnal temperature range") {
    values.values.name = "Diurnal temp. range";
  }

  const [states, setStates] = useState([]);
  const [key, setKey] = useState("");
  const [month, setMonth] = useState("JAN");
  const [year, setYear] = useState(2011);
  const [areas, setAreas] = useState("countriesWithSubdivisions");
  const [dataVar, setDataVar] = useState(values.values.dataType);
  const [name, setName] = useState(values.values.name);
  const [featureOptions, setFeatureOptions] = useState(
    getFeatureOptions(featureMap[dataVar.slice(0, 3)], colorArray)
  );
  const [loading, setLoading] = useState(true);
  let dataset;
  if (dataVar.slice(0, 3) == "sst") {
    dataset = "HadIsst";
  } else {
    dataset = "Cru - ts 4.03";
  }
  let rangeArray = featureMap[dataVar.slice(0, 3)];

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        console.log("states", states.length);

        const res = await getGJS(year, dataVar, month);
        setLoading(false);
        if (isMounted) {
          setStates(res);

          setFeatureOptions(getFeatureOptions(res.breaks, res.colors));
          console.log("FO", featureOptions);
        }
        if (states.length) {
        }
        setKey(getRandomInt(10000000));

        return () => {
          isMounted = false;
        };
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [month, year, dataVar]);

  const sty = function (feature) {
    return {
      fillColor: getColor(
        feature.properties[dataVar.slice(0, 3)],
        states.breaks,
        states.colors
      ),
      weight: 2,
      opacity: 1,
      color: "white",

      fillOpacity: 0.7,
    };
  };
  const position = [20, 0];
  //console.log(states)

  const handleVarChange = (selectedOption) => {
    console.log(selectedOption);
    setDataVar(selectedOption.value);
    setName(selectedOption.label);
  };
  function popupName(datatype, feature) {
    if (datatype == "sst") {
      return "";
    }
    return feature.properties.name;
  }

  return (
    <Fragment>
      <NavBar />
      {loading ? (
        <h1>Hi</h1>
      ) : (
        <Fragment>
          <Map
            className="map"
            center={position}
            // maxBounds= {[[40,-120],[40,120],[-40,120],[-40,-120]]}
            // maxBoundsViscosity= {'1.0'}
            zoom="1.5"
            style={{
              border: "2px solid white",
              height: "70vh",
              width: "70%",
              marginRight: "5% ",
              float: "right",
              display: "inline-block",
              marginTop: "7vh",
            }}
          >
            <TileLayer
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ"
              accessToken="pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ"
              id="mapbox/streets-v11"
            />
            <GeoJSON
              onEachFeature={(feature, layer) =>
                layer.bindPopup(
                  `${popupName(dataVar.slice(0, 3), feature)} \n ${
                    feature.properties[dataVar.slice(0, 3)]
                  } ${rangeArray[5]}`
                )
              }
              key={key}
              data={states}
              style={sty}
            />
            <Control position="bottomright">
              <div className="legend" style={{ backgroundColor: "white" }}>
                <h6 style={{ textTransform: "capitalize" }}>
                  {" "}
                  {`${name} ${rangeArray[5]}`}
                </h6>
                {featureOptions.map((item) => {
                  return (
                    <Fragment>
                      <i style={{ backgroundColor: item.label }}></i>
                      {item.value}
                      <br></br>
                    </Fragment>
                  );
                })}
              </div>
            </Control>
          </Map>
          <div
            style={{
              width: "10%",
              margin: "auto",
              display: "inline-block",
              marginTop: "7vh",
            }}
          >
            <Row>
              <Col>
                <Select
                  className="map-dropdown"
                  id="month"
                  // value={selectedOption}
                  onChange={(selectedOption) => {
                    setMonth(selectedOption.value);
                  }}
                  options={monthOptions}
                  defaultValue={{ label: "January", value: "JAN" }}
                />
              </Col>
              <Col>
                <Select
                  className="map-dropdown"
                  id="month"
                  // value={selectedOption}
                  onChange={(selectedOption) => {
                    setYear(selectedOption.value);
                  }}
                  options={yearOptions}
                  defaultValue={{ label: "2011", value: 2011 }}
                />
              </Col>
              <Col>
                <Select
                  className="map-dropdown"
                  id="month"
                  // value={selectedOption}
                  onChange={handleVarChange}
                  options={variable_options}
                  defaultValue={{
                    label: values.values.name,
                    value: values.values.dataType,
                  }}
                />
              </Col>
              <Col>
                <Select
                  className="map-dropdown"
                  id="month"
                  // value={selectedOption}
                  onChange={(selectedOption) => {
                    setAreas(selectedOption.value);
                  }}
                  options={areaOptions}
                  defaultValue={{
                    label: "Countries/subivisions",
                    value: "countriesWithSubdivisions",
                  }}
                />
              </Col>
            </Row>
          </div>

          <div style={{ height: "100px" }}></div>
          <p style={{ textAlign: "center" }}>Dataset used: {dataset}</p>
        </Fragment>
      )}
    </Fragment>
  );
}
/*
    return(
        map(states.features)
    )

*/

export default MyMap;
