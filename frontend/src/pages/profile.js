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
 */

import React, { useState, useEffect } from "react";
import DisplayImages from "./components/displayImages";
import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import { Container, Row, Form, Col, Nav, Tab, Card, Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./components/MISTImageGallery"

import {
  AiOutlinePicture,
  AiOutlineStar,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";

// full profile page
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
    fetch('/api/gallery/recent')
        .then(req => req.json())
        .then(cards => { setUserImages(cards)});

    fetch('/api/profile')
      .then(req => req.json())
      .then((userInfo) => {
        setUser(userInfo.user);
        setUserAlbums(userInfo.userAlbums);
      });
  }, [])

  return (
    <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      <Container>
        <h1> Profile </h1>
      </Container>
      <Container style={{ marginTop: "3vh", marginBottom: "3vh" }}>
        <FirstPart name={user.forename + " " + user.surname}
          username={user.username}
          date={user.createdAt}
          bio={user.about}
          code={user.profilepic}
        />
      </Container>

      <ProfileNav images={userImages} albums={userAlbums} />
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

              <Form.Label column sm="4">
                Username
              </Form.Label>
              <Col sm="7">
                <Form.Control plaintext readOnly value={"@" + props.username} />
              </Col>
              <Col sm="1">
                <Nav.Link eventKey="link-1">Change</Nav.Link>
              </Col>

              <Form.Label column sm="4">
                Member since
              </Form.Label>

              <Col sm="6">
                <Form.Control plaintext readOnly value={props.date} />
              </Col>

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
          <hr />
          <IconsBar />
          <hr />
        </Container>
      </Row>
    </Container>
  );
}

// icons (for images, likes, badges, challenges) underneath user information
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

// user images and albums
function ProfileNav(props) {
  return (
    <Container>
    <Tab.Container>
      <Nav fill variant="tabs" defaultActiveKey="images">
        <Nav.Item>
          <Nav.Link eventKey="images" style={{ color: "black" }}>
            Images
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="albums" style={{ color: "black" }}>
            Albums
          </Nav.Link>
        </Nav.Item>
        {/*  Not implemented in back-end 
        <Nav.Item>
          <Nav.Link eventKey="link-4" style={{ color: "black" }}>
            Badges
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" style={{ color: "black" }}>
            Challenges
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-5" style={{ color: "black" }}>
            Saved
          </Nav.Link>
  </Nav.Item> */}
      </Nav>

      <Tab.Content>
        <Tab.Pane eventKey="images">
          <DisplayImages cards={props.images} cardsLoaded={true} />
        </Tab.Pane>

        <Tab.Pane eventKey="albums">
          <Row>
            {props.albums.map((album) => (
              <Album title={album.name} description={album.caption} date={album.createdAt} />
            ))}
          </Row>
        </Tab.Pane>


      </Tab.Content>
    </Tab.Container>
    </Container>
  );
}

// album component
function Album(props) {
  return (
    <Card
      style={{ padding: "1em", width: "30%", margin: "1em" }}
    >
      <Card.Header>
        <Card.Title style={{ margin: "auto" }}>
          <p>{props.title}</p>
        </Card.Title>
        {/* ICONS */}
        <Card.Body style={{ justifyContent: "space-between" }}>
          <ControlledCarousel />
          <p>{props.description}</p>
          <p>{props.date}</p>
        </Card.Body>
      </Card.Header>
    </Card>
  )
}

// carousel used for looking through albums
function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item >
        <Row style={{ justifyContent: "center" }}>
          <MISTImage
            code="x"
            resolution="250"
          />
        </Row>
        <Carousel.Caption>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>

        <Row style={{ justifyContent: "center" }}>
          <MISTImage
            code="x"
            resolution="250"
          />
        </Row>

      </Carousel.Item>
      <Carousel.Item>
        <Row style={{ justifyContent: "center" }}>
          <MISTImage
            code="x"
            resolution="250"
          />
        </Row>
      </Carousel.Item>
    </Carousel>
  );
}