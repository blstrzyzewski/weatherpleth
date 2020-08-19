import React, { Fragment } from "react";
import MyMap from "./map";
import Select from "react-select";
import ReactDOM from "react-dom";
import { Button, Container, Row, Col } from "shards-react";
import NavBar from "./navbar";
const dataset_options = [
  { value: 1995, label: "1995" },
  { value: 2011, label: "2011" },
  { value: "vanilla", label: "Vanilla" },
];
const variable_options = [
  { value: "pre_mean", label: "Precipitation" },
  { value: "sst_mean", label: "Sea temperature" },
  { value: "cld_mean", label: "Cloud coverage" },
  { value: "dtr_mean", label: "Diurnal temperature range" },
  { value: "frs_mean", label: "frost days" },
];
function Home() {
  const [state, setState] = React.useState();
  const [dataType, setDataType] = React.useState();
  const handleChange = (selectedOption) => {
    setDataType(selectedOption);
  };
  const handleYear = (selectedOption) => {
    setState(selectedOption);
  };
  //   const { selectedOption } = this.state;
  const renderMap = async () => {
    //DataList(dataType)

    ReactDOM.render(
      <MyMap values={{ dataType: dataType.value, name: dataType.label }} />,
      document.getElementById("root")
    );
  };
  return (
    <Fragment>
      <NavBar />
      <Container className="dr-example-container">
        <Row>
          <Col>
            <div id="home-div" style={{ marginTop: "8vh" }}>
              <h1 style={{ fontSize: "3.5em", lineHeight: 1.5 }}>
                Visualize global climatic datasets
              </h1>
              <h4 style={{ textAlign: "center" }}>
                Select a weather feature and hit submit
              </h4>
            </div>
          </Col>
          <Col>
            {" "}
            <div style={{ marginTop: "20vh" }}>
              {" "}
              <Select
                className="slider"
                id="dataset"
                onChange={handleChange}
                options={variable_options}
                style={{ width: 100, marginTop: "8vh" }}
                defaultValue={{ label: "Select a feature...", value: 0 }}
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            {" "}
            <div className="example">
              <Button size="lg" outline onClick={renderMap}>
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Home;
