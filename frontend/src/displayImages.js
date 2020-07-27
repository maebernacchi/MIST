/******************************************************************************
* DESCRIPTION:
* displayImages.js provides Gallery, ImageView, and ModalView settings
* for viewing images. We expect to call use these settings on both the
* Gallery page and on the Profile/Images page.
* 
* TABLE OF CONTENTS:
*   1.  Imports:
*          --react, react-dom-router, react-bootstrap, react-icon, images
*   2.  Router & Switches:
*          --displayImages.js pulls up the page to match the URL:
*               (a) the Gallery
*               (b) ImageView, a new page based on the image's ID
*               (c) ImageModal, the overlay modal based on the image's ID * 
*   3.  Main Gallery (Gallery)
*   4.  New Page Modal (ImageView)
*   5.  Overlay Modal (ImageModal)
*   6.  Additional components (icons, comments)
*********************************************************************************/

/**********************************************
 *             1. IMPORTS
 **********************************************/

import React, { useState, useRef } from "react";
import "./styleSheets/gallery.css";
import { Card, Button, Pagination, Container, Row, Col, Nav, NavDropdown,
  Popover, Overlay, Form, Modal, OverlayTrigger, Dropdown }
  from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link, useHistory,
  useLocation, useParams} from "react-router-dom";
import { BsClock } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { FiSave, FiCode, FiSend, FiMoreHorizontal } from "react-icons/fi";
import { FaRegShareSquare, FaRegComments, FaFacebook, FaSnapchat,
} from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";
import MISTImage from "./MISTImageGallery"

/* Note: We will need to add BsViewStacked
and BsLayout Split as imports. They will 
allow users to change views on the overlay modal. */

/**********************************************
 *             2. ROUTER & SWITCHES
 *
 **********************************************
 * ModalGalleryExample & ModalSwitch
 **********************************************/

/** Makes the router and calls the switcher between the URLs.
 *  Note: We should keep DisplayImages() and ModalSwitch() as 
 *  two separate functions. Combining them creates issues
 *  with transitioning between the Gallery and Modal View.
*/

export default function DisplayImages(props) {
  return (
    <Router>
      <ModalSwitch cards={props.cards} />
    </Router>
  );
}
/** Returns the relevant page based on the URL */
function ModalSwitch(props) {
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
        <Route path="/gallery" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/random" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/featured" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/top-rated" children={<Gallery cards={props.cards} />} />
        <Route path="/gallery/recent" children={<Gallery cards={props.cards} />} />
        <Route path="/profile" children={<Gallery cards={props.cards} />} />
        <Route path="/img/:id" children={<ImageView cards={props.cards} />} />
      </Switch>

      {/* Show the modal when a background page is set */}
      {background && <Route path="/img/:id" children={<ImageModal cards={props.cards} />} />}
    </div>
  );
}

/*******************************************
 *               3. GALLERY
 *
 * *****************************************
 *    How the card itself looks like
 *******************************************/
function Gallery(props) {
  let cards = props.cards;
  let location = useLocation();
  return (
    <div style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
      <Row style={{ justifyContent: "space-between" }}>
        {cards.map((card) => (
          <Card
            style={{ padding: "1em", width: "30%", margin: "1em" }}
          >
            {/* TITLE + IsANIMATED? */}
            <Card.Header>
              <Card.Title style={{ margin: "auto" }}>
                <p>{card.title}
                {card.isAnimated ? (
                  <BsClock size={15} style={{ margin: "1vh" }} />
                ) : (
                    ""
                  )}
                  </p>
              </Card.Title>

              {/* IMAGE */}
              <Link
                to={{
                  pathname: `/img/${card.id}`,
                  state: { background: location },
                }}
              >
                <div variant="top" style={{ marginTop: "1em", marginBottom: "1em" }}>
                  <Row style={{justifyContent: "center"}}>
                  <MISTImage code={card.code} resolution="250" />
                  </Row>
                </div>
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
                        {card.userId}
                      </Button>
                      {card.caption}
                    </div>
                  </Row>

                  {/************************
                   * ICONS
                   *************************/}
                  <Row
                    style={{
                      justifyContent: "center",
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
                      {card.ratings}
                    </Nav.Link>

                    {/* Code Icon */}
                    <CodeIcon code={card.code} />

                    {/* Save Icon */}
                    <SaveIcon />

                    {/* Comment Icon */}
                    <Link
                      to={{
                        pathname: `/img/${card._id}`,
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
 *                      4. IMAGE VIEW
 *
 **************************************************************************
 * What it looks like when someone tries to reach the image through the URL
 *      -- so it has it's own webpage
 **************************************************************************/

function ImageView(props) {

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);
  if (!card) return <div>Image not found</div>; 

  return (
    <div>
      <div style={{ width: "65%", margin: "auto", marginTop: "1em" }}>
        <Col>
          <h1 style={{ textAlign: "left" }}>{card.title}</h1>
          <Row>
            <Col>
              {/* IMAGE */}
              <MISTImage code={card.code} resolution="300" />
              {/* USERNAME + DESCRIPTION */}
              <Button variant="light" href="/user">
                {<b>{card.userId}</b>}
              </Button>
              {/*<b>{card.username}</b> */} {card.caption}
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
              <ModalComments cards={props.cards} />
            </Container>
          </Row>
        </Col>
      </div>
    </div>
  );
}

/********************************************************************
 *                       5. IMAGE MODAL
 *
 * ******************************************************************
 *  Comes up when someone clicks on the image from the page
 ********************************************************************/

/* Calls the Modal */
function ImageModal(props) {
  let history = useHistory();

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);

  const [modalShow] = React.useState(true);

  if (!card) return null;

  return (
    <MyVerticallyCenteredModal
      show={modalShow}
      onHide={() => history.goBack()}
      cards={props.cards}
    />
  );
}

/***************************************************
 * Overlay Modal
 ***************************************************/
function MyVerticallyCenteredModal(props) {

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);

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
            {card.userId}
          </Button>
          {/*card.username*/}
        </Container>
        <Link to={{ pathname: "/gallery" }}>Close</Link>
      </Modal.Header>

      {/* BODY */}
      <Container>
        <SideView cards={props.cards} />
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
function SideView(props) {

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);

  return (
    <Modal.Body>
      <Row>
        <Col>
          {/* IMAGE */}
          <div rounded style={{ width: "100%" }}>
            <MISTImage code={card.code} resolution="250" />
          </div>
          {/* USERNAME + DESCRIPTION (optional) */}
          { /* <Button size="sm" variant="light" href="/user">
          {<b>{card.username}</b>} </Button> */}
          {/*<b>{card.username}</b>*/} {card.caption}
          {/* FORM - RANGE - RESOLUTION (?)
           *   need to connect the position to the Image */}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>

        {/* COMMENT SECTION */}
        <Container style={{ width: "50%" }}>
          <div style={{ paddingLeft: "1em" }}></div>
          <ModalComments cards={props.cards} />
        </Container>
      </Row>
    </Modal.Body>
  );
}

//Returns a Body that puts the image ON TOP OF the comments
/* function StackedView(props) {
  let { id } = useParams();
  let cards = props.cards;
  let card = cards[parseInt(id, 10)];

  return (
    <Modal.Body>
      <Col>
        <Col> */
/*
<Image src={card.image} rounded style={{ width: "100%" }} />
*/
/*
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
} */

/*********************************************************
 *                      COMMENTS
 *
 *********************************************************
 * Used in the Overlay and the new page Views
 *********************************************************/

function ModalComments(props) {

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

        <ModalIcons cards={props.cards} />

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


function ModalIcons(props) {

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);

  return (
    <Row style={{ justifyContent: "flex-start" }}>
      {/* Rating */}
      {/** need to add that onClick,
       *      if signed in, the star changes to a filled version of it,
       *      else, alerts that "please sign in" and a sign in option in */}

      <Nav.Link style={{ color: "black", display: "inline-block" }}>
        <AiOutlineStar />
        {card.ratings}
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
