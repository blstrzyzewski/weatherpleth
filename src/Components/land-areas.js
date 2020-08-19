import axios from "axios";
import classybrew from "classybrew";

function classifyData(data) {
  let brew = new classybrew();
  brew.setSeries(data);
  brew.setNumClasses(5);
  brew.setColorCode("BuGn");
  brew.classify("jenks");
  return {
    colors: brew.getColors(),
    breaks: brew.getBreaks().map((item) => {
      return Math.round(item);
    }),
  };
}
async function addFeature(geojson, month, year, variable) {
  //console.log('ssssssssssssssssssssssss',month,year,variable);
  const options = {
    method: "get",
    url: "/api/data_points",
    params: {
      data_var: variable,
      month: month,
      year: year,
    },
  };
  console.log(options);
  const res = await axios(options);
  //console.log(res.data)
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
export default async function getGJS(year, variable, month) {
  console.log("llsllllsllll", year, variable, month);
  let geojsonId;
  if (variable == "sst_mean") {
    geojsonId = "oceanSubNew";
  } else {
    geojsonId = "worldWithSubdivisionsSimp";
  }
  console.log("sssssssssssssssssssssssssss", geojsonId);
  const options = {
    method: "get",
    url: "/api/geojson",
    params: {
      id: geojsonId,
    },
  };
  const res = await axios(options);

  console.log(res.data);
  let response = await addFeature(res.data, month, year, variable);

  return response;
}
