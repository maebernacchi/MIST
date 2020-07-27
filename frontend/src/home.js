import React from "react";
import "./styleSheets/home.css";
import LinkButton from "./LinkButton";
import { NavLink } from "react-router-dom";
// import images
import MistLogo from "./design/Logos/Postivie/nobackground300.png";
import FeaturedImage1 from "./featuredImages/pic1.png";
import FeaturedImage2 from "./featuredImages/pic2.png";
import FeaturedImage3 from "./featuredImages/pic3.png";
import FeaturedImage4 from "./featuredImages/pic4.png";

import { Container, Button } from "react-bootstrap";

import { BsClock } from "react-icons/bs";

const home = () => {
  return <PageContent />;
};

/*
PageContent combines all content to be featured on the page, including 
the Intro, ButtonContainer, BottomText, and Featured Images.
*/
class PageContent extends React.Component {
  render() {
    return (
      <Container id="main" className="content-wrap">
        <Intro />
        <h style={{ fontSize: "170%" }}>
          The Mathematical Image Synthesis Toolkit
        </h>
        <ButtonContainer />
        <BottomText />
        <FeaturedImages />
      </Container>
    );
  }
}

/*
  Intro returns the MIST logo and the MIST slogan.
  */
function Intro() {
  return (
    <div id="intro">
      <div id="logoImage">
        <img src={MistLogo} alt="MIST Logo"></img>
      </div>
      <div id="about">
        <p>Create abstract images and animations using simple math functions</p>
      </div>
    </div>
  );
}

/*
  ButtonContainer returns the buttons Tutorials, Create, and Gallery.
  */
function ButtonContainer() {
  return (
    <div id="homeButtons">
      <LinkButton to="/tutorial" className="linkButton">
        <b>Tutorials</b>
      </LinkButton>
      <LinkButton to="/" className="linkButton" id="middleButton">
        Create
      </LinkButton>
      <LinkButton to="/gallery" className="linkButton">
        Gallery
      </LinkButton>
    </div>
  );
}

/*
  BottomText retuns text that is featured on the bottom of the page. 
  This text includes the "public beta" notice and the warning.
  */
function BottomText() {
  return (
    <div>
      <p>
        MIST is in public beta. Look <NavLink to="/about">here</NavLink> for
        more information.
      </p>
      <p>
        <b>WARNING: </b>
        Some of the images rendered on this site may feature flashing animations
        and patterns.
        <br />
        For those with a history of epilepsy, viewer discretion is advised.
      </p>
    </div>
  );
}

/*
  FeaturedImages returns a display of images previously created 
  with MIST at the bottom of the screen.
  */
class FeaturedImages extends React.Component {
  render() {
    return (
      <div className="featuredImagesContainer">
        <div>
          <h>Featured Images:</h>
          <p>
            Images with <BsClock /> will animate when you hover over them
          </p>
        </div>
        <div className="featuredImagesFlex">
          {/*
            NOTE: We still need to think about which featured images
            we want to display. The ones used here are placeholders.
            */}
          <img
            src={FeaturedImage1}
            alt="temporary example 1"
            className="featuredImage"
          ></img>
          <img
            src={FeaturedImage2}
            alt="temporary example 2"
            className="featuredImage"
          ></img>
          <img
            src={FeaturedImage3}
            alt="temporary example 3"
            className="featuredImage"
          ></img>
          <img
            src={FeaturedImage4}
            alt="temporary example 4"
            className="featuredImage"
          ></img>
        </div>
      </div>
    );
  }
}

export default home;
