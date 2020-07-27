// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+

/******************************************************************************
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

// +---------+----------------------------------------------------------------------
// | Imports |
// +---------+

import MISTImage from "./MISTImageGallery"
import React, { useState, useRef, useEffect } from "react";
import {
  Card, Button, Pagination, Container, Row,
  Col, Nav, NavDropdown, Popover, Overlay, Form,
  Modal, OverlayTrigger, Dropdown
} from "react-bootstrap";
import { AiOutlineStar } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import {
  FaRegShareSquare, FaRegComments, FaFacebook,
  FaSnapchat
} from "react-icons/fa";
import { FiSave, FiCode, FiSend, FiMoreHorizontal } from "react-icons/fi";
import { TiSocialInstagram } from "react-icons/ti";
import {
  BrowserRouter as Router, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";
import "./styleSheets/gallery.css";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)

/* Note: We'll eventually need to add BsViewStacked
and BsLayout Split as imports. They will 
allow users to change views on the overlay modal. */

// +---------+----------------------------------------------------------------------
// | Routers |
// +---------+

/** DisplayImages returns the router and ModalSwitch.
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

/** ModalSwitch calls the relevant page based on the URL */
function ModalSwitch(props) {
  let location = useLocation();

  /* This piece of state is set when one of the gallery links is clicked.
  // The `background` state is the location that we were at when one of
  // the gallery links was clicked. If it's there, use it as the location
  // for the <Switch> so we show the gallery in the background. */
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

      {/* Show the modal when a background page is set. */}
      {background && <Route path="/img/:id" children={<ImageModal cards={props.cards} />} />}
    </div>
  );
}

// +---------+----------------------------------------------------------------------
// | Gallery |
// +---------+

function Gallery(props) {
  let cards = props.cards;
  let location = useLocation();

  return (
    <div>
      <Row style={{ justifyContent: "space-between" }}>
        {cards.map((card) => (
          <Card style={{ padding: "1em", width: "30%", margin: "1em" }}>
            <CardHeader card={card} />
            <CardImage card={card} />
            <CardBody card={card} />
          </Card>
        ))}
        <PageCounter style={{ margin: "auto" }} />
      </Row>
    </div>
  );
}

function CardHeader(props) {
  return (
    <Card.Header>
      <Card.Title style={{ margin: "auto" }}>
        {props.card.title}
        {props.card.isAnimated ? (
          <BsClock size={15} style={{ margin: "1vh" }} />
        ) : ("")}
      </Card.Title>
    </Card.Header>
  );
}

function CardImage(props) {
  let location = useLocation();

  return (
    <Link
      to={{
        pathname: `/img/${props.card._id}`,
        state: { background: location },
      }}
    >
      <div variant="top" style={{ marginTop: "1em", marginBottom: "1em" }}>
        <MISTImage code={props.card.code} resolution="250" />
      </div>
    </Link>
  );
}

function CardBody(props) {
  let card = props.card;
  return (
    <Card.Body style={{ justifyContent: "space-between" }}>
      <Col>

        {/* Row 1: Username & Description */}
        <Row style={{ justifyContent: "space-between" }}>
          {/* USERNAME + description*/}
          <div>
            <Button variant="light" href="/user">
              {card.userId.username}
            </Button>
            {card.caption}
          </div>
        </Row>

        {/* Row 2: Icons */}
        <Row style={{ justifyContent: "space-between", marginTop: "1em", }}>
          <Nav.Link style={{ color: "black", display: "inline-block" }}>
            <AiOutlineStar />
            {card.ratings}
          </Nav.Link>
          <CodeIcon code={card.code} />
          <SaveIcon />
          <FaRegComments style={{ color: "black", display: "inline-block" }} />
          <ShareIcon />
          <MoreIcon />
        </Row>

        {/* Row 3: Comment Box */}
        <MakeComment imageId={card._id} />
      </Col>
    </Card.Body>
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

// +---------+---------+------------------------------------------------------------
// | Single Image Page |
// +---------+---------+


function ImageView(props) {

  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);
  if (!card) return <div>Image not found</div>;

  return (
    <div style={{ width: "65%", margin: "auto", marginTop: "1em" }}>
      <Col>
        <h1 style={{ textAlign: "left" }}>{card.title}</h1>
        <Row>
          <Col>
            <MISTImage code={card.code} resolution="300" />
            <Button variant="light" href="/user">
              {<b>{card.userId.username}</b>}
            </Button>
            <Form>
              <Form.Control type="range" custom style={{ marginTop: "1em" }} />
            </Form>
          </Col>
          <Container style={{ width: "50%" }}>
            <ModalComments card={card} />
          </Container>
        </Row>
      </Col>
    </div>
  );
}

// +-------------+-----------------------------------------------------------
// | Image Modal |
// +-------------+

/*
ImageModal is a pop-up image view. h
It appears when the image is clicked from the gallery.
*/
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
      card={card}
    />
  );
}

/*
MyVerticallyCenteredModal returns the display portion of ImageModal.
*/
function MyVerticallyCenteredModal(props) {

  let card = props.card;

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
      <Modal.Header>
        <Container>
          <Modal.Title>{card.title}</Modal.Title>
          <Button variant="light" href="/user">
            {card.userId.username}
          </Button>
          {/*card.username*/}
        </Container>
        <Link to={{ pathname: "/gallery" }}>Close</Link>
      </Modal.Header>

      <Container>
        <SideView card={card} />
      </Container>

      <Modal.Footer style={{ minHeight: "3em" }}></Modal.Footer>
    </Modal>
  );
}


/* SideView returns the main body of the modal view.
It places the image side by side with the comments. */
function SideView(props) {
  let card = props.card;

  return (
    <Modal.Body>
      <Row>
        <Col>
          <div rounded style={{ width: "100%" }}>
            <MISTImage code={card.code} resolution="250" />
          </div>
          {card.caption}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>

        <Container style={{ width: "50%" }}>
          <div style={{ paddingLeft: "1em" }}></div>
          <ModalComments card={card} />
        </Container>

      </Row>
    </Modal.Body>
  );
}

// +-------------+-----------------------------------------------------------
// | Image Modal |
// +-------------+


function ModalComments(props) {

  const [comments, setComments] = useState([])

  // fetch the comments for this image 
  useEffect(() => {
    fetch('/api/img?id=' + props.card._id)
      .then(req => req.json())
      .then(comments => { setComments(comments); });
  }, [comments])


  return (
    <Form.Group>
      <Col>
        {comments.map((comment) => (
          <Comment username={comment.userId.username} comment={comment.body} date={comment.createdAt} />
        ))}
        {/* Horizontal Line */}
        <hr />
        <ModalIcons card={props.card} />
        <MakeComment imageId={props.card._id} />
      </Col>
    </Form.Group>
  );
}

/**
 * Allows users to write and submit comments.
 */
function MakeComment(props) {
  const [comment, setComment] = useState("");

  //Update the comment (state) as the user types it
  const handleChange = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };

  // When the user submits the comment, post to database
  const handleSubmit = (event) => {
    // prevent the page from refreshing 
    event.preventDefault();

    // build full comment
    let fullcomment = {
      "active": true,
      "flags": [],
      // NOTE: This needs to be a real user id you have on your local DB
      "userId": "5f09091de2990f3b98e18f85",
      "body": comment,
      "imageId": props.imageId
    };

    //post comment
    fetch('/api/gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fullcomment)
    })
      //reset comment state
      .then(setComment(""))
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row style={{
        justifyContent: "space-between",
        marginTop: "1em",
      }}>

        <Col xs={9}>
          <Form.Control
            name="comment"
            as="textarea"
            rows="1"
            placeholder="Type comment here"
            value={comment}
            onChange={handleChange}
          />
        </Col>

        <Col>
          <Button variant="light" type="submit">
            <FiSend style={{ color: "black" }} />
          </Button>
        </Col>

      </Form.Row>
    </Form>
  );
}

/* Example comment */
export function Comment(props) {

  function convertTime(date) {
    const timeAgo = new TimeAgo('en-US')
    if (typeof date === 'string')
      date = parseInt(date);
    return timeAgo.format(date);
  }

  return (

    <Row>
      <Card style={{ width: "100%", margin: "0.5vh" }}>
        <Card.Body style={{
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
          <div style={{
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "flex-start"
          }}>
            <Button size="sm" variant="light" href="/user" style={{ alignSelf: "flex-start" }}>
              {props.username}
            </Button>
            <div style={{ fontSize: "15px" }}>
              {convertTime(props.date)}
            </div>
          </div>
          <div style={{ flexGrow: "2", paddingLeft: "15px", fontSize: "18px" }}>
            {props.comment}
          </div>
          <MoreIcon />
        </Card.Body>
      </Card>
    </Row>
  );
}

// +-------------+-----------------------------------------------------------
// | Icons       |
// +-------------+

function ModalIcons(props) {

  let card = props.card;

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

      <CodeIcon code={card.code} />
      <SaveIcon />
      <ShareIcon />
      <MoreIcon />
    </Row>
  );
}

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