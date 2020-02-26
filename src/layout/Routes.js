import React from "react";
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import NameForm from '../components/NameForm'
import Quiz from "../components/Quiz";
import Result from "../components/Result";
import { StoreProvider } from "../context/StoreContext";


const Routes = () => (

  <StoreProvider>
  <Router>
    <Switch> 
      <Route exact path= "/student/quiz/:quiz_author" render={props => <Quiz {...props} />} />
      <Route exact path="/student/c2quiz/:quiz_badge" render={props => <Quiz {...props} />} />
      <Route exact path="/student/f3quiz/:title" render={props => <Quiz {...props} />} />
      <Route exact path="/student/results" component={Result} />
      <Route exact path="/student/enter" render={props => <NameForm {...props} />} />        
      <Route component={NameForm} />
    </Switch> 
  </Router>
  </StoreProvider>
);

export default Routes;
