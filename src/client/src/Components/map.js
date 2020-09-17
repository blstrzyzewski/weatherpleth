import React, { useState, useEffect, Fragment } from "react";
import Loader from "./Loader";
import Select from "react-select";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import NavBar from "./navbar";
import Control from "react-leaflet-control";
import { getGJS, getDataByCoords, getDataByLocation } from "./land-areas";
import { Row, Col, Button, Alert } from "shards-react";

function getColor(d, rangeArray, colorArray) {
  return d > rangeArray[4]
    ? colorArray[4]
    : d > rangeArray[3]
    ? colorArray[3]
    : d > rangeArray[2]
    ? colorArray[2]
    : d > rangeArray[1]
    ? colorArray[1]
    : colorArray[0];
}
function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(10000)).toString();
}

function getFeatureOptions(rangeArray, colorArray) {
  return [
    { value: `> ${rangeArray[4]}`, label: colorArray[4] },
    { value: `${rangeArray[3]} - ${rangeArray[4]}`, label: colorArray[3] },
    { value: `${rangeArray[2]} - ${rangeArray[3]}`, label: colorArray[2] },
    { value: `${rangeArray[1]} - ${rangeArray[2]}`, label: colorArray[1] },
    { value: `${rangeArray[0]} - ${rangeArray[1]}`, label: colorArray[0] },
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
  { value: 2014, label: "2014" },
  { value: 2015, label: "2015" },
  { value: 2016, label: "2016" },
  { value: 2017, label: "2017" },
  { value: 2018, label: "2018" },
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
  { value: "OCT", label: "October" },
  { value: "NOV", label: "November" },
  { value: "DEC", label: "December" },
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
  if (values.values.name == "Diurnal temperature range") {
    values.values.name = "Diurnal temp. range";
  }

  const [states, setStates] = useState([]);

  const [key, setKey] = useState("base");
  const [key2, setKey2] = useState("base2");
  const [month, setMonth] = useState("JAN");
  const [year, setYear] = useState(2014);
  const [updating, setUpdating] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [dataVar, setDataVar] = useState(values.values.dataType);
  const [name, setName] = useState(values.values.name);
  const [update, setUpdate] = useState(false);
  const [featureOptions, setFeatureOptions] = useState(null);
  const [statesZoom, setStatesZoom] = useState([]);
  const [loading, setLoading] = useState(true);
  let dataset;
  if (dataVar.slice(0, 3) == "sst") {
    dataset = "HadIsst";
  } else {
    dataset = "Cru - ts 4.03";
  }
  let rangeArray = featureMap[dataVar.slice(0, 3)];

  useEffect(() => {
    setUpdating(true);
    if (update) {
      console.log("op");
      if (update > 1) {
        setUpdate(0);
      }
      return;
    }
    let isMounted = true;
    const fetchData = async () => {
      try {
        ////console.log("states", states.length);

        const res = await getGJS(year, dataVar, month);
        setLoading(false);
        if (isMounted) {
          setStates(res);

          setFeatureOptions(getFeatureOptions(res.breaks, res.colors));
          //console.log("FO", featureOptions);
        }
        if (states.length) {
        }
        setKey(getRandomInt(10000000));
        setUpdating(false);
        return () => {
          isMounted = false;
        };
      } catch (err) {
        setDataError(true);
      }
    };
    fetchData();
  }, [month, year, dataVar, update]);

  const sty = function (feature) {
    return {
      fillColor: getColor(
        feature.properties[dataVar.slice(0, 3)],
        states.breaks,
        states.colors
      ),
      weight: 1,
      opacity: 0.5,
      color: "white",

      fillOpacity: 0.7,
    };
  };
  const styZoom = function (feature) {
    return {
      fillColor: getColor(
        feature.properties[dataVar.slice(0, 3)],
        states.breaks,
        states.colors
      ),
      weight: 0.1,
      opacity: 0.2,
      color: "white",

      fillOpacity: 0.5,
    };
  };

  const position = [20, 0];

  const handleVarChange = (selectedOption) => {
    setStatesZoom([]);
    setKey2(getRandomInt(100000));
    setDataVar(selectedOption.value);
    setName(selectedOption.label);
  };
  function popupName(datatype, feature) {
    if (datatype == "sst") {
      return "";
    }
    return feature.properties.name;
  }
  async function updategjs(geojson, variable, month, year, location) {
    const data = await getDataByLocation(
      geojson,
      location,
      variable,
      month,
      year
    );
    setStatesZoom(data);

    setKey2(getRandomInt(10000000));
  }

  return (
    <Fragment>
      <NavBar />
      {loading ? (
        <Loader />
      ) : dataError ? (
        <Alert>
          An error occured processing your request. Click{" "}
          <a href="https://weatherpleth.com"> here</a> to return to the
          homepage.
        </Alert>
      ) : (
        <Fragment>
          <Map
            className="map"
            center={position}
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
            {" "}
            {updating ? (
              <div id="jj">
                <h1>Updating...</h1>
              </div>
            ) : (
              <Fragment />
            )}{" "}
            <TileLayer
              attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ"
              accessToken="pk.eyJ1IjoiYnN0cnp5emV3c2tpIiwiYSI6ImNrZGV4MDI0ZDFtMnIyd2pxb3RsYTByb3QifQ.t63p1Ba9N2a4-Y1onqPusQ"
              id="mapbox/streets-v11"
            />
            <GeoJSON
              onclick={(e) => {
                let regionName = e.layer.feature.properties.name;
                let idName;
                if (typeof regionName != "string") {
                  idName = regionName.toString();
                  idName = "s" + idName;
                } else {
                  idName = regionName.replace(/\s+/g, "");
                  idName = idName.replaceAll(".", "-");
                }
                if (idName === "Côted'Ivoire") {
                  idName = "ivory-coast";
                }
                console.log(idName, regionName);
                document.querySelectorAll(`#${idName}`).forEach((item) => {
                  item.addEventListener("click", async (e) => {
                    setUpdating(true);
                    const data = await updategjs(
                      states,
                      dataVar.slice(0, 3),
                      month,
                      year,
                      regionName
                    );
                    setUpdating(false);
                  });
                });
              }}
              onEachFeature={(feature, layer) => {
                console.log(feature);
                let idName;
                if (dataVar.slice(0, 3) !== "sst") {
                  idName = feature.properties.name
                    .toString()
                    .replace(/\s+/g, "");
                  idName = idName.replaceAll(".", "-");
                } else {
                  idName = "s" + feature.properties.name.toString();
                }
                if (idName === "Côted'Ivoire") {
                  idName = "ivory-coast";
                }
                layer.bindPopup(
                  `${popupName(dataVar.slice(0, 3), feature)} \n ${
                    feature.properties[dataVar.slice(0, 3)]
                  } ${rangeArray[5]} \n 
                  <Button class='btn btn-outline-primary btn-sm pop-btn' id='${idName}' 
                   >Get fine data</Button>`
                );
              }}
              key={key}
              data={states}
              style={sty}
            />
            <GeoJSON
              onEachFeature={(feature, layer) =>
                layer.bindPopup(
                  ` ${feature.properties[dataVar.slice(0, 3)]} ${rangeArray[5]}`
                )
              }
              key={key2}
              data={statesZoom}
              style={styZoom}
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
          </Map>{" "}
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
                    setStatesZoom([]);
                    setKey2(getRandomInt(1000000));
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
                    setStatesZoom([]);
                    setKey2(getRandomInt(1000000));
                    setYear(selectedOption.value);
                  }}
                  options={yearOptions}
                  defaultValue={{ label: "2014", value: 2014 }}
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
            </Row>
          </div>
          <div style={{ height: "100px" }}></div>
          <p style={{ textAlign: "center" }}>Dataset used: {dataset}</p>
        </Fragment>
      )}
    </Fragment>
  );
}

export default MyMap;
