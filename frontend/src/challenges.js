import React from "react";
import "./styleSheets/challenges.css";
import "./styleSheets/generalStyles.css";
import {
  Card,
  Button,
  Pagination,
  Container,
  Row,
  Dropdown,
  ButtonGroup,
  Form,
  Col,
} from "react-bootstrap";

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

/* Plaeholder images */
import FeaturedImage1 from "./featuredImages/pic1.png";
import FeaturedImage2 from "./featuredImages/pic2.png";
import FeaturedImage3 from "./featuredImages/pic3.png";
import FeaturedImage4 from "./featuredImages/pic4.png";

import { BsClock } from "react-icons/bs";

//Challenges; header, spacing between drop down
//menus, and the challenges displayed on the screen

const Challenges = () => {
  return (
    <Container fluid>
      <Container>
        <h1>Challenges</h1>
        <p>Start of challenges</p>
      </Container>
      <Container style={{ marginTop: "1em" }}>
        <Container style={{ marginBottom: "1em" }}>
          <Filters />
        </Container>
        <Container>
          <Row style={{ justifyContent: "space-between" }}>
            <ChallengeCard />
            <ChallengeCard />
            <ChallengeCard />
            <ChallengeCard />
          </Row>
        </Container>
        <Container>
          <PageCounter style={{ margin: "auto" }} />
        </Container>
      </Container>
    </Container>
  );
};

//drop down menus; level, color, and animation options
function Filters() {
  return (
    <Form>
      <Form.Row style={{ width: "50%" }}>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Level</Form.Label>
          <Form.Control as="select" defaultValue="Choose...">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Color</Form.Label>
          <Form.Control as="select" defaultValue="Choose...">
            <option>Grayscale</option>
            <option>RGB</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Animation</Form.Label>
          <Form.Control as="select" defaultValue="Choose...">
            <option>Static</option>
            <option>Animated</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}

//format for (all) challenge cards
function ChallengeCard() {
  return (
    <Card style={{ width: "30%", marginBottom: "1em", padding: "1em" }}>
      <Card.Title style={{ margin: "auto", marginBottom: "1em" }}>
        Challenge name
      </Card.Title>
      <Card.Img variant="top" src={FeaturedImage1} />
      <Card.Body>
        <Row style={{ justifyContent: "flex-end" }}>
          <Button variant="outline-dark">Do challenge!</Button>
        </Row>
      </Card.Body>
    </Card>
  );
}

function PageCounter() {
  return (
    <Pagination className="pagination-style">
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item active>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>

      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}
export default Challenges;
