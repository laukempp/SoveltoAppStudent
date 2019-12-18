import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
export const Navigation = props => {
  return (

    <Navbar className="navbar bg-light">
      <Nav.Link eventKey={1} as={Link} to="/dashboard">
        <Nav.Item><h3 id="sovelto-red">{props.title}</h3></Nav.Item>
      </Nav.Link>
      <Nav.Item>
        <Nav.Link eventKey={1} as={Link} to="/dashboard/quiz">
          Quiz-esikatselu
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={2} as={Link} to="/dashboard/question">
          Luo kysymyksiä
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey={3} as={Link} to="/logout">
          Kirjaudu ulos
        </Nav.Link>
      </Nav.Item>
    </Navbar>


    /*  <Nav fill variant="tabs" defaultActiveKey="/dashboard">
   <Nav.Item>
     <Nav.Link href="/dashboard">Active</Nav.Link>
   </Nav.Item>
   <Nav.Item>
     <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>
   </Nav.Item>
   <Nav.Item>
     <Nav.Link eventKey="link-2">Link</Nav.Link>
   </Nav.Item>
   <Nav.Item>
     <Nav.Link eventKey="disabled" disabled>
       Disabled
     </Nav.Link>
   </Nav.Item>
 </Nav> */


  );
};

/* export default Navigation; */
