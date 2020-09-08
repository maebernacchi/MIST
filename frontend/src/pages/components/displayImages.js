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
import { RiFolderAddLine } from "react-icons/ri";
import {
  FaRegShareSquare, FaRegComments, FaFacebook,
  FaSnapchat
} from "react-icons/fa";
import { FiSave, FiCode, FiSend, FiMoreHorizontal, FiFlag } from "react-icons/fi";
import { TiSocialInstagram } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io"

import {
  BrowserRouter as Router, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";
import "../../design/styleSheets/gallery.css";
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

/**
 * The Gallery returns a set of cards and the pagination
 *    -- normally, gallery is displayed when displayImages is called.
 *  
 * It takes in the cards array, 
 * and calls it on the header, image, and body component of the card
 */
function Gallery(props) {
  let cards = props.cards;

  return (
    /* styling helps with footer */
    <Container style={{ marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem" }}>
      <Row style={{ justifyContent: "space-between" }}>
        {/* maps each array in the cards array */}
        {cards.map((card) => (
          <Card style={{ padding: "1em", width: "30%", margin: "1em" }}>
            <CardHeader card={card} />
            <CardImage card={card} />
            <CardBody card={card} />
          </Card>
        ))}
        {/* pagination */}
        <PageCounter style={{ margin: "auto" }} />
      </Row>
    </Container>
  );
}

/**
 * Displays the header of the card
 *    | title
 *    | clock sign (if animated)
 *    | More Icon for Report and Hide
 * 
 * takes in the information of one card
 */
function CardHeader(props) {
  return (
    <Card.Header>
      <Card.Title style={{ margin: "auto" }}>
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* Title + Clock sign */}
          <Col>
            <p1>
              {props.card.title}
              {props.card.isAnimated ? (
                <BsClock size={15} style={{ margin: "1vh" }} />
              ) : ("")}
            </p1>
          </Col>

          <FlaggingIcon />

        </Row>

      </Card.Title>
    </Card.Header>
  );
}

/**
 * Returns the MISTImage of a card
 * 
 * Takes in the information of one card.
 */
function CardImage(props) {
  let location = useLocation();

  return (
    /* Setting up the pathname and background for overlay */
    <Link
      to={{
        pathname: `/img/${props.card._id}`,
        state: { background: location },
      }}
    >
      <div variant="top" >
        <Row style={{ justifyContent: "center", marginTop: "1em" }}>
          <MISTImage code={props.card.code} resolution="250" />
        </Row>
      </div>
    </Link>
  );
}

/**
 * Returns the Body of a card
 *    | Username + Description
 *    | Icons
 *    | Write a Comment
 * 
 * Takes in the information of one card.
 */
function CardBody(props) {
  let card = props.card;
  return (
    <Card.Body style={{ justifyContent: "space-between" }}>
      <Col>

        {/* Row 1: Username & Description */}
        {/* USERNAME + description*/}
        <Row style={{ justifyContent: "space-between" }}>
          <Button variant="light" href="/user">
            {card.userId.username}
          </Button>
          <Nav.Link style={{ color: "black", display: "inline-block" }}>
            <AiOutlineStar />
            {card.ratings}
          </Nav.Link>


          {/*   {card.caption}*/}
        </Row>

        {/* Row 2: Icons */}
        <Row style={{ justifyContent: "space-between", marginTop: "1em", }}>


          <CodeIcon code={card.code} />
          <SaveIcon />
          <CommentIcon id={card._id} />
          <AddIcon />
          <ShareIcon />


        </Row>

        {/* Row 3: Comment Box */}
        <MakeComment imageId={card._id} />
      </Col>
    </Card.Body>
  );
}

/**
 * Returns the page counter
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

// +---------+---------+------------------------------------------------------------
// | Single Image Page |
// +---------+---------+
/**
 * This is being called when someone accesses an image through its URL
 * and not by clicking on a smaller version of it on a card
 * 
 * Takes in the cards array.
 * 
 * Col 1:
 *  | Row 1: title + image
 *  | Row 2: username
 *  | Row 3: Range to change resolution
 * 
 * Col 2:
 *  | Comments
 */
function ImageView(props) {
  let { id } = useParams();
  let card = props.cards.find(elem => elem._id === id);
  if (!card) return <div>Image not found</div>;

  return (
    <Container style={{ width: "65%", justifyContent: "center", marginTop: "1em" }}>
      <Col>
        <Row>
          <Col xs="4">
            <h1 style={{ fontSize: "150%", textAlign: "left" }} >{card.title}</h1>
            <MISTImage code={card.code} resolution="300" />
            <Row>
              <Button variant="light" href="/user">
                {<b>{card.userId.username}</b>}
              </Button>
            </Row>
            {/* change resolution */}
            <Form>
              <Form.Control type="range" custom style={{ marginTop: "1em", width: "100%" }} />
            </Form>
          </Col>
          {/* Comments */}
          <Col xs="8">
            <ModalComments card={card} />
          </Col>
        </Row>
      </Col>
    </Container>
  );
}

// +-------------+-----------------------------------------------------------
// | Image Modal |
// +-------------+

/**
 * ImageModal is a overlay image view. 
 * It appears when the image is clicked from the gallery.
 * 
 * It takes in the array of cards
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

/**
 * MyVerticallyCenteredModal returns the display portion of ImageModal.
 * 
 * It takes in one card, show state, and onHide function
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
      {/* Modal Header: title + close button */}
      <Modal.Header>
        <Container>
          <Modal.Title>{card.title}</Modal.Title>
        </Container>
        <Link to={{ pathname: "/gallery" }}>Close</Link>
      </Modal.Header>

      {/* Modal Body */}
      <Container>
        <SideView card={card} />
      </Container>

      {/* Modal Footer */}
      <Modal.Footer style={{ minHeight: "3em" }}></Modal.Footer>
    </Modal>
  );
}


/**
 * SideView returns the main body of the modal view.
 * It places the image side by side with the comments.
 * 
 * Takes in the information of a card
 */
function SideView(props) {
  let card = props.card;

  return (
    <Modal.Body>
      <Row >
        {/* Col 1: usernamame, image, caption, range*/}
        <Col>
          {/* username */}
          <Button variant="light" href="/user">
            {card.userId.username}
          </Button>

          {/* image */}
          <Row style={{ justifyContent: "center", marginTop: "1em" }}>
            <MISTImage code={card.code} resolution="250" />
          </Row>

          {/* caption */}
          <Row>
            {card.caption}
          </Row>

          {/* range for resolution */}
          <Form>
            <Form.Control type="range" custom style={{ marginTop: "1em" }} />
          </Form>
        </Col>

        {/* Col 2: Comments*/}
        <Col style={{ width: "50%" }}>
          <div style={{ paddingLeft: "1em" }}></div>
          <ModalComments card={card} />
        </Col>

      </Row>
    </Modal.Body>
  );
}

// +----------------+-----------------------------------------------------------
// | Modal Comments |
// +----------------+


function ModalComments(props) {

  const [comments, setComments] = useState([])

  // fetch the comments for this image 
  useEffect(() => {
    fetch('/api?action=getImageComments&id=' + props.card._id)
      .then(req => req.json())
      .then(comments => { setComments(comments); });
  }, [comments])


  return (
    <Col>
      <Form.Group >
        {/* All existing comments */}
        <Container style={{ overflowY: "scroll", height: "40vh" }}>
          {comments.map((comment) => {
            return (
              <Comment username={comment.userId.username} comment={comment.body} date={comment.createdAt} />
            )
          })}
        </Container>

        {/* Horizontal Line */}
        <hr />
        {/* Icons and to make a comment field */}
        <ModalIcons card={props.card} />
        <MakeComment imageId={props.card._id} />

      </Form.Group>
    </Col>

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

    // grab user information
    fetch('/api?action=getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(user => {
        if (user) {

          console.log("user: ", user);
          // build full comment
          let fullcomment = {
            "active": true,
            "flags": [],
            "userId": user._id,
            "body": comment,
            "imageId": props.imageId
          };

          //post comment
          fetch('/api', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'postComment', ...fullcomment })
          })
            //reset comment state
            .then(setComment(""))
        }
        else
          alert("You must be logged in to make comments")
      })
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row style={{
        justifyContent: "space-between",
        marginTop: "1em",
      }}>
        {/* Box to type comment in */}
        <Col xs={10}>
          <Form.Control
            name="comment"
            as="textarea"
            rows="1"
            placeholder="Type comment here"
            value={comment}
            onChange={handleChange}
          />
        </Col>

        {/* Send message button */}
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
          <FlaggingIcon />
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
      <AddIcon />
      <ShareIcon />
      <FlaggingIcon />
    </Row>
  );
}

/* Code Icon */
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
      <Nav.Link onClick={handleClick} style={{ color: "black", paddingLeft: "0", paddingRight: "0" }}>
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
              <Nav.Link style={{ color: "black" }} > Copy</Nav.Link>
            </Row>
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}

/* Comment Icon */
function CommentIcon(props) {
  let location = useLocation();
  return (
    <Link
      to={{
        pathname: `/img/${props.id}`,
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
  )
}

/* Flagging Icon */
//... = hide, block, report

function FlaggingIcon() {

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

    <Nav>
      <NavDropdown title= {<FiFlag />} id="nav-dropdown">
      <OverlayTrigger trigger="hover" placement="right" overlay={hidePopover}>
        <NavDropdown.Item onClick={() => hide()}>
            Hide
        </NavDropdown.Item>
        </OverlayTrigger>
        <OverlayTrigger trigger="hover" placement="right" overlay={reportPopover}>
        <NavDropdown.Item href="/report">
            Report         
        </NavDropdown.Item>
        </OverlayTrigger>
      </NavDropdown>
    </Nav>
  )

}

function AddIcon() {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <Nav.Link onClick={() => setModalShow(true)}>
        <RiFolderAddLine style={{ color: "black", display: "inline-block" }} />


      </Nav.Link>



      <AddModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

function AddModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton >
        <Modal.Title id="contained-modal-title-vcenter">
          Choose Albums
          </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row style={{ justifyContent: "space-between", paddingRight: "1em" }}>
          <Col>
          <Form>

            <div key={'default-checkbox'} className="mb-3">
              {/* needs to be mapped */}
              <Form.Check
                type={'checkbox'}
                id={`default-checkbox`}
                label={`Album name 2`}
              />
              <Form.Check
                type={'checkbox'}
                id={`default-checkbox`}
                label={`Album name 3`}
              />
              <Form.Check
                type={'checkbox'}
                id={`default-checkbox`}
                label={`Album name 4`}
              />
            </div>
          </Form>
          </Col>
          <Col>
          <Row style={{justifyContent: "flex-end"}}>
            <Button variant="outline-secondary">
              <IoMdAdd /> Create Album
          </Button>
          </Row>
          </Col>
        </Row>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={props.onHide}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
}

/* Share Icon */
function ShareIcon() {
  return (
    <Nav >
      <NavDropdown title={<FaRegShareSquare />} id="nav-dropdown">
        {/* Facebook */}
        <NavDropdown.Item eventKey="4.1">
          {" "}
          <FaFacebook /> Facebook
        </NavDropdown.Item>

        {/* Instagram */}
        <NavDropdown.Item eventKey="4.2">
          <TiSocialInstagram /> Instagram
        </NavDropdown.Item>

        {/* Snapchat */}
        <NavDropdown.Item eventKey="4.3">
          {" "}
          <FaSnapchat /> Snapchat
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}


/* Save Icon */
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