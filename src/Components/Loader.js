import React, { Fragment } from "react";

function Loader() {
  return (
    <Fragment>
      <xml version="1.0" encoding="utf-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            margin: " 10% auto",
            background: "none",
            display: "block",
            shapeRendering: "auto",
          }}
          width="20vw"
          height="20vw"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <circle cx="31" cy="50" fill="#009494" r="19">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1.8518518518518516s"
              keyTimes="0;0.5;1"
              values="31;69;31"
              begin="-0.9259259259259258s"
            ></animate>
          </circle>
          <circle cx="69" cy="50" fill="#ededed" r="19">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1.8518518518518516s"
              keyTimes="0;0.5;1"
              values="31;69;31"
              begin="0s"
            ></animate>
          </circle>
          <circle cx="31" cy="50" fill="#009494" r="19">
            <animate
              attributeName="cx"
              repeatCount="indefinite"
              dur="1.8518518518518516s"
              keyTimes="0;0.5;1"
              values="31;69;31"
              begin="-0.9259259259259258s"
            ></animate>
            <animate
              attributeName="fill-opacity"
              values="0;0;1;1"
              calcMode="discrete"
              keyTimes="0;0.499;0.5;1"
              dur="1.8518518518518516s"
              repeatCount="indefinite"
            ></animate>
          </circle>
        </svg>
      </xml>
    </Fragment>
  );
}
export default Loader;
