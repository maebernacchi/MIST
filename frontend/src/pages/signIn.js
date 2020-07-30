/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// +-------------------+----------------------------------------------------------------------
// | signIn.js         |
// +-------------------+
/**
 * This is the signIn.js
 * This file displays a form for the user to sign in
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import 'bootstrap/dist/css/bootstrap.css';
import FacebookIcon from './../design/icons/icons8-facebook-30.png';
import GoogleIcon from './../design/icons/icons8-google-48.png';
import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './../design/styleSheets/signInUp.css';

// +-------------------+----------------------------------------------------------------------
// | signIn.js         |
// +-------------------+
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
        if (message === "Success") window.location.href = "/";
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