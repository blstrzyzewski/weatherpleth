import React from "react";
import Home from "./Components/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import About from "./Components/about";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";
import "./index.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
