import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from "../components/teacher/Login";
import Dashboard from "../components/teacher/Dashboard";
import Questionform from "../components/teacher/Questionform";
import MainWebSocket from '../components/student/MainWebSocket'
/*import Wait from "../components/student/Wait";*/
import Quiz from "../components/student/Quiz";
import Logout from '../components/teacher/Logout';
import Result from "../components/student/Result";
const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/dashboard" component={Dashboard} />
      {/* <Route exact path="/dashboard/quiz" component={Preview} />*/}
      <Route exact path="/dashboard/question" component={Questionform} />
      <Route exact path="/student/" component={MainWebSocket} />
      <Route exact path="/student/wait" component={MainWebSocket} />
      <Route exact path="/student/quiz" component={Quiz} />
      <Route exact path="/student/results" component={Result} />
      <Route path="/logout" component={Logout} />
      <Route path="/dashboard/*" component={Dashboard} />
      <Route path="/student/*" component={MainWebSocket} />
      <Route component={Login} />
    </Switch>
  </Router>
);

export default Routes;