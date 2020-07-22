import React from 'react';
import './styleSheets/signInUp.css';
import FacebookIcon from './icons/icons8-facebook-30.png';
import GoogleIcon from './icons/icons8-google-48.png';

import {
  Form,
  Button,
  Container
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

const SignUp = () => {
  return (
    <Container className="signUp-center">
      <h1 >Sign Up</h1>
      <p>    Welcome to MIST! <br />Get started by creating an account. </p>
      <div className="icons"> <img src={GoogleIcon} alt="Google Logo" className="icon"></img>
        <img src={FacebookIcon} alt="Facebook Logo" className="icon"></img></div>
      <p>OR</p>
      <Form className="form">


        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control required="required" placeholder="Enter first name" />
        </Form.Group>

        <Form.Group>
          <Form.Label >Last name</Form.Label>
          <Form.Control required="required" placeholder="Enter last name" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control required="required" placeholder="@username" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control required="required" type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control required="required" type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Re-enter Password</Form.Label>
          <Form.Control required="required" type="password" placeholder="Re-enter password" />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" required="required" label="By checking this box I confirm that I am 13 years of age or older." />
        </Form.Group>

        <Form.Group controlId="formBasicCheckbox">
          <Form.Check required="required" type="checkbox"
            label={<label>By checking this box I confirm that I have read and accept the <a href='/community'>Community Guidelines</a></label>} />
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





export default SignUp;