import React, { Component } from "react";
import "./styleSheets/home.css";
import LinkButton from "./LinkButton";
import { NavLink } from "react-router-dom";
import MistLogo from "./design/Logos/Postivie/nobackground300.png";
import { Container } from "react-bootstrap";
import { BsClock } from "react-icons/bs";
import MISTImage from "./MISTImageGallery"

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
        <h1 style={{ fontSize: "170%" }}>
          The Mathematical Image Synthesis Toolkit
        </h1>
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
class FeaturedImages extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredImages: []
    }
  }

  //Fetch the list on first mount
  componentDidMount() {
    this.getFeaturedImages();
  }


  // Retrieves the list of items from the Express app
  getFeaturedImages = () => {
    fetch('/api/home')
      .then(res => res.json())
      .then(featuredImages => this.setState({ featuredImages }));
  } 

  render() {
    const featuredImages = this.state.featuredImages;

    return (
      <div className="featuredImagesContainer">
        <div>
          <h1>Featured Images:</h1>
          <p>
            Images with <BsClock /> will animate when you hover over them
          </p>
        </div>
        <div className="featuredImagesFlex">
          {featuredImages.length ? (
            <div>
              {featuredImages.map((featuredImage) => {
                return (
                  <div>
                    {/* the two lines below are placeholders, we need to pass in MIST images instead */}
                    <MISTImage code={featuredImage.code} resolution="150"/>
                    <p> {featuredImage.code}</p>
                  </div>
                );
              })}
            </div>
          ) : (
              <div>
                <h2> No Image Found </h2>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default home;