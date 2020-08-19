import React, { Fragment } from "react";
import NavBar from "./navbar";

export default function About() {
  return (
    <Fragment>
      <NavBar />
      <div style={{ marginTop: "3vh" }}></div>
      <h1>About</h1>
      <div style={{ marginTop: "50px" }}></div>
      <div style={{ width: "80vw", margin: "auto" }}>
        <h4>
          This web app was created as a visulization tool for various climatic
          datasets
        </h4>
        <h4>
          Mean values for areas were calculated as an average of values for
          latitude and longitude points that are in that area{" "}
        </h4>
        <h4>
          The datasets used were the{" "}
          <a href="https://crudata.uea.ac.uk/cru/data/hrg/cru_ts_4.03/">
            Cru -ts 4.03
          </a>{" "}
          dataset, and the{" "}
          <a href="https://www.metoffice.gov.uk/hadobs/hadisst/">HadISST </a>
          dataset
        </h4>
      </div>
    </Fragment>
  );
}
