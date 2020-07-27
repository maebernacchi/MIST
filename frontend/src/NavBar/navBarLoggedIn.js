// +---------+----------------------------------------------------------
// | Notes   |
// +---------+

/*
This file, navBarLoggedIn.js, creates the navigation bar for users
who are signed in. The navigation bar is returned by the
function UserHeader.
*/

// +---------+----------------------------------------------------------
// | Imports |
// +---------+

import "bootstrap/dist/css/bootstrap.css";
import MistLogo from "./../design/Logos/Negative/negative40.png";
import React from "react";
import { Navbar, Nav, NavDropdown, Form,
  FormControl, Button, NavLink} from "react-bootstrap";
import "./../design/styleSheets/navBar.css";

// +------------+----------------------------------------------------------
// | UserHeader |
// +------------+

function UserHeader(props) {
  return (
    <div>
      {/* variant is the styling of it, see more on bootstrap */}
      <Navbar variant="dark" expand="lg" className="navigationBar">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <NavBar />
        </Navbar.Collapse>
        <Search />
      </Navbar>
    </div>
  );
};

/**
 *  returns the logo
 */
function Logo() {
  return (
    <NavLink href="/">
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

/* Sign Out Bar */

function SignOutButton(props) {
  return (
    <NavDropdown.Item href="#" onClick={signout}>
      Sign Out
    </NavDropdown.Item>
  );
}


function signout() {
  fetch('/api/logout', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    },
    credentials: 'include'
  }).then(res => {
    window.location.href = "/";
  })
}

export default UserHeader;