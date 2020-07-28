// +---------+----------------------------------------------------------
// | Notes   |
// +---------+

/*
This file, navBarLoggedOut.js, creates the navigation bar for users
who are not signed in. The navigation bar is returned by the
function Header.
*/

// +---------+----------------------------------------------------------
// | Imports |
// +---------+

import React, { useState } from "react";
import FacebookIcon from "./../design/icons/icons8-facebook-30.png";
import GoogleIcon from "./../design/icons/icons8-google-48.png";
import MistLogo from "./../design/Logos/logoFinal.png";
import {Link} from "react-router-dom";
import {
  Navbar, Nav, NavDropdown, Form, Image, InputGroup,
  FormControl, Button, NavLink
} from "react-bootstrap";
import "./../design/styleSheets/navBar.css";
import "bootstrap/dist/css/bootstrap.css";

// +---------+----------------------------------------------------
// | Header  |
// +---------+

/** Returns the whole header for logged out users */
function Header(props) {
  return (
    <div>
      <Navbar variant="dark" expand="lg" className="navigationBar">
        <Logo />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <NavBarCenter />
        </Navbar.Collapse>
        <Search />
      </Navbar>
    </div>
  );
};

function Logo() {
  return (
    <Link to="/" style={{width: "5%"}}>
      <img src={MistLogo} alt="MIST Logo" style={{maxWidth: "100%"}}></img>
    </Link>
  );
}

function Search() {
  return (
    <div>
      <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        <Button variant="outline-light" className="searchButton">
          Search
        </Button>
      </Form>
    </div>
  );
}

// +-----------------------+------------------------------------
// | Center Part of NavBar |
// +-----------------------+

/*
NavBarCenter returns the center portion of the Header depending on the mode.
The three modes are "default", "signIn", and "user".
The default mode is "default".
The mode changes to "signIn" when the user clicks on the Sign In/Up option.
The mode changes to "user" when the user signs in.

There is a problem: If a user is signed in and moves to another page, the 
NavBarCenter goes back to the "default" mode.
*/
function NavBarCenter() {

  const [mode, setMode] = useState("default");
  function handleSignInClick() { setMode("signIn") };
  function handleCancelClick() { setMode("default") };

  if (mode === "default") {
    return (
      <Nav className="mr-auto">
        <DefaultCenter />
        <SignInUpButton onClick={handleSignInClick} />
      </Nav>
    );
  } else {
    return (
      <Nav className="mr-auto">
        <SignInCenter />
        <SignInButton onClick={handleSignInClick} />
        <SignUpButton />
        <CancelButton onClick={handleCancelClick} />
      </Nav>
    );
  }
}

// +--------------+------------------------------------
// | Default Mode |
// +--------------+

/* DefaultCenter contains links for Create, Challenges, Tutorial, Gallery, and About.*/
function DefaultCenter() {
  return (
    <Nav>
      <Nav.Link href="/createWorkspace">Create</Nav.Link>
      <Nav.Link href="/challenges">Challenges</Nav.Link>
      <Nav.Link href="/tutorial">Tutorial</Nav.Link>
      <Nav.Link href="/gallery">Gallery</Nav.Link>
      <NavDropdown title="About" id="basic-nav-dropdown">
        <NavDropdown.Item href="/about">About MIST</NavDropdown.Item>
        <NavDropdown.Item href="/development">Development</NavDropdown.Item>
        <NavDropdown.Item href="/community">Community Guidelines</NavDropdown.Item>
        <NavDropdown.Item href="/faq">FAQ</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

function SignInUpButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Sign In / Up
      </Nav.Link>
    </Nav>
  );
}

// +--------------+------------------------------------
// | SignIn Mode  |
// +--------------+


/* Base of the SignIn navigation bar -- Icons + Forms (Inputs, Remember Check) */

function SignInCenter() {
  return (
    <Nav>
      <Image src={GoogleIcon} alt="MIST Logo" className="navBarIcon"></Image>
      <Image src={FacebookIcon} alt="MIST Logo" className="navBarIcon"></Image>
      <Nav.Link eventKey="disabled" disabled> OR </Nav.Link>

      {/* type in labels (email + password) */}
      <Form inline>
        <Form.Label htmlFor="inlineFormInputName2" srOnly>
          className
        </Form.Label>
        <Form.Control
          className="mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="E-mail"
        />
        <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
          Email
        </Form.Label>
        <InputGroup className="mb-2 mr-sm-2">
          <FormControl
            id="inlineFormInputGroupUsername2"
            type="password"
            placeholder="Password"
          />
        </InputGroup>

        {/* Remember Me checkbox */}
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            id="customCheck1"
          />
          <label class="custom-control-label" for="customCheck1" variant="dark">
            Remember Me
          </label>
        </div>
      </Form>
    </Nav>
  );
}



/* Sign in button */
function SignInButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Sign In
      </Nav.Link>
    </Nav>
  );
}

/* Sign up button */
function SignUpButton(props) {
  return (
    <Nav>
      <Nav.Link href="/signUp" onClick={props.onClick}>
        Sign Up
      </Nav.Link>
    </Nav>
  );
}

/* Cancel up button */
function CancelButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Cancel
      </Nav.Link>
    </Nav>
  );
}

export default Header;