import React, { Fragment } from "react";
import NavBar from "./navbar";

export default function About() {
  return (
    <Fragment>
      <NavBar />
      <div style={{ marginTop: "30px" }}></div>
      <h1 style={{ color: "white !important" }}>About</h1>
      <div style={{ marginTop: "30px" }}></div>
      <div id="about-div">
        <h4 className="about-h4">
          This web app was created as a visulization tool for various climatic
          datasets.
        </h4>
        <hr></hr>
        <h4 className="about-h4">
          Mean values for areas were calculated as an average of values for
          latitude and longitude points that are in that area.{" "}
        </h4>
        <hr />
        <h4 className="about-h4">
          The datasets used were the{" "}
          <a href="https://crudata.uea.ac.uk/cru/data/hrg/cru_ts_4.03/">
            Cru -ts 4.03
          </a>{" "}
          dataset, and the{" "}
          <a href="https://www.metoffice.gov.uk/hadobs/hadisst/">HadISST </a>
          dataset.
        </h4>
        <hr />
        <h4 className="about-h4">
          Check out this project on{" "}
          <a href="https://github.com/blstrzyzewski/weatherpleth">Github</a> .
        </h4>
      </div>
      <div style={{ height: "30px" }}></div>
    </Fragment>
  );
}
