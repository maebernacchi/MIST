import React, { useState, useEffect } from "react";
import "./styleSheets/challenges.css";
import "./styleSheets/generalStyles.css";
import {
  Card, Button, Pagination, Container,
  Row, Form, Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./MISTImageGallery";

//Challenges; header, spacing between drop down
//menus, and the challenges displayed on the screen

const Challenges = () => {

  const [challenges, setChallenges] = useState([]);
  const [level, setLevel] = useState("Beginner");
  const [color, setColor] = useState("Grayscale");
  const [animation, setAnimation] = useState("Static");

  function handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    if (name === "level") setLevel(value);
    else if (name === "color") setColor(value);
    else setAnimation(value);
  };

  //fetches everytime level, color, or animation changes
  useEffect(() => {
    // create url with the parameters we need to search
    let url = 'api/challenges?level=' + level + "&color="
    + color + "&animation=" + animation;
    fetch(url)
      .then(req => req.json())
      .then(challenges => { setChallenges(challenges) });
  }, [level, color, animation])

  return (
    <Container fluid>
      <Container>
        <h1>Challenges</h1>
        <p>Start of challenges</p>
        {/* This line is for testing */}
        <p>Level: {level}, Color: {color}, Animation: {animation}</p>
      </Container>
      <Container style={{ marginTop: "1em" }}>
        <Container style={{ marginBottom: "1em" }}>
          <Filters handleChange={handleChange}
            level={level}
            color={color}
            animation={animation}
          />
        </Container>
        <Container>
          <Row style={{ justifyContent: "space-between" }}>
            {challenges.map((challenge) => (
              <ChallengeCard challenge={challenge} />
            ))}
          </Row>
        </Container>
        <Container>
          <PageCounter style={{ margin: "auto" }} />
        </Container>
      </Container>
    </Container>
  );
};

//format for (all) challenge cards
function ChallengeCard(props) {
  return (
    <Card style={{ width: "30%", margin: "1em", padding: "1em" }}>
      <Card.Title style={{ margin: "auto", marginBottom: "1em" }}>
        {props.challenge.title}
      </Card.Title>
      <div variant="top" style={{ margin: "1em" }}>
        <MISTImage code={props.challenge.code} resolution="250" />
      </div>
      <Card.Body>
        <Row style={{ justifyContent: "flex-end" }}>
          <Button variant="outline-dark">Do challenge!</Button>
        </Row>
      </Card.Body>
    </Card>
  );
}

//drop down menus; level, color, and animation options
function Filters(props) {

  return (
    <Form>
      <Form.Row style={{ width: "50%" }}>
        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Level</Form.Label>
          <Form.Control
            name="level"
            as="select"
            defaultValue={props.level}
            onChange={(e) => props.handleChange(e)}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Color</Form.Label>
          <Form.Control
            name="color"
            as="select"
            defaultValue={props.color}
            onChange={(e) => props.handleChange(e)}>
            <option>Grayscale</option>
            <option>RGB</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState">
          <Form.Label>Animation</Form.Label>
          <Form.Control
            name="animation"
            as="select"
            defaultValue={props.animation}
            onChange={(e) => props.handleChange(e)}>
            <option>Static</option>
            <option>Animated</option>
          </Form.Control>
        </Form.Group>
      </Form.Row>
    </Form>
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