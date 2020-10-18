// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+

/******************************************************************************
* displayImages.js provides Gallery, ImageView, and ModalView settings
* for viewing images. We expect to call use these settings on both the
* Gallery page and on the Profile/Images page.

*********************************************************************************/  

// +---------+----------------------------------------------------------------------
// | Imports |
// +---------+

import MISTImage from "./MISTImageGallery"

import React, { useContext, useState, useRef, useEffect, Component } from "react";
import {
  Button, Container, Row,
  Col, Nav, NavDropdown, Popover, Overlay, Form,
  Modal, OverlayTrigger
} from "react-bootstrap";
import { AiFillStar, AiOutlineStar,  AiOutlineDelete } from "react-icons/ai";
import { BsClock } from "react-icons/bs";
import { RiFolderAddLine } from "react-icons/ri";
import {
  FaRegShareSquare, FaRegComments, FaFacebook,
  FaSnapchat
} from "react-icons/fa";
import { FiSave, FiCode, FiSend, FiMoreHorizontal, FiFlag, FiLock, FiUnlock } from "react-icons/fi";
import { TiSocialInstagram } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io"
import {MdVisibilityOff, MdPublic} from "react-icons/md"
import { UserContext } from './Contexts/UserContext';
import {
  BrowserRouter as Router, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";
import "../../design/styleSheets/gallery.css";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)

// +-------------+-----------------------------------------------------------
// | Icons       |
// +-------------+

function AddIcon(props) {
  const [modalShow, setModalShow] = React.useState(false);
  const user = useContext(UserContext);
  return (
    <>
      <Nav.Link onClick={() => setModalShow(true)}>
        <RiFolderAddLine style={{ color: "black" }} />
      </Nav.Link>
      <AddModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        albums={user ? user.albums : null}
        img={props.img}
      />
    </>
  );
}

function AddModal(props) {

  const [chosenAlbum, setChosenAlbum] = React.useState({});
  const notSignedInMessage = 'You have to be logged in to add images to albums.';
  console.log(props.albums);

  function handleAddToAlbum(e) {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'addImageToAlbum', album: chosenAlbum, imgID: props.img._id })
    }).then(res => res.json()).
      then(data => alert(data.message)).
      then(() => window.location.reload()).
      catch(console.log)
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton >
        <Modal.Title id="contained-modal-title-vcenter">
          Select Album
            </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row style={{ justifyContent: "space-between", paddingRight: "1em" }}>
          <Col>
            {(props.albums === null) ? notSignedInMessage : <></>}
            {(!props.albums) ? <></> : props.albums.map((obj) => (
              <Button onClick={() => setChosenAlbum(obj)} variant="light">{obj.name}</Button>
            ))}
          </Col>
          <Col>
            <Row style={{ justifyContent: "flex-end" }}>
            </Row>
          </Col>
        </Row>

      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} variant="light">Cancel</Button>
        <Button onClick={handleAddToAlbum}>Add</Button>
      </Modal.Footer>
    </Modal>
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
        <Nav.Item>
        <Nav.Link onClick={handleClick} style={{ color: "black"}}>
          <FiCode />
        </Nav.Link>
        </Nav.Item>
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
                <Button variant="light" style={{ color: "black", marginRight: "1em", marginLeft: "1em" }} > Copy</Button>
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
      <Nav.Item  >
        <Nav.Link>
      <Link
        to={{
          pathname: `/img/${props.id}`,
          // This is the trick! This link sets
          // the `background` in location state.
          state: { background: location },
        }}
       
      >
  
        <FaRegComments
          style={{ color: "black"}}
        />
     
      </Link>
      </Nav.Link>
        </Nav.Item>
    )
  }

// This button deletes the album corresponding to the given albumId from the database
function DeleteAlbumIcon(props) {
  const { albumId } = props;
  function handleDeleteAlbum() {
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteAlbum', albumID: albumId })
    }).then(res => res.json()).then(data => alert(data.message)).then(() => window.location.reload())
  }

  return (
    <Button variant="light" style={{ marginLeft: "1em", marginRight: "1em" }} onClick={handleDeleteAlbum}>
      <Link to={'/profile/albums'} className="link" style={{ color: "black", styleDecoration: "none" }}> <AiOutlineDelete /></Link>
    </Button>
  )
}

  /* Flagging Icon */
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
  
     
        <NavDropdown title= {<FiMoreHorizontal  size={15} style={{color: "grey"}}/>} id="nav-dropdown" >
        <OverlayTrigger trigger="hover" placement="right" overlay={hidePopover}>
          <NavDropdown.Item onClick={() => hide()}>
            <MdVisibilityOff/>  Hide
          </NavDropdown.Item>
          </OverlayTrigger>
          <OverlayTrigger trigger="hover" placement="right" overlay={reportPopover}>
          <NavDropdown.Item href="/report">
          <FiFlag /> Report         
          </NavDropdown.Item>
          </OverlayTrigger>
        </NavDropdown>
    
    )
  
  }
  
  class PrivacyIcon extends React.Component {
    constructor(props) {
      super(props);
      this.state = {private: true};
      this.handlePrivateClick = this.handlePrivateClick.bind(this);
    }
  
    handlePrivateClick() {
      this.setState(state => ({
        private: !state.private
      }));
    }
  
    render() {
      return (
   
          <Nav.Link style={{color: "black", marginRight: "0", paddingRight: "0"}} onClick={this.handlePrivateClick}> 
            {this.state.private ? <FiLock size={15}/> : <MdPublic size={15}/>}
          </Nav.Link>
      );
    }
  }
  
/* Save Icon */
function SaveIcon(props) {
  const newProfilePic = props.code;

  function changeProfilePic() {
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        action: "changeProfilePic",
        newProfilePic: newProfilePic,
      }),
    })
      .then((res) => res.json())
      .then((message) => alert(message));
  }

  return (
    <NavDropdown title={<FiSave />} id="nav-dropdown">
      <NavDropdown.Item onClick={() => changeProfilePic()}> as my profile image </NavDropdown.Item>
      <NavDropdown.Item eventKey="4.1">as image</NavDropdown.Item>
      <NavDropdown.Item eventKey="4.2"> as video</NavDropdown.Item>
    </NavDropdown>
  );
}

  /* Share Icon */
  function ShareIcon() {
    return (
        <NavDropdown title={<FaRegShareSquare />} id="nav-dropdown" >
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
  
    );
  }

function StarIcon(props){
  const [liked, setLiked] = useState(false);
  function likeCount(){
    props.card.ratings++;
  }
  function dislikeCount(){
    props.card.ratings--;
  }
  function handleClick(){
    setLiked(!liked);
  }
  return(
    <div>
      {liked ?
       <Nav.Link style={{ color: "black", display: "inline-block" }} onClick={() => {
        handleClick();
        dislikeCount();
      }}>
        <AiFillStar size={15} />
        {props.card.ratings}
      </Nav.Link>
      :
      <Nav.Link style={{ color: "black", display: "inline-block" }} onClick={() => {
        handleClick();
        likeCount();
      }}>
        <AiOutlineStar size={15} />
        {props.card.ratings}
      </Nav.Link>
      }
      </div>
    
  )
}
export {
    AddIcon,
    CodeIcon,
    CommentIcon,
    DeleteAlbumIcon,
    MoreIcon,
    PrivacyIcon,
    SaveIcon,
    ShareIcon,
    StarIcon
}