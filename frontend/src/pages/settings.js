// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * settings.js
 *
 * This exports the settings page.
 * To be developed:
 * changing user info updates database
 * accessibility options work
 * unhiding/blocking content
 *   commented out is the interface for doing this, but it
 *   has not been incorporated into the refactored settings yet
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect } from "react";
import "./../design/styleSheets/tutorial.css";

import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  Container,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";

// +-------------------+----------------------------------------------------------------------
// | settings.js        |
// +-------------------+
//Page Header
function Settings() {
  return (
    <Container
      fluid
      style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}
    >
      {/* Title */}
      <Container>
        <h1>Account Settings</h1>
      </Container>
      {/* settings */}
      <Container>
        <SettingsTable />
      </Container>
    </Container>
  );
}

//Tables with all setting options
function SettingsTable() {
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api?action=getUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((user) => {
        if (user) {
          setUser(user);
        }
      });
  }, [user]);

  function changeEmail(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeEmail",
        newEmail: newEmail,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function changeUsername(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeUsername",
        newUsername: newUsername,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function changePassword(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changePassword",
        currentPassword: currentPassword,
        newPassword: newPassword,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  function deleteAccount(e) {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "deleteAccount",
        currentPassword: currentPassword,
        ...user,
      }),
    })
      .then((res) => res.json())
      .then((message) => {
        if(message === "Deleted. Please Sign Out.") {
          window.location.href = "/";
          alert(message);
        }
      })
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Email</Popover.Title>

      <Popover.Content>
        <Form onSubmit={changeEmail}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Enter new email"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const usernamePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Username</Popover.Title>

      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="username"
              placeholder="Enter new username"
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick = {changeUsername}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const password = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Change Password</Popover.Title>
      <Popover.Content>
        <Form onSubmit = {changePassword}>
          <Form.Group controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Enter old password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Form.Control
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick = {changePassword}>Confirm Changes</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  const deletePopover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3"> Delete Account</Popover.Title>
      <Popover.Content>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Control
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Form.Text className="text-muted"></Form.Text>
            <Button onClick = {deleteAccount}>Confirm</Button>
          </Form.Group>
        </Form>
      </Popover.Content>
    </Popover>
  );

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        {/* User Settings */}
        <Accordion.Toggle as={Card.Header} eventKey="0">
          User Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <ButtonGroup vertical>
              {/* Privacy */}
              <Button>Privacy</Button>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={popover}
              >
                <Button>Change Email</Button>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={password}
              >
                <Button>Change Password</Button>
              </OverlayTrigger>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={usernamePopover}
              >
                <Button>Change Username</Button>
              </OverlayTrigger>

              <Button>Blocked Content</Button>

              <OverlayTrigger
                trigger="click"
                placement="right"
                overlay={deletePopover}
              >
                <Button>Delete Account</Button>
              </OverlayTrigger>
            </ButtonGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Accessibility */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="1">
          Accessibility
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <ButtonGroup vertical>
              <Button>Text Size </Button>
              <Button>Magnifier </Button>
              <Button>Animations </Button>
            </ButtonGroup>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Message Settings */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="2">
          Message Settings
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            {" "}
            Recieve Messages From:
            <Form>
              {["radio"].map((type) => (
                <div key={`default-${type}`} className="mb-3">
                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`Anyone`}
                  />

                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`Friends`}
                  />

                  <Form.Check
                    name="radio"
                    type={type}
                    id={`default-${type}`}
                    label={`No Messages`}
                  />
                </div>
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      {/* Notifications */}
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="3">
          Notifications
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            Recieve Notifications for:
            <Form>
              {["checkbox"].map((type) => (
                <div key={`default-${type}`} className="mb-3">
                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`Someone Liking Your Image`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`New Badge`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`New Follower`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`default-${type}`}
                    label={`Someone You Follow Made a New Image`}
                    defaultChecked
                  />

                  <Form.Check
                    type={type}
                    id={`inline`}
                    label={`New MIST Updates`}
                    defaultChecked
                  />
                </div>
              ))}
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

//Popover bubble to change email


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

/*
const Email = () => (
  <OverlayTrigger trigger="click" placement="right" overlay={popover}>
    <Button variant="success">Change Email</Button>
  </OverlayTrigger>
); */

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
      <Button
        variant="outline-dark"
        onClick={() => sethiddenImages(!hiddenImages)}
        aria-controls="hiddenImages"
        aria-expanded={hiddenImages}
        style={{
          marginTop: "1em",
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Images
      </Button>
      <Collapse in={hiddenImages}>
        <div id="hiddenImages">
          {exampleListOfImages.map((image) => (
            <div>
              <img src={image} alt="example" style={{ padding: "10px" }}/> <br/>
              <BlockAndHideButton name="hide" />
            </div>
          ))}
        </div>
      </Collapse>
      <br />
      <Button
        variant="outline-dark"
        onClick={() => sethiddenAlbums(!hiddenAlbums)}
        aria-controls="hiddenAlbums"
        aria-expanded={hiddenAlbums}
        style={{
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Albums
      </Button>
      <Collapse in={hiddenAlbums}>
        <div id="hiddenAlbums">
          {exampleListOfAlbums.map((album) => (
            <Row style={{ padding: "10px" }}>
              <text style={{ padding: "10px" }}>{album}</text>
              <BlockAndHideButton name="hide" />
            </Row>
          ))}
        </div>
      </Collapse>
      <br />
      <Button
        variant="outline-dark"
        onClick={() => sethiddenComments(!hiddenComments)}
        aria-controls="hiddenComments"
        aria-expanded={hiddenComments}
        style={{
          marginBottom: "1em"
        }}
        size="sm"
      >
        Hidden Comments
      </Button>
      <Collapse in={hiddenComments}>
        <div id="hiddenComments">
          {exampleListOfComments.map((comment) => (
            <Row style={{ padding: "10px" }}>
              <text style={{ padding: "10px" }}>{comment}</text>
              <BlockAndHideButton name="hide" />
            </Row>
          ))}
        </div>
      </Collapse>
      <p>
        {" "}
        People who I follow can send messages People who follow me can send
        messages Anyone can send me a message{" "}
      </p>
    </Container>
  );
}
*/

export default Settings;
