import React, { Component } from "react";
import "./../design/styleSheets/home.css";
import LinkButton from "./components/LinkButton";
import { NavLink } from "react-router-dom";
import MistLogo from "./../design/Logos/logoFinal.png";
import { Button, Container, Row, Col } from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import MISTImage from "./components/MISTImageGallery"

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
      <Container fluid style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
        <Intro />

        <ButtonContainer />
        <BottomText />
        <FeaturedImages />
      </Container>
    );
  }
}


function Intro() {
  return (
    <Row style={{ justifyContent: "center" }}>
      <img src={MistLogo} alt="MIST Logo" />
      <p1 style={{ alignItems: "center", margin: "auto 0 auto 5vh" }}>
        <p1 style={{ fontSize: "200%" }}>
          The Mathematical Synthesis Toolkit
        </p1>
        <p1 style={{ fontSize: "150%", color: "grey" }}>
          <hr />
        Create abstract images and animations
       <br />
       using simple math functions
       </p1>
      </p1>
    </Row>
  );
}

/*
  ButtonContainer returns the buttons Tutorials, Create, and Gallery.
  */
function ButtonContainer() {
  return (
    <Row id="homeButtons" style={{ justifyContent: "center" }}>
      <LinkButton to="/tutorial" className="linkButton">
        <b>Tutorials</b>
      </LinkButton>


      <LinkButton to="/createWorkspace" className="linkButton" id="middleButton">
        Create
      </LinkButton>


      <LinkButton to="/gallery" className="linkButton">
        Gallery
      </LinkButton>

    </Row>
  );
}

/*
  BottomText retuns text that is featured on the bottom of the page. 
  This text includes the "public beta" notice and the warning.
  */
function BottomText() {
  return (
    <Container>
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
    </Container>
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
          border: "solid",
          borderWidth: "1px",
          borderRadius: "10px",

          width: "80%",

          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "1vh",
          marginBottom: "1vh",

          paddingTop: "2vh",
          paddingBottom: "2vh",
          paddingLeft: "5vh",
          paddingRight: "5vh"
        }}>

        <Row style={{ justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "150%" }}>Featured Images:</h2>
            <p1>
              Images with <BsClock /> will animate when you hover over them
            </p1>
          </div>

          <div>
            <Button variant="outline-dark" href="/gallery"> See More </Button>
          </div>
        </Row>
        <Row className="featuredImagesFlex">
          {featuredImages.length ? (
            <Row >
              {featuredImages.map((featuredImage) => {
                return (
                  <Col>
                    {/* the two lines below are placeholders, we need to pass in MIST images instead */}
                    <MISTImage code={featuredImage.code} resolution="150" />
                    {/*<p> {featuredImage.code}</p>*/}
                  </Col>
                );
              })}
            </Row>
          ) : (
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