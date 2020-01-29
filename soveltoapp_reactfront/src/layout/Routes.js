import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Quiz from "../components/student/Quiz";
import Result from "../components/student/Result";
import { StoreProvider } from "../context/StoreContext";


const Routes = () => (

  <StoreProvider>
  <Router>
    <Switch>
     
      <Route exact path="/student/quiz/:teacher_badge/" render={props => <Quiz {...props} />} />
      <Route exact path="/student/:teacher_badge/results" component={Result} />
      
      <Route component={Quiz} />
    </Switch> 
  </Router>
  </StoreProvider>
);

export default Routes;
