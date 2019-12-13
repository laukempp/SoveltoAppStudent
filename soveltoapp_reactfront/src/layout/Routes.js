import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Login from "../components/teacher/Login";
import Dashboard from "../components/teacher/Dashboard";
import Preview from "../components/teacher/Preview";
import Questionform from "../components/teacher/Questionform";


const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/quiz" component={Preview} />
      <Route exact path="/dashboard/question" component={Questionform} />
      

    </Switch>
  </Router>
);

export default Routes;
