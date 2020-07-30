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
// | Challenges.js     |
// +-------------------+
/**
 * This is the Challenges.js
 * This file is  displays the Challenges page
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+
/**
 * The page is made up of the following parts:
 *    -- Header
 *        | Title + Subtitle
 * 
 *    --Filters
 *        | Level:     Beginner, Intermediate, Advanced
 *        | Color:     Greyscale, RGB
 *        | Animation: Static, Animated
 * 
 *    --Challenges Cards
 *        | thesee are the cards for the different challenges
 *        |   with an image on it and the title of the challenge
 * 
 *    --Page Counter
 *        | shows what page the user is on --- NEEDS TO BE IMPLEMENTED
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
/* react-related imports */
import React, { useState, useEffect } from "react";
import {
  Button, Card, Col, Container,
  Form, Pagination, Row
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

/* stylesheets */
import "./../design/styleSheets/challenges.css";
import "./../design/styleSheets/generalStyles.css";

import MISTImage from "./components/MISTImageGallery";

// +----------------+----------------------------------------------------------------------
// | Challenges     |
// +----------------+

//Challenges; header, spacing between drop down
//menus, and the challenges displayed on the screen

/**
 * Displays the whole challenges page content 
 */
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
    /* The styling helps with the footer */
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      {/* Title and subtitle */}
      <Container>
        <h1>Challenges</h1>
        <p>Start of challenges</p>
      </Container>

      {/* Filters */}
      <Container style={{ marginBottom: "1em" }}>
        <Filters handleChange={handleChange}
          level={level}
          color={color}
          animation={animation}
        />
      </Container>

      {/* Challenge Cards */}
      <Container>
        <Row style={{ justifyContent: "space-between" }}>
          {challenges.map((challenge) => (
            <ChallengeCard challenge={challenge} />
          ))}
        </Row>
      </Container>

      {/* Page Counter */}
      <Container>
        <PageCounter style={{ margin: "auto" }} />
      </Container>
    </Container>
  );
};

/**
 * Displays one Challenge Card with title, image, button
 *  | takes in data of a challenge
 */
//format for (all) challenge cards
function ChallengeCard(props) {
  return (
    <Card style={{ width: "30%", padding: "1em" }}>

      {/* Challenge title */}
      <Card.Title style={{ margin: "auto" }}>
        {props.challenge.title}
      </Card.Title>

      {/* Challenge card body */}
      <Card.Body>
        {/* Challenge image */}
        <Row variant="top" style={{ justifyContent: "center" }}>
          <MISTImage code={props.challenge.code} resolution="250" />
        </Row>

        {/* Button */}
        <Row style={{ justifyContent: "flex-end", margin: "1vh" }}>
          <Button variant="outline-dark">Do challenge!</Button>
        </Row>
      </Card.Body>
    </Card>
  );
}

/**
 * Displays the Filter with the different dropdown options
 *  | takes in the level, color, and animation of the challenge
 */
//drop down menus; level, color, and animation options
function Filters(props) {

  return (
    <Form>
      <Form.Row style={{ width: "50%" }}>

        {/* Level Filter */}
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
        
        {/* Color Filter */}
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

        {/* Animation Filter */}
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

/**
 * Returns a page counter
 * Needs to be implemented
 */
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