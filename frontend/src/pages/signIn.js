import 'bootstrap/dist/css/bootstrap.css';
import FacebookIcon from './../design/icons/icons8-facebook-30.png';
import GoogleIcon from './../design/icons/icons8-google-48.png';
import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './../design/styleSheets/signInUp.css';

const SignIn = () => {

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const login = (e) => {

    e.preventDefault();

    let user = {
      username: loginUsername,
      password: loginPassword,
    };

    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user)
    })
      //redirect user to home page
      .then(res => res.json())
      .then(message => {
        console.log("message = " + message);
        if (message == "Success") window.location.href = "/";
      })
  }

  return (
    <Container className="signIn-center">
      <h1 >Sign In</h1>
      <Form className="form" >

        {/* username */}
        <Form.Group controlId="formBasicUsername" >
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="username"
            placeholder="Enter username"
            onChange={(e) => setLoginUsername(e.target.value)}
          />
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </Form.Group>

        {/* Remember Me */}
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Remember Me" />
        </Form.Group>

        {/* Sign In button */}
        <Button onClick={login} variant="outline-dark" type="submit" id="submitButton" style={{ margin: "auto" }}>
          Sign In
            </Button>

        {/* Icons */}
        <div className="icons"> <img src={GoogleIcon} alt="Google Logo" className="icon"></img>
          <img src={FacebookIcon} alt="Facebook Logo" className="icon"></img></div>
      </Form>
    </Container>
  )
}


export default SignIn;