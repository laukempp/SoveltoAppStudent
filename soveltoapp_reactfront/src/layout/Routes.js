import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "../components/teacher/Login";
import Dashboard from "../components/teacher/Dashboard";
import Questionform from "../components/teacher/Questionform";
//import MainWebSocket from '../components/student/MainWebSocket'
/*import Wait from "../components/student/Wait";*/
import Quiz from "../components/student/Quiz";
import Logout from "../components/teacher/Logout";
import Result from "../components/student/Result";
import { StoreProvider } from "../context/StoreContext";


const Routes = () => (

  <StoreProvider>
  <Router>
    <Switch>
      <Route exact path="/">{<Redirect to="/login" />}</Route> 
      <Route exact path="/login" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/question" component={Questionform} />
      <Route exact path="/student/quiz" render={props => <Quiz {...props} />} />
      <Route exact path="/student/results" component={Result} />
      <Route exact path="/logout" component={Logout} />
      <Route component={Login} />
    </Switch> 
  </Router>
  </StoreProvider>
);

export default Routes;
