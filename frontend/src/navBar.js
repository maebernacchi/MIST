//Navigation Bar at the top of the page

import React from "react";
import "./styleSheets/navBar.css";

/* Imports for images / logos */
import MistLogo from "./design/Logos/Negative/negative40.png";
import FacebookIcon from "./icons/icons8-facebook-30.png";
import GoogleIcon from "./icons/icons8-google-48.png";

/* Imports for bootstrap */
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  NavLink,
  Image,
  InputGroup,
} from "react-bootstrap";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

/**
 * returns the whole header
 */

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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

/**  Returns the rest of the Header based on if:
 *       the user is in the base navigation   ----------- this is called the base navigation
 *       the user has clicked on the Sign in/up option ----------- this is called the sign in navigation
 *       the user has signed in ----------- this is called the user navigation
 * */
class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleBaseClick = this.handleBaseClick.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.state = { nav: "base" };
  }

  /* Handle Sign In / Sign Up button on click --> if clicked, change to sign In state */
  handleBaseClick() {
    this.setState({ nav: "signIn" });
  }

  /* Handle Sign In button on click --> if clicked, change to User state */
  handleSignInClick() {
    this.setState({ nav: "user" });
  }

  /* Handle Cancel button on click --> if clicked, change to Base state */
  handleCancelClick() {
    this.setState({ nav: "base" });
  }

  /* Handle Sing out button on click --> if clicked, change to Base state */
  handleSignOutClick() {
    this.setState({ nav: "base" });
  }

  render() {
    /* nav is the state of the nav (base case is that it is the base navigation bar) 
          this is problematic, because when one is signed in, and then go to another page
          it will go back to the base case*/

    const nav = this.state.nav;
    return (
      <div>
        {(() => {
          {
            /* if the user is in the base navigation bar
                 show the base navBar, and handle the singIn/Up button on click */
          }
          if (nav === "base") {
            return (
              <Nav className="mr-auto">
                <BaseNavBar />
                <SignInUpButton onClick={this.handleBaseClick} />
              </Nav>
            );

            {
              /* else if the user is in the singIn navigation Bar
                 show the Sign In navBar, and handle the SignIn, SignUp, and Cancel buttons on click */
            }
          } else if (nav == "signIn") {
            return (
              <Nav className="mr-auto">
                <SignInNavBar />
                <SignInButton onClick={this.handleSignInClick} />
                <SignUpButton />
                <CancelButton onClick={this.handleCancelClick} />
              </Nav>
            );

            {
              /* else if the user is in the user navigation bar
                 show the User navBar, and handle the Logout button on click  <--- this does not seem to work yet */
            }
          } else {
            return (
              <Nav className="mr-auto">
                <BaseNavBar />
                <NavDropdown title="username" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <SignOutButton onCLick={this.handleSignOutClick} />
                </NavDropdown>
              </Nav>
            );
          }
        })()}
      </div>
    );
  }
}

/* Base Nav Bar */

/* First part of the base navigation Bar (Create, Challenges, Tutorial, Gallery, About and its dropdowns) */
function BaseNavBar() {
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
    </Nav>
  );
}

/* SignInUp Button */
function SignInUpButton(props) {
  return (
    <Nav>
      <Nav.Link href="#" onClick={props.onClick}>
        Sign In / Up
      </Nav.Link>
    </Nav>
  );
}

/* Sign In Nav Bar */

/* Base of the SignIn navigation bar -- Icons + Forms (Inputs, Remember Check) */

function SignInNavBar() {
  return (
    <Nav>
      {/* Icons (Google and Facebook) on the sign in navbar*/}

      <NavLink to="/">
        <Image src={GoogleIcon} alt="MIST Logo" className="navBarIcon"></Image>
      </NavLink>
      <NavLink to="/">
        <Image
          src={FacebookIcon}
          alt="MIST Logo"
          className="navBarIcon"
        ></Image>
      </NavLink>

      {/* Or */}
      <Nav.Link eventKey="disabled" disabled>
        OR
      </Nav.Link>

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

/* User Nav Bar */

/* Username button (dropdown) */
function UserButton(props) {
  return (
    <NavDropdown title="username" id="basic-nav-dropdown">
      <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
      <NavDropdown.Divider />
      <SignOutButton />
    </NavDropdown>
  );
}

/* Sign Out Bar */

function SignOutButton(props) {
  return (
    <NavDropdown.Item href="#" onClick={props.onClick}>
      Sign Out
    </NavDropdown.Item>
  );
}

export default Header;
