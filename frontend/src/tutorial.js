import React from "react";
import "./styleSheets/tutorial.css";

import { Accordion, Card, Button, Container, Row } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";


//Tutorial Header
const Tutorial = () => {
  return (
    <Container>
      <h1>Tutorial</h1>
      <p>
        Confused about MIST? Here are a few quick guides to get you started.{" "}
      </p>
      <TutorialTable />
    </Container>
  );
};
// Allows topics to be sorted with an accordion style design
function TutorialTable() {
  return (
    <Accordion defaultActiveKey="0" id="accordion" style={{ width: "90%" }}>
      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="0" id="card-header">
          1. An Introduction to MIST
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Card.Title>
              A quick introduction to the ideas behind MIST
            </Card.Title>
            <Card.Text>
              We could have the content here, like the videos and the texts of
              the tutorials. Then we would not need to load in new sites anyway
              and we would not need the button down here either. But this page
              might have to call too much data, so maybe we could have buttons
              linked to videos, and otherwise the texts here.
            </Card.Text>
            <Row style={{ justifyContent: "flex-end", paddingRight: "1em" }}>
              <Button variant="outline-secondary" href="#">
                Go to video
              </Button>
            </Row>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="1" id="card-header">
          2. A Quick Tour of the Web Site
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <Card.Title>
              A brief introduction to the pages on this site
            </Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="2" id="card-header">
          3. Getting Started with the Create Workspace
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <Card.Body>
            <Card.Title>
              A short introduction to the workspace for creating new MIST images
            </Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="3" id="card-header">
          4.The MIST Workspace
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="3">
          <Card.Body>
            <Card.Title>
              A shorter introduction to the workspace for creating new MIST
              images
            </Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="4" id="card-header">
          5. An Extended Example, Part 1
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="4">
          <Card.Body>
            <Card.Title>
              A quick demonstration of how to make an "interesting" animation
            </Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="5" id="card-header">
          6. Colorful Images
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="5">
          <Card.Body>
            <Card.Title>An introduction to RGB</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>

      <Card border="dark">
        <Accordion.Toggle as={Card.Header} eventKey="6" id="card-header">
          7. Moving Images
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="6">
          <Card.Body>
            <Card.Title>An introduction to Animation</Card.Title>
            <Card.Text>
              With supporting text below as a natural lead-in to additional
              content.
            </Card.Text>
            <Button variant="outline-secondary" href="#">
              Go somewhere
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

/** Code for tutorials, but in a table */

/*
function TutorialTable(){
   return(
      <div className="tableContainer">
      <table >
      <tr>
        <th> Section </th>
        <th> Description </th>
        <th> Type </th>
      </tr>
      <tr>
        <td><a href='/tutorial/intro'>An Introduction to MIST</a></td>
        <td>A quick introduction to the ideas behind MIST</td>
        <td>Text</td>
      </tr>
      <tr>
        <td><a href='/video/intro-site'>A Quick Tour of the Web Site</a></td>
        <td>A brief introduction to the pages on this site</td>
        <td>Video</td>
      </tr>
      <tr>
        <td><a href='/tutorial/gui'>Getting Started with the Workspace</a></td>
        <td>A short introduction to the workspace for creating new MIST images</td>
        <td>Text</td>
      </tr>
      <tr>
        <td><a href='/video/intro-gui'>The MIST Workspace</a></td>
        <td>A shorter introduction to the workspace for creating new MIST images</td>
        <td>Video</td>
      </tr>
      <tr>
        <td><a href='/video/extended-1'>An Extended Example, Part 1</a></td>
        <td>A quick demonstration of how to make an "interesting" animation</td>
        <td>Video</td>
      </tr>
      <tr>
        <td><a href='/tutorial/rgb'>Colorful Images</a></td>
        <td>An introduction to RGB</td>
        <td>Text</td>
      </tr>
      <tr>
        <td><a href='/tutorial/animation'>Moving Images</a></td>
        <td>An introduction to Animation</td>
        <td>Text</td>
      </tr>
    </table>
    </div>
   )
}
 */
export default Tutorial;
