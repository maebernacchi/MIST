import React, { useState } from 'react';
import './styleSheets/signInUp.css';
import FacebookIcon from './icons/icons8-facebook-30.png';
import GoogleIcon from './icons/icons8-google-48.png';
import { Redirect } from 'react-router-dom'

import {
  Form,
  Button,
  Container
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [redirect, setRedirect] = useState(null);

  //update the form as the user types
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

    //post user
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    })
      //redirect user to home page
      .then(setRedirect("/"))
  };

  if (redirect) {
    return <Redirect to={{ pathname: redirect }} />
  } else {
    return (
      <Container className="signUp-center">
        <h1 >Sign Up</h1>
        <p>    Welcome to MIST! <br />Get started by creating an account. </p>
        <div className="icons"> <img src={GoogleIcon} alt="Google Logo" className="icon"></img>
          <img src={FacebookIcon} alt="Facebook Logo" className="icon"></img></div>
        <p>OR</p>
        <Form className="form" onSubmit={handleSubmit}>
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
          <Form.Group>
            <Button variant="outline-dark" type="submit" id="submitButton">
              Submit
          </Button>
          </Form.Group>
        </Form>
      </Container>
    );
  }
}


export default SignUp;