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
// | signUp.js         |
// +-------------------+
/**
 * This is the signUp.js
 * This file displays a form for the user to sign up.
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
// | signUp.js         |
// +-------------------+
const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");

  //Updates the state as the user types
  const handleChange = (event) => {
    let value = event.target.value;
    let name = event.target.name;

    switch (name) {
      case "username":
        setUsername(value)
        break;
      case "password":
        setPassword(value)
        break;
      case "firstname":
        setFirstname(value)
        break;
      case "lastname":
        setLastname(value)
        break;
      case "email":
        setEmail(value)
        break;
      default:
        break;
    }
  };

  // when the user submits the form, post to database
  const handleSubmit = (event) => {
    // prevent the page from refreshing 
    event.preventDefault();

    // build the user
    let user = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      password: password,
      email: email
    };

    //post user to database
    fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(message => {
        console.log(message);
      })

    // login user
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
  };

  return (
    <Container className="signUp-center">
      {/* Title and Subtitle */}
        <h1 >Sign Up</h1>
        <p>    Welcome to MIST! <br /> Get started by creating an account. </p>

      {/* Facebook and Google Icons */}
      <div className="icons">
        <img src={GoogleIcon} alt="Google Logo" className="icon"></img>
        <img src={FacebookIcon} alt="Facebook Logo" className="icon"></img>
      </div>
      <p>OR</p>
      {/* Start of the form */}
      <Form className="form" onSubmit={handleSubmit}>
        {/* first name */}
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={firstname}
            name="firstname"
            required="required"
            placeholder="Enter first name"
          />
        </Form.Group>

        {/* last name */}
        <Form.Group>
          <Form.Label >Last name</Form.Label>
          <Form.Control
            onChange={handleChange} v
            alue={lastname}
            name="lastname"
            required="required"
            placeholder="Enter last name"
          />
        </Form.Group>

        {/* username */}
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={username}
            name="username"
            required="required"
            placeholder="@username"
          />
        </Form.Group>

        {/* email */}
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={email}
            name="email"
            required="required"
            type="email"
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        {/* password */}
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={handleChange}
            value={password}
            name="password"
            required="required"
            type="password"
            placeholder="Password"
          />
        </Form.Group>
        {/* commented out until we can check passwords
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Re-enter Password</Form.Label>
            <Form.Control required="required" type="password" placeholder="Re-enter password" />
          </Form.Group> */}

        {/* checkboxes */}
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            required="required"
            label="By checking this box I confirm that I am 13 years of age or older."
          />
        </Form.Group>
        <Form.Group controlId="formBasicCheckbox">
          <Form.Check
            required="required"
            type="checkbox"
            label={<label>By checking this box I confirm that I have read and accept the <a href='/community'>Community Guidelines</a></label>}
          />
        </Form.Group>

        {/* submit */}
        <Form.Group>
          <Button variant="outline-dark" type="submit" id="submitButton">
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
}


export default SignUp;