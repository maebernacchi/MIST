// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * profile.js
 * 
 * This exports the profile page, which is the user's personal profile page.
 * When a user views another user's profile page, they see user.js not profile.js.
 * Not yet developed:
    * Albums are the user's own albums. Currently, what is displayed is fake data.
    * Images are the user's own images. Currently, the images displayed are the same 
    *   images from the gallery 
 
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+

/**
 * The page is made up of the following parts:
 *    --First Part
 *        | Profile Image + user information
 *        | IconsBar: # of pictures, likes, badges, challenges
 *    --Profile Nav
 *        | images: calls displayImages.js
 *        | albums: function Albums 
 *            + Carousel
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect, Component} from "react";
import DisplayImages from "./components/displayImages";
import ProfileNavigation from "./ProfileNavigation";
import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import { Button, Card, Carousel, Container, Col, Form, Modal, Nav, Row, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./components/MISTImageGallery"
/* icons */
import {
  AiOutlinePicture,
  AiOutlineStar,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";
import { IoIosArrowBack, IoMdAdd } from "react-icons/io"
import {
  BrowserRouter, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";

// +-------------------+----------------------------------------------------------------------
// | profile.js        |
// +-------------------+
export default function Profile() {

  /**
   * These are seperate because of how the db is organized
   * users only store the id's of their images, so finding a user
   * and retrieving their images are seperate queries in the back-end,
   * same applies for albums
   */
  const [user, setUser] = useState({
    forename: "",
    surname: "",
    username: "",
    createdAt: "",
    about: "",
    profilepic: ""
  });
  const [userImages, setUserImages] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);

  // grab user's information, images, and albums
  useEffect(() => {
    fetch('/api/?action=getAuthenticatedCompleteUserProfile')
      .then(async function (res) {
        if (!res.ok) throw await res.text();
        else return await res.json();
      })
      .then(function ({ user }) {
        setUser(
          {
            forename: user.forename,
            surname: user.surname,
            username: user.username,
            createdAt: user.createdAt,
            about: user.about,
            profilepic: (user.profilepic) ? user.profilepic : ''
          }
        );
        setUserImages(user.images.map(image => ({ ...image, userId: { username: image.username } })))
        setUserAlbums(user.albums);
      })
      .catch(alert)
  }, [])

  return (
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      {/* Title */}
      <Container>
        <h1> Profile </h1>
      </Container>

      {/* First Part: Profile Picture + information */}
      <Container style={{ marginTop: "3vh", marginBottom: "3vh" }}>
        <FirstPart name={user.forename + " " + user.surname}
          username={user.username}
          date={user.createdAt}
          bio={user.about}
          code={user.profilepic}
        />
      </Container>

      {/* Tabs for images, albums */}
      <ProfileNavigation images={userImages} albums={userAlbums}/>
    </Container>
  );
}

// user information: profile pic, username, name, email, member since
function FirstPart(props) {
  return (
    <Container style={{ width: "90%" }}>
      <Row style={{ justifyContent: "flex-start" }}>
        {" "}
      </Row>
      <Row style={{ justifyContent: "space-between" }}>
        {/* Displays profile picture + option to change it + settings */}
        <Container style={{ width: "25%", justifyContent: "center" }}>
          <MISTImage code={props.code} resolution="275" />
          <Nav.Link eventKey="link-1">Change Image</Nav.Link>
          <Nav.Link href="/settings">
            <AiOutlineSetting size={28} /> Account Settings
          </Nav.Link>
        </Container>

        {/** User informations + icon bar*/}
        <Container style={{ width: "50%", alignItems: "center" }}>
          <Form>
            <Form.Group as={Row} controlId="formPlaintextEmail">
              {/* name */}
              <Form.Label column sm="4">
                Name
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  plaintext
                  readOnly
                  value={props.name}
                />
              </Col>
              <Col sm="1">
                <Nav.Link eventKey="link-1">Change</Nav.Link>
              </Col>

              {/* username */}
              <Form.Label column sm="4">
                Username
              </Form.Label>
              <Col sm="7">
                <Form.Control plaintext readOnly value={"@" + props.username} />
              </Col>
              <Col sm="1">
                <Nav.Link eventKey="link-1">Change</Nav.Link>
              </Col>

              {/* member since */}
              <Form.Label column sm="4">
                Member since
              </Form.Label>
              <Col sm="6">
                <Form.Control plaintext readOnly value={props.date} />
              </Col>

              {/* bio */}
              <Form.Label column sm="4">
                Bio
              </Form.Label>
              <Col sm="7">
                <Form.Control as="textarea" readOnly rows="3" value={props.bio} />
              </Col>
              <Col sm="1">
                <Nav.Link eventKey="link-1">Change</Nav.Link>
              </Col>
            </Form.Group>
          </Form>

          {/* icons bar */}
          <hr />
          <IconsBar />
          <hr />

        </Container>
      </Row>
    </Container>
  );
}

/* # of pictures, likes, badges, challenges and their icons */
function IconsBar() {
  const icons = [
    { iconName: <AiOutlinePicture size={28} />, num: 8, category: "images" },
    { iconName: <AiOutlineStar size={28} />, num: 2, category: "likes" },
    { iconName: <GiAchievement size={28} />, num: 4, category: "badges" },
    { iconName: <GrAchievement size={28} />, num: 6, category: "challenges" },
  ];
  return (
    <Row>
      {icons.map((iconBlock, idx) => (
        <Col key={idx}>
          <Container style={{ textAlign: "center" }}>
            {iconBlock.iconName}
          </Container>
          <Container style={{ textAlign: "center" }}>
            {" "}
            {iconBlock.num} <br />
            {iconBlock.category}{" "}
          </Container>
        </Col>
      ))}
    </Row>
  );
}



