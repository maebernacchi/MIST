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
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */

// +----------------+-----------------------------------------------------------------------
// | Design Issues  |
// +----------------+

/**
 * The page is made up of the following parts:
 *    --First Part
 *        | Profile Image + user information
 *        | IconsBar: # of pictures, likes, badges, challenges
 *    --Profile Nav
 *        | images: calls displayImages.js
 *        | albums: function Albums 
 *            + Carousel
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React, { useState, useEffect, Component } from "react";
import DisplayImages from "./components/displayImages";
import "./../design/styleSheets/profile.css";
import "./../design/styleSheets/generalStyles.css";
import { Button, ButtonGroup, Card, Carousel, Container, Col, Form, Modal, Nav, Row, Tab, ToggleButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from "./components/MISTImageGallery"
import EdiText from 'react-editext'
/* icons */
import {
  AiOutlinePicture,
  AiOutlineStar,
  AiOutlineSetting,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";
import { IoIosArrowBack, IoMdAdd, IoIosClose } from "react-icons/io"
import {
  BrowserRouter as Router, Switch, Route, Link,
  useHistory, useLocation, useParams
} from "react-router-dom";

// +-------------------+----------------------------------------------------------------------
// | profile.js        |
// +-------------------+

/** Returns images, albums, or an opened album view -- also changes the URL */

export default function ProfileNavigation (props) {
  const [activeTab, setActiveTab] = useState(true);

  function ActivateImages(){
    setActiveTab(true)
  }
  function ActivateAlbums(){
    setActiveTab(false)
  }
      return (
        <Container>
          {activeTab ? <ActiveImages onClick={ActivateAlbums}/> : <ActiveAlbums onClick={ActivateImages}/>}
          <div className="tabs">
            <Switch>
              <Route path={'/profile'} exact component={() => <Images images={props.images} albums={props.albums} />} />
              <Route path={'/profile/images'} exact component={() => <Images images={props.images} albums={props.albums} />} />
              <Route path={'/profile/albums'} component={() => <Albums albums={props.albums} />} />
              <Route path={'/profile/:id'} component={() => <OpenedAlbum albums={props.albums} />} />
            </Switch>
          </div>
        </Container>
      );
    
  }

/** Navigation Bar looks like this when Images is clicked */
  function ActiveImages(props){
    return(
      <div className="links">
          <Nav fill variant="tabs" defaultActiveKey="images">
          
            <Nav.Item>
            <Link to={'/profile/images'} className="link">
              <Button variant="light" style={{width: "100%"}} active
              > 
              Images 
              </Button>
              </Link>
            </Nav.Item>
            <Nav.Item>
            <Link to={'/profile/albums'} className="link"><Button variant="light" style={{width: "100%"}} 
            onClick={() => {
              props.onClick();
            }}>
          
            Albums </Button></Link>
            </Nav.Item>
            <Nav.Item style={{visibility: "hidden", maxWidth: "0%"}}>
            <Link to={'/profile/:id'} className="link">OpenedAlbum</Link>
            </Nav.Item>
            </Nav>
          </div>
    )
  }

/** Navigation Bar looks like this when Albums is clicked */
  function ActiveAlbums(props){
    return(
      <div className="links">
          <Nav fill variant="tabs" defaultActiveKey="images">
          
            <Nav.Item>
            <Link to={'/profile/images'} className="link">
              <Button variant="light" style={{width: "100%"}}
              onClick={() => {
                props.onClick();
              }}>
              Images 
              </Button>
              </Link>
            </Nav.Item>
            <Nav.Item>
            <Link to={'/profile/albums'} className="link"><Button variant="light" style={{width: "100%"}} active
            >Albums </Button></Link>
            </Nav.Item>
            <Nav.Item style={{visibility: "hidden", maxWidth: "0%"}}>
            <Link to={'/profile/:id'} className="link">OpenedAlbum</Link>
            </Nav.Item>
            </Nav>
          </div>
    )
  }
  
  /** Displays images if Images is called */
  function Images(props){
    return(
      <DisplayImages cards={props.images} cardsLoaded={true} albums={props.albums}/> 
    )
  }
  
  /** Displays albums view when Albums is called */
  function Albums(props){
  const [images, setImages] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
    return(
      <Col style={{ marginTop: "1em" }}>
        <Row style={{ justifyContent: "flex-end" }}>
          <Button variant="outline-secondary" onClick={() => setModalShow(true)}>
            <IoMdAdd /> Create Album
          </Button>
        </Row>
        <Row>
          {console.log(props.albums)}
          {props.albums.map((album, index) => (
            <Card
              style={{ padding: "1em", width: "30%", margin: "1em" }}
            >
              <Card.Header>
                <Card.Title style={{ margin: "auto" }}>
                  <p>{album.name}</p>
                </Card.Title>
                {/* ICONS */}
                <Card.Body style={{ justifyContent: "space-between" }}>
                
                  <ControlledCarousel album={album} />
                  
                  <p>{album.caption}</p>
                  <p>{album.updatedAt}</p>
                </Card.Body>
              </Card.Header>
            </Card>
          ))}
        </Row>
        <AddAlbumModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      </Col>
    )
  }
  
// carousel used for looking through albums
function ControlledCarousel(props) {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      {props.album.images.map(image => (
        <Carousel.Item >
          <Row style={{ justifyContent: "center" }}>
          <Link to={{ pathname: `/profile/${props.album._id}`}} className="link">
              <MISTImage
                code={image.code}
                resolution="250"
              />
              </Link>
          </Row>
          <Carousel.Caption>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}


function AddAlbumModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Album
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            // following this: https://stackoverflow.com/questions/63182107/react-bootstrap-get-value-from-form-on-submit
            const formData = new FormData(e.target),
              formDataObj = Object.fromEntries(formData.entries())
            await fetch('/api', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'createAlbum', ...formDataObj })
            })
              .then(res => res.json())
              .then(data => window.location.reload())
              .catch(console.log)
          }} >

            <Form.Group controlId="name" >
              <Form.Label>Album name</Form.Label>
              <Form.Control as="textarea" rows="1" placeholder="Enter album name" name='name' />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows="3" placeholder="Enter album description" name='caption' />
            </Form.Group>
            <Button type='submit'>Submit</Button>
            <Button onClick={props.onHide}>Cancel</Button>
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
  
/** Displays images of an album when album is clicked */
function OpenedAlbum(props) {
  const { id } = useParams();
  const [albumID, setAlbumID] = useState(id);
  let album = props.albums.find(elem => elem._id === id);
  // Controls whether the AlbumSettings Modal is Open

  function handleDeleteAlbum(){
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'deleteAlbum', albumID: albumID })
    }).then(window.location.reload())
  }
  if (!album) return null;
  return (
    <div>
      <Col style={{ marginTop: "1em" }}>
        <Row style={{ justifyContent: "space-between" }}>
        <Button variant="outline-secondary" style={{marginLeft: "2em"}}>
          <Link to={'/profile/albums'} className="link"><IoIosArrowBack /> Back</Link>
        </Button>
        <Button variant="outline-secondary" style={{marginLeft: "2em"}} onClick={handleDeleteAlbum}>
        <Link to = {'/profile/albums'} className="link"> <IoIosClose />Delete Album</Link>
        </Button>
          {/*
          <Button variant="outline-secondary" >
            <IoMdAdd /> Add Image
          </Button>
          */}
          <h3> {album.name}</h3>
      <AlbumSettings
        album={album}
      />
        </Row>
        <DisplayImages cards={album.images} cardsLoaded={true} albums={props.albums} />

      </Col>
    </div>
  )
}

function AlbumSettings(props) {
  const [albumSettingsIsOpen, setAlbumSettingsIsOpen] = useState(false);
  const album = props.album;
  // This is a fetch request that renames the album
  const renameAlbum = async (newName) => (
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({ action: 'renameAlbum', albumId: album._id, newName: newName })
    })
  );
  return (
    <>
      <Modal
        onHide={() => { setAlbumSettingsIsOpen(false) }}
        show={albumSettingsIsOpen}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Album Settings
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <p>You might have to refresh the album page to the changes take effect.</p>
            <div>Album Name:</div>
            <EdiText
              type='text'
              value={album.name}
              onSave={async (val) => {
                const res = await renameAlbum(val);
                const data = await res.json();
                if (data.success) {
                  alert('success');
                } else { alert('fail') }
              }}
            />
          </Container>
        </Modal.Body>
      </Modal>
      <Button variant="outline-secondary" onClick={() => setAlbumSettingsIsOpen(true)}>
        <AiOutlineSetting /> Settings
          </Button>
    </>
  )
}