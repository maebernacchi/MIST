// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * home.js
 * 
 * This exports the home page
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+

/**
 * The page is made up of the following parts:
 *    --Intro
 *        | logo
 *        | title + slogan
 * 
 *    --ButtonContainer
 *        | tutorial + create + gallery buttons
 * 
 *    --BottomText
 *        |  public beta notice + warning
 * 
 *    --FeaturedImages
 *        | this is the featured image container in the bottom of the page
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+

/* react imports */
import React, { Component } from "react";
import { Button, Col, Container, Row,  } from "react-bootstrap";
import { NavLink } from "react-router-dom";
/* imports stylesheet, logo */
import "./../design/styleSheets/home.css";
import MistLogo from "./../design/Logos/logoFinal.png";
/* imports icons */
import { BsClock } from "react-icons/bs";
/* MISTImage and LinkButton */
import MISTImage from "./components/MISTImageGallery"
import LinkButton from "./components/LinkButton";
// +-------------+----------------------------------------------------------------------
// | Home.js     |
// +-------------+

/**
 *  home returns the whole page
 */
const home = () => {
  return <PageContent />;
};

/**
 * PageContent combines all content to be featured on the page, including 
 * the Intro, ButtonContainer, BottomText, and Featured Images.
 */
class PageContent extends React.Component {
  render() {
    return (
      <Container fluid style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
        <Intro />
        <ButtonContainer />
        <BottomText />
        <FeaturedImages />
      </Container>
    );
  }
}

/**
 * Returns the logo, title, and slogan
 */
function Intro() {
  return (
    <Row style={{ justifyContent: "center" }}>
      {/* Left side */}
      <img src={MistLogo} alt="MIST Logo" />

      {/* Right side */}
      <p1 style={{ alignItems: "center", margin: "auto 0 auto 5vh" }}>
        {/* Title */}
        <p1 style={{ fontSize: "200%" }}>
          The Mathematical Synthesis Toolkit
        </p1>

        <p1 style={{ fontSize: "150%", color: "grey" }}>
          {/* vertical line */}
          <hr />
          {/* slogan */}
          Create abstract images and animations
          <br />
          using simple math functions
       </p1>
      </p1>
    </Row>
  );
}

/**
 * ButtonContainer returns the buttons to Tutorials, Create, and Gallery.
 */
function ButtonContainer() {
  return (
    /* it is in a row */
    <Row id="homeButtons" style={{ justifyContent: "center" }}>
      {/* Tutorial */}
      <LinkButton to="/tutorial" className="linkButton">
        <b>Tutorials</b>
      </LinkButton>

      {/* Create workspace */}
      <LinkButton to="/createWorkspace" className="linkButton" id="middleButton">
        Create
      </LinkButton>

      {/* Gallery */}
      <LinkButton to="/gallery" className="linkButton">
        Gallery
      </LinkButton>
    </Row>
  );
}

/**
 * BottomText retuns text that is featured on the bottom of the page. 
 * This text includes the "public beta" notice and the warning.
 */
function BottomText() {
  return (
    <Container>
      {/* public beta notice */}
      <p>
        MIST is in public beta. Look <NavLink to="/about">here</NavLink> for
        more information.
      </p>

      {/* warning */}
      <p>
        <b>WARNING: </b>
        Some of the images rendered on this site may feature flashing animations
        and patterns.
        <br />
        For those with a history of epilepsy, viewer discretion is advised.
      </p>
    </Container>
  );
}

/*
  FeaturedImages returns a display of images previously created 
  with MIST at the bottom of the screen in a container.
  */
class FeaturedImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featuredImages: []
    }
  }

  //Fetch the data on first mount
  componentDidMount() {
    this.getFeaturedImages();
  }

  // Retrieves the images from the database
  getFeaturedImages = () => {
    fetch('/api?action=getHomeImages')
      .then(res => res.json())
      .then(featuredImages => this.setState({ featuredImages }));
  }

  render() {
    const featuredImages = this.state.featuredImages;
    return (
      <Container>
        <Col className="featuredImagesContainer"
          style={{
            /* border */
            border: "solid",
            borderWidth: "1px",
            borderRadius: "10px",

            /* dimensions */
            width: "80%",

            /* margin */
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "1vh",
            marginBottom: "1vh",

            /* padding */
            paddingTop: "2vh",
            paddingBottom: "2vh",
            paddingLeft: "5vh",
            paddingRight: "5vh"
          }}>

          {/* Text + Button */}
          <Row style={{ justifyContent: "space-between" }}>
            {/* Title and subtext */}
            <div>
              <h2 style={{ fontSize: "150%" }}>
                Featured Images:
              </h2>
              <p1>
                Images with <BsClock /> will animate when you hover over them
              </p1>
            </div>

            {/* Button to Gallery */}
            <div>
              <Button variant="outline-dark" href="/gallery"> See More </Button>
            </div>
          </Row>

          {/* Featured Images */}
          <Row className="featuredImagesFlex">
            {featuredImages.length ? (
              <Row >
                {featuredImages.map((featuredImage) => {
                  return (
                    <Col key={featuredImage._id}>
                      {/* the two lines below are placeholders, we need to pass in MIST images instead */}
                      <MISTImage code={featuredImage.code} resolution="150" />
                      {/*<p> {featuredImage.code}</p>*/}
                    </Col>
                  );
                })}
              </Row>
            ) 
            : 
            (
              <h2> No Image Found </h2>
            )
            }
          </Row>
        </Col>
      </Container>
    );
  }
}

export default home;