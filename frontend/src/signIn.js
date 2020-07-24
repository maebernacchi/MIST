import 'bootstrap/dist/css/bootstrap.css';
import FacebookIcon from './icons/icons8-facebook-30.png';
import GoogleIcon from './icons/icons8-google-48.png';
import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import './styleSheets/signInUp.css';

const SignIn = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);

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
      //credentials: true,
      body: JSON.stringify(user)
    })
      .then(res => {
        console.log(res);
      })
    //redirect user to home page
    //.then(setRedirect("/"))
  };

  const getUser = () => {
    fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      //credentials: true
    }) 
    .then(res => res.json())
      .then(res => {
        console.log("are we here");
        setData(res.data);
        console.log(res.data);
      })
  };


  return (
    <Container className="signIn-center">
      <h1 >Sign In</h1>
      <Button onClick={getUser} variant="outline-dark" style={{ margin: "auto" }}>
        get username </Button>
      {data ? <h1>Welcome Back {data.username}</h1> : <h2>Not signed in</h2>}
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