/******************************************************************************
 * There's a lot of code here, so here is an overview of the functions
 * (Maybe it can help reading through the code)
 *
 * We organized it into 7 parts:
 *   1.  Imports
 *          --react, react-dom-router, react-bootstrap, react-icon, images
 *   2.  Router & Switches -- for the URL
 *          --ModalGalleryExample,
 *               makes a Router so we can have new URLs. It calls the ModalSwitch
 *          --ModalSwitch,
 *               in charge of pulling up the thing with the right URL
 *               could direct to 3 things:
 *
 *                  brings up the gallery
 *                     -- which is the *Gallery* function
 *
 *                  brings up a new page based on the img's id
 *                     -- which is the *ImageView* function
 *
 *                  brings up the overlay modal based on the img's id
 *                     -- which is the *ImageModal* function
 *
 *
 *   3.  Constant data coming from the BACKEND -- cards + comments
 *          -- stores informations of each cards
 *                such as description, username, rating, image, comments, etc
 *   4.  Main Gallery (Gallery)
 *   5.  New Page Modal (ImageView)
 *   6.  Overlay Modal (ImageModal)
 *   7.  Additional components (icons, comments)
 *********************************************************************************/

/**********************************************
 *             1. IMPORTS
 *
 **********************************************
 * react, react-bootstrap, react-router-dom,
 * images, react-icons
 **********************************************/

/********************************************************************
 * Imports in the elements from react-bootstrap
 *    it doesn't work if React, useState, useRef are in the same {}
 ********************************************************************/
import React from "react";

import { useState, useRef } from "react";

import "./styleSheets/gallery.css";

/************************************************
 * Imports the elements from react-bootstrap
 ************************************************/
import {
  Card,
  Button,
  Pagination,
  Container,
  Row,
  Col,
  Nav,
  NavDropdown,
  Popover,
  Overlay,
  Form,
  Modal,
  Image,
  Breadcrumb,
  OverlayTrigger,
  Dropdown
} from "react-bootstrap";

/************************************
 * Imports from react-router-dom,
 *    helps with the different URLs
 ************************************/

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  Redirect,
} from "react-router-dom";

/** *********************************************
 * Images for the cards
 *     We will not need these in the end product
 **************************************************/
import FeaturedImage1 from "./featuredImages/pic1.png";
import FeaturedImage2 from "./featuredImages/pic2.png";
import FeaturedImage3 from "./featuredImages/pic3.png";
import FeaturedImage4 from "./featuredImages/pic4.png";

/** *********************************************
 * Imports ICONS from react-icons
 **************************************************/

/* BsViewStacked and BsLayoutSplit is not used as of now
      would be used on the overlay modal, to let users change views*/
import { BsClock, BsViewStacked, BsLayoutSplit } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { FiSave, FiCode, FiSend, FiMoreHorizontal } from "react-icons/fi";
import {
  FaRegShareSquare,
  FaRegComments,
  FaFacebook,
  FaSnapchat,
} from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";

/**********************************************
 *             2. ROUTER & SWITCHES
 *
 **********************************************
 * ModalGalleryExample & ModalSwitch
 **********************************************/

/** Makes the router and calls the switcher between the URLs */
export default function DisplayImages() {
  return (
    <Router>
      <ModalSwitch />
    </Router>
  );
}

/** Returns the relevant page based on the URL */
function ModalSwitch() {
  let location = useLocation();

  // This piece of state is set when one of the
  // gallery links is clicked. The `background` state
  // is the location that we were at when one of
  // the gallery links was clicked. If it's there,
  // use it as the location for the <Switch> so
  // we show the gallery in the background, behind
  // the modal.
  let background = location.state && location.state.background;

  return (
    <div>
      <Switch location={background || location}>
        <Route path="/gallery" children={<Gallery />} />
        <Route path="/img/:id" children={<ImageView />} />
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/img/:id" children={<ImageModal />} />}
    </div>
  );
}

/**********************************************************
 *        3. DATA THAT SHOULD COME FROM BACKEND
 *
 **********************************************************
 * CARDS has fields:
 *    id:
 *      this should be a number between 0 and the length of this list -- might be a problem
 *      this is also corresponds with the URL which is '/img/id'
 *    title:
 *      the title of the image
 *    url:
 *      URL name, if we find a way to not having to do the /img/id -- this could be more distinguishable this way
 *      The URL name is basically would be the title with "-" instead of spaces
 *    image:
 *      the image on the particular card
 *    description:
 *      optional, a description given by the user or "" (null)
 *    rating:
 *      the rating of this image
 *    username:
 *      the maker of this image
 *    isAnimated:
 *      if it is animated
 *    code:
 *      the code for this image
 * **********************************************************
 * COMMENTS has fields: -- maybe will have its seperate or will be a cards field. -- not sure how to call it in yet
 *    id:
 *      matches up with the corresponding card
 *    username:
 *      username of the maker
 *    comment:
 *      comment the user wrote
 **********************************************************/

/** Might be a problems:
 *      seems like it renders based on the id, and only works for id-s
 *      that 0<= id <= (length - 1)
 */

/** CARDS */
const cards = [
  {
    id: 0,
    title: "black & white waves",
    url: "black-and-white-waves",
    image: FeaturedImage1,
    description: "",
    rating: 4,
    username: "@citassy",
    isAnimated: true,
    code: "sin(x)+cos(y)",
    comments: "",
  },

  {
    id: 1,
    title: "Christmas Lights",
    url: "colorful-circles",
    image: FeaturedImage2,
    description: "Merry Chrsitmas everyone!",
    rating: 10,
    username: "@vumaiphu",
    isAnimated: false,
    code: "sin(x)+cos(y)",
    comments: "",
  },

  {
    id: 2,
    title: "hypnotize",
    url: "hypnotize",
    image: FeaturedImage3,
    rating: 10,
    username: "@berhane",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },

  {
    id: 3,
    title: "colors and curves",
    url: "colors-and-curves",
    image: FeaturedImage4,
    rating: 7,
    username: "@rebelsky",
    isAnimated: false,
    code: "sin(x)+cos(y)",
  },

  {
    id: 5,
    title: "hypnotize",
    url: "hypnotize",
    image: FeaturedImage3,
    rating: 10,
    username: "@berhane",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },

  {
    id: 5,
    title: "colors and curves",
    url: "colors-and-curves",
    image: FeaturedImage4,
    rating: 7,
    username: "@rebelsky",
    isAnimated: true,
    code: "sin(x)+cos(y)",
  },
];

/*******************************************
 *               4. GALLERY
 *
 * *****************************************
 *    How the card itself looks like
 *******************************************/
function Gallery() {
  let location = useLocation();
  return (
    <div>
      <Row style={{ justifyContent: "space-between" }}>
        {cards.map((card, idx) => (
          <Card
            key={idx}
            style={{ padding: "1em", width: "30%", margin: "1em" }}
          >
            {/* TITLE + IsANIMATED? */}
            <Card.Header>
              <Card.Title style={{ margin: "auto" }}>
                {card.title}
                {card.isAnimated ? (
                  <BsClock size={15} style={{ margin: "1vh" }} />
                ) : (
                    ""
                  )}
              </Card.Title>

              {/* IMAGE */}
              <Link
                to={{
                  pathname: `/img/${card.id}`,
                  state: { background: location },
                }}
              >
                <Card.Img
                  variant="top"
                  src={card.image}
                  style={{ marginTop: "1em", marginBottom: "1em" }}
                />
              </Link>

              {/* ICONS */}
              <Card.Body style={{ justifyContent: "space-between" }}>
                <Col>
                  {/************************
                   * username + description ROW
                   *************************/}
                  <Row style={{ justifyContent: "space-between" }}>
                    {/* USERNAME + description*/}

                    <div>
                      {" "}
                      { /*<b>{card.username} </b> */}
                      <Button variant="light" href="/user">
                        {card.username}
                      </Button>
                      {card.description}
                    </div>
                  </Row>

                  {/************************
                   * ICONS
                   *************************/}
                  <Row
                    style={{
                      justifyContent: "space-between",
                      marginTop: "1em",
                    }}
                  >
                    {/* Rating */}

                    {/** need to add that onClick,
                     *      if signed in, the star changes to a filled version of it,
                     *      else, alerts that "please sign in" and a sign in option in*/}

                    <Nav.Link
                      style={{ color: "black", display: "inline-block" }}
                    >
                      <AiOutlineStar />
                      {card.rating}
                    </Nav.Link>

                    {/* Code Icon */}
                    <CodeIcon code={card.code} />

                    {/* Save Icon */}
                    <SaveIcon />

                    {/* Comment Icon */}
                    <Link
                      to={{
                        pathname: `/img/${card.id}`,
                        // This is the trick! This link sets
                        // the `background` in location state.
                        state: { background: location },
                      }}
                      style={{ paddingTop: "0.5em" }}
                    >
                      <FaRegComments
                        style={{ color: "black", display: "inline-block" }}
                      />
                    </Link>

                    {/* Share Icon */}
                    <ShareIcon />

                    {/* More Icon */}
                    <MoreIcon />

                  </Row>

                  {/*****************************
                   * TYPE COMMENT HERE SECTION
                   *******************************/}
                  <Row>
                    <div style={{ width: "90%" }}>
                      {/* Type comment here */}
                      <Form.Control
                        as="textarea"
                        rows="1"
                        placeholder="Type comment here"
                      />
                    </div>

                    {/* Submit icon */}
                    <div style={{ width: "10%" }}>
                      <Nav.Link>
                        {" "}
                        <FiSend style={{ color: "black" }} />{" "}
                      </Nav.Link>
                    </div>
                  </Row>
                </Col>
              </Card.Body>
            </Card.Header>
          </Card>
        ))}
        {/* Counting the page */}
        <PageCounter style={{ margin: "auto" }} />
      </Row>
    </div>
  );
}

{
  /* Returns a page counter */
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

/**************************************************************************
 *                      5. IMAGE VIEW
 *
 **************************************************************************
 * What it looks like when someone tries to reach the image through the URL
 *      -- so it has it's own webpage
 **************************************************************************/

function ImageView() {
  let location = useLocation();
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];

  if (!card) return <div>Image not found</div>;

  return (
    <div>
      <div style={{ width: "65%", margin: "auto", marginTop: "1em" }}>
        <Col>
          <h1 style={{ textAlign: "left" }}>{card.title}</h1>
          <Row>
            <Col>
              {/* IMAGE */}
              <Image src={card.image} rounded style={{ width: "100%" }} />
              {/* USERNAME + DESCRIPTION */}
              <Button variant="light" href="/user">
                {<b>{card.username}</b>}
              </Button>
              {/*<b>{card.username}</b> */} {card.description}
              {/* PIXEL SLIDE / RANGE FORM */}
              <Form>
                <Form.Control
                  type="range"
                  custom
                  style={{ marginTop: "1em" }}
                />
              </Form>
            </Col>
            <Container style={{ width: "50%" }}>
              {/* COMMENTS */}
              <ModalComments />
            </Container>
          </Row>
        </Col>
      </div>
    </div>
  );
}

/********************************************************************
 *                       6. IMAGE MODAL
 *
 * ******************************************************************
 *  Comes up when someone clicks on the image from the page
 ********************************************************************/

/* Calls the Modal */
function ImageModal() {
  let history = useHistory();
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];
  const [modalShow, setModalShow] = React.useState(true);

  if (!card) return null;

  return (
    <MyVerticallyCenteredModal
      show={modalShow}
      onHide={() => history.goBack()}
    />
  );
}

/***************************************************
 * Overlay Modal
 ***************************************************/
function MyVerticallyCenteredModal(props) {
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{
        width: "100%",
      }}
    >
      {/* HEADER */}
      <Modal.Header>
        <Container>
          <Modal.Title>{card.title}</Modal.Title>
          <Button variant="light" href="/user">
            {card.username}
          </Button>
          {/*card.username*/}
        </Container>
        <Link to={{ pathname: "/gallery" }}>Close</Link>
      </Modal.Header>

      {/* BODY */}
      <Container>
        <SideView />
      </Container>

      {/* FOOTER */}
      <Modal.Footer style={{ minHeight: "3em" }}></Modal.Footer>
    </Modal>
  );
}

/***********************************************************************
 *                        The BODY OF THE MODAL
 *
 * *********************************************************************
 * SideView is the only one being used right now
 *    StackedView works, but need to connect it with a button in the end
 ***********************************************************************/

//Returns a Body that puts the image NEXT TO the comments
function SideView() {
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];

  return (
    <Modal.Body>
      <Row>
        <Col>
          {/* IMAGE */}
          <Image src={card.image} rounded style={{ width: "100%" }} />
          {/* USERNAME + DESCRIPTION (optional) */}
          { /* <Button size="sm" variant="light" href="/user">
          {<b>{card.username}</b>} </Button> */}
          {/*<b>{card.username}</b>*/} {card.description}
          {/* FORM - RANGE - RESOLUTION (?)
           *   need to connect the position to the Image */}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>

        {/* COMMENT SECTION */}
        <Container style={{ width: "50%" }}>
          <div style={{ paddingLeft: "1em" }}></div>
          <ModalComments />
        </Container>
      </Row>
    </Modal.Body>
  );
}

//Returns a Body that puts the image ON TOP OF the comments
function StackedView() {
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];

  return (
    <Modal.Body>
      <Col>
        <Col>
          {/* IMAGE */}
          <Image src={card.image} rounded style={{ width: "100%" }} />

          {/* DESCRIPTION (optional) */}
          {card.description}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>
        <Container style={{ width: "50%" }}>
          <ModalComments />
        </Container>
      </Col>
    </Modal.Body>
  );
}

/*********************************************************
 *                      COMMENTS
 *
 *********************************************************
 * Used in the Overlay and the new page Views
 *********************************************************/

function ModalComments() {
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];
  return (
    <Form.Group>
      <Col>
        {/* COMMENTS */}
        <Comment />
        <Comment />
        <Comment />

        {/* HORIZONTAL LINE */}
        <hr />

        {/* ICONS */}

        <ModalIcons />

        {/* Form to write comment */}
        <Row style={{ width: "100%" }}>
          {/* text area */}
          <Container style={{ width: "90%", marginRight: "0" }}>
            <Form.Control as="textarea" rows="2" placeholder="Type here" />
          </Container>

          {/* send it icon */}
          <Container style={{ width: "10%" }}>
            <Nav.Link style={{ padding: "0" }}>
              {" "}
              <FiSend style={{ color: "black" }} />{" "}
            </Nav.Link>
          </Container>
        </Row>
      </Col>
    </Form.Group>
  );
}

/* 1 comment */
export function Comment() {
  return (
    <Row>
      <Card style={{ width: "100%", margin: "0.5vh" }}>
        <Card.Body style={{ display: "flex", flexFlow: "row nowrap", justifyContent: "space-around" }}>
          <div>
            {/*<b>@username</b> */}
            <Button size="sm" variant="light" href="/user">
              @username
            </Button>
          </div>
          <div style={{ flexGrow: "2", paddingLeft: "10px" }}>
            This is a comment
          </div>
          <MoreIcon />
        </Card.Body>
      </Card>
    </Row>
  );
}

/*******************************
 *            ICONS
 *
 *******************************
 * Code, Share, Save, ModalIcons
 *******************************/

//Code
function CodeIcon(props) {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <div ref={ref}>
      <Nav.Link onClick={handleClick} style={{ color: "black" }}>
        <FiCode />
      </Nav.Link>
      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Title as="h3" title={"<FiCode/>"}></Popover.Title>
          <Popover.Content>
            <Container>{props.code}</Container>
            <Row style={{ justifyContent: "flex-end" }}>
              <Nav.Link style={{ color: "black" }}> Copy</Nav.Link>
            </Row>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}

//... = hide, block, report
function MoreIcon() {

  function hide() {
    alert("You have hidden this content and will no longer see it again.")
  }

  let hidePopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        This content will be hidden from you.
    </Popover.Content>
    </Popover>
  );

  let reportPopover = (
    <Popover id="popover-basic">
      <Popover.Content>
        Report this content.
    </Popover.Content>
    </Popover>
  );

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" >
        {<FiMoreHorizontal />}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item>
          <OverlayTrigger trigger="hover" placement="right" overlay={hidePopover}>
            <Button variant="light" onClick={() => hide()}>Hide</Button>
          </OverlayTrigger>
        </Dropdown.Item>
        <Dropdown.Item href="/report">
          <OverlayTrigger trigger="hover" placement="right" overlay={reportPopover}>
            <Button variant="light">Report</Button>
          </OverlayTrigger>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )

}

//Share
function ShareIcon() {
  return (
    <Nav>
      <NavDropdown title={<FaRegShareSquare />} id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1">
          {" "}
          <FaFacebook /> Facebook
        </NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2">
          <TiSocialInstagram /> Instagram
        </NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">
          {" "}
          <FaSnapchat /> Snapchat
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

//Save
function SaveIcon() {
  return (
    <Nav>
      <NavDropdown title={<FiSave />} id="nav-dropdown">
        <NavDropdown.Item eventKey="4.1">as image</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.2"> as video</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}


function ModalIcons() {
  let { id } = useParams();
  let card = cards[parseInt(id, 10)];
  return (
    <Row style={{ justifyContent: "flex-start" }}>
      {/* Rating */}
      {/** need to add that onClick,
       *      if signed in, the star changes to a filled version of it,
       *      else, alerts that "please sign in" and a sign in option in */}

      <Nav.Link style={{ color: "black", display: "inline-block" }}>
        <AiOutlineStar />
        {card.rating}
      </Nav.Link>

      {/* Code Icon */}
      <CodeIcon code={card.code} />

      {/* Save Icon */}
      <SaveIcon />

      {/* Share Icon */}
      <ShareIcon />

      {/* More Icon */}
      <MoreIcon />
    </Row>
  );
}
