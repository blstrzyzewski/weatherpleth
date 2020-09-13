export function createPolygon(lon, lat, size = 0.25) {
  let output = [];
  output.push([lon + size, lat + size]);
  output.push([lon + size, lat - size]);
  output.push([lon - size, lat - size]);
  output.push([lon - size, lat + size]);
  output.push([lon + size, lat + size]);
  return output;
}

export async function DataList(data, variable) {
  const size = variable === "sst" ? 0.5 : 0.25;

 
  let map = data.map((item) => {
    let polygon = createPolygon(item.lon, item.lat, size);

    return {
      type: "Feature",
      properties: { [variable]: item[variable] },
      geometry: {
        type: "Polygon",
        coordinates: [polygon],
      },
    };
  });

  return map;
}
