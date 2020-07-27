import React from 'react';
import './styleSheets/signInUp.css';
import FacebookIcon from './icons/icons8-facebook-30.png';
import GoogleIcon from './icons/icons8-google-48.png';

import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
  NavLink,
  Image,
  Col,
  FormGroup,
  InputGroup,
  Row,
  Container
} from 'react-bootstrap';

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const SignIn = () => {
  return (
    <Container className="signIn-center">
      <h1 >Sign In</h1>
      <p>  Invalid Credentials. Try again.  </p>
     
        <Form className="form" >

            {/* Email Address */}
            <Form.Group controlId="formBasicEmail" >
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email"  />
            </Form.Group>

             {/* password */}
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            {/* Remember Me */}
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Remember Me" />
            </Form.Group>

            {/* Sign In button */}
            <Button variant="outline-dark" type="submit" id="submitButton" style={{margin:"auto"}}>
                 Sign In
            </Button>

            {/* Icons */}
             <div className="icons"> <img src = {GoogleIcon} alt="Google Logo" className="icon"></img>
                <img src = {FacebookIcon} alt="Facebook Logo" className="icon"></img></div>
        </Form>
        </Container>
    )
}


export default SignIn;