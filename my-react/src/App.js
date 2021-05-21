import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Lgoin from "./pages/login/index";
import Home from "./pages/home/index";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Lgoin}></Route>
          <Route path="/home" component={Home}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
