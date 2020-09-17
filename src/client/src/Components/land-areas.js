import axios from "axios";
import classybrew from "classybrew";
import { DataList } from "./get-data";

function classifyData(data) {
  let brew = new classybrew();
  brew.setSeries(data);
  brew.setNumClasses(5);
  brew.setColorCode(
    brew.getColorCodes()[Math.floor(Math.random() * Math.floor(20))]
  );
  brew.classify("jenks");
  return {
    colors: brew.getColors(),
    breaks: brew.getBreaks().map((item, index) => {
      if (index === 0) {
        return Math.trunc(item);
      }
      return Math.round(item);
    }),
  };
}
async function addFeature(geojson, month, year, variable) {
  ////console.log('ssssssssssssssssssssssss',month,year,variable);
  //named constructor

  const options = {
    method: "get",
    url: "/api/data_points",
    params: {
      data_var: variable,
      month: month,
      year: year,
    },
  };

  //console.log(options);
  const res = await axios(options);

  ////console.log(res.data)
  let entry_map = {};
  let dataValues = [];
  for await (const item of res.data) {
    let name = item.location;
    let index = item.indexval;
    geojson.features[index].properties[variable.slice(0, 3)] =
      item[variable.slice(0, 3)];
    dataValues.push(item[variable.slice(0, 3)]);
  }
  let returnObject = classifyData(dataValues);
  geojson.colors = returnObject.colors;
  geojson.breaks = returnObject.breaks;
  return geojson;
}
export async function getDataByCoords(center, variable, month, year, geojson) {
  const lon = [center[1] - 5, center[1] + 5];
  const lat = [center[0] - 5, center[0] + 5];
  const options = {
    method: "get",
    url: "/api/data_points_by_coords",
    params: {
      data_var: variable,
      month: month,
      year: year,
      lat: lat,
      lon: lon,
    },
  };
  console.log(options);
  const res = await axios(options);
  let featuresnew = await DataList(res.data);
  geojson.features = geojson.features.concat(featuresnew);
  return geojson;
}
export async function getDataByLocation(
  geojson,
  location,
  variable,
  month,
  year
) {
  const options = {
    method: "get",
    url: "/api/data_points_by_location",
    params: {
      data_var: variable,
      month: month,
      year: year,
      location: location,
    },
  };
  console.log(geojson.features.length);
  const res = await axios(options);
  let featuresnew = await DataList(res.data, variable);
  // console.log(featuresnew);
  geojson.features = featuresnew;
  console.log(geojson.features.length);
  return geojson;
}
export async function getGJS(year, variable, month) {
  //console.log("llsllllsllll", year, variable, month);
  let geojsonId;
  if (variable == "sst_mean") {
    geojsonId = "oceanSubNew";
  } else {
    geojsonId = "worldWithSubdivisionsSimp";
  }
  //console.log("sssssssssssssssssssssssssss", geojsonId);
  const options = {
    method: "get",
    url: "/api/geojson",
    params: {
      id: geojsonId,
    },
  };
  const res = await axios(options);

  //console.log(res.data);
  let response = await addFeature(res.data, month, year, variable);

  return response;
}
