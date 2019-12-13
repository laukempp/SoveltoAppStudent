import React from "react";
import Navbar from "react-bootstrap/navbar";
import Nav from "react-bootstrap/nav";
import { Link } from "react-router-dom";
const Navigation = props => {
  return (
    <div>
    <Navbar className="navbar bg-dark">
      <Nav.Link eventKey={1} as={Link} to="/dashboard">
           <Nav.Item><h3>{props.title}</h3></Nav.Item>
        </Nav.Link>
      <Nav.Item>
        <Nav.Link eventKey={1} as={Link} to="/dashboard/quiz">
          Quiz Preview
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={2} as={Link} to="/dashboard/question">
          Make a Question
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={3} as={Link} to="/profile">
          Edit Profile
        </Nav.Link>
      </Nav.Item>
      
     
    </Navbar>
    {/* <SearchPage /> */}
    </div>
  );
};

export default Navigation;
