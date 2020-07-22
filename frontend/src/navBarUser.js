//Navigation bar when logged in

import React from "react";
import "./styleSheets/navBar.css";

/* Imports for images / logos */
import MistLogo from "./Logos/Negative/negative40.png";

/* Imports for bootstrap */
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  NavLink,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

/**
 * returns the whole header
 */

const UserHeader = (props) => {

  return (
    <div>
      {/* variant is the styling of it, see more on bootstrap */}
      <Navbar variant="dark" expand="lg" className="navigationBar">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavBar />
          </Nav>
          <Search />
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

/**
 *  returns the logo
 */
function Logo() {
  return (
    <NavLink to="/">
      <img src={MistLogo} alt="MIST Logo"></img>
    </NavLink>
  );
}

/**
 * returns the searchBar
 */
function Search() {
  return (
    <div>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />

        {/* variant is the styling of it, see more on bootstrap */}
        <Button variant="outline-light" className="searchButton">
          Search
        </Button>
      </Form>
    </div>
  );
}

/* Base Nav Bar */

/* First part of the base navigation Bar (Create, Challenges, Tutorial, Gallery, About and its dropdowns) */
function NavBar() {
  return (
    <Nav>
      <Nav.Link href="/createWorkspace">Create</Nav.Link>
      <Nav.Link href="/challenges">Challenges</Nav.Link>
      <Nav.Link href="/tutorial">Tutorial</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
      <NavDropdown title="About" id="basic-nav-dropdown">
        <NavDropdown.Item href="/about">About MIST</NavDropdown.Item>
        <NavDropdown.Item href="/development">Development</NavDropdown.Item>
        <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="Account" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <SignOutButton />
      </NavDropdown>
    </Nav>
  );
}

/* User Nav Bar */

/* Username button (dropdown) */
/*
function UserButton(props) {
  return (
    <NavDropdown title="Account" id="basic-nav-dropdown">
      <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
      <NavDropdown.Divider />
      <SignOutButton />
    </NavDropdown>
  );
}
*/

/* Sign Out Bar */

function SignOutButton(props) {
  return (
    <NavDropdown.Item href="#" onClick={props.onClick}>
      Sign Out
    </NavDropdown.Item>
  );
}

export default UserHeader;
