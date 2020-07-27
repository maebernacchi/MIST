import React from "react";
import "./styleSheets/tutorial.css";

import {
  Accordion,
  Card,
  Col,
  Button,
  Container,
  Form,
  OverlayTrigger,
  Popover,
  Row,
} from "react-bootstrap";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import { Link } from "react-router-dom";

//Page Header
function Contact() {
  return (
    <Container>
      <Container>
        <h1>Account Settings</h1>
      </Container>
      <Container fluid>
        <SettingsTable />
      </Container>
    </Container>
  );
}

function SettingsTable() {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          User Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Button>Privacy </Button>
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
              <Button>Change Email</Button>
            </OverlayTrigger>
            <Button>Password </Button>
            <Button>Blocked Content</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
          Accessibility
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <Button>Text Size </Button>
            <Button>Magnifier </Button>
            <Button>Animations </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
          Message Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            {" "}
            Recieve Messages From:
            <Button> People who I follow</Button>
            <Button> People who follow me</Button>
            <Button> Anyone</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
          Notifications
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            Recieve Notifications for:
            <Button>Someone liking your Image </Button>
            <Button> New Badge</Button>
            <Button> New Follower</Button>
            <Button> Someone you follow made a new image</Button>
            <Button> New MIST Updates</Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
const popover = (
  <Popover id="popover-basic">
    <Popover.Content>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter new email" />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
      </Form>
    </Popover.Content>
  </Popover>
);
/*const popover = (
  <Popover id="popover-basic">
    <Popover.Title as="h3">Popover right</Popover.Title>
    <Popover.Content>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter new email" />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
      </Form>
    </Popover.Content>
  </Popover>
);*/

const Email = () => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="success">Change Email</Button>
  </OverlayTrigger>
);

//render(<Email />);

/*
//These tabs are the main setting categories
function SettingOptions() {
  return (
    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="first">User Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="second">Accessibility</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="third">Notifications</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="fourth">Message Settings</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="first">
              <OptionOne />
            </Tab.Pane>

            <Tab.Pane eventKey="second">
              <OptionTwo />
            </Tab.Pane>

            <Tab.Pane eventKey="third">
              <OptionThree />
            </Tab.Pane>

            <Tab.Pane eventKey="fourth">
              <OptionFour />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}
//Options below allow users to made these changes to their accounts
function OptionOne() {
  return (
    <Container>
      <p> Privacy, Email, Password, Send Updates </p>
    </Container>
  );
}

function OptionTwo() {
  return (
    <Container>
      <p>
        {" "}
        Text Size, Image Magnifier, Site Colors (for users with epilepsy and
        related disablities){" "}
      </p>
    </Container>
  );
}

function OptionThree() {
  return (
    <Container>
      <p>
        {" "}
        Receive notifications for: Someone liking your Image New Badge Someone
        you follow made a new image{" "}
      </p>
    </Container>
  );
}

function OptionFour() {
  return (
    <Container>
      <p>
        {" "}
        People who I follow can send messages People who follow me can send
        messages Anyone can send me a message{" "}
      </p>
    </Container>
  );
}
*/

export default Contact;
