import React from "react";
import {Route, Switch} from "react-router-dom";
import Widgets from "./Widgets";
import Metrics from "./Metrics";
import Dashboard from "./dashboard";
import Layouts from "./Layouts";
import asyncComponent from "../../util/asyncComponent";

const Main = ({match}) => (
  <Switch>
    {/* <Route path={`${match.url}/dashboard`} component={Dashboard}/> */}
  </Switch>
);

export default Main;
