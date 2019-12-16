import React from "react";
import "./App.css";
import Routes from "./layout/Routes";
import { BrowserRouter as Router } from "react-router-dom";
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";

=======
import 'bootstrap/dist/css/bootstrap.min.css';
>>>>>>> 76494187114ca19ae2eca7292cbc7863ad5d1b49
function App() {
  return (
    <Router>
      <div className="App">
        <Routes />
      </div>
    </Router>
  );
}

export default App;
