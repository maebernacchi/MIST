import Cards from "./data";
import React from "react";

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
 * Imports ICONS from react-icons
 **************************************************/

/* BsViewStacked and BsLayoutSplit is not used as of now
      would be used on the overlay modal, to let users change views*/
import { BsClock, BsViewStacked, BsLayoutSplit } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { FiSave, FiCode, FiSend } from "react-icons/fi";
import {
  FaRegShareSquare,
  FaRegComments,
  FaFacebook,
  FaSnapchat,
} from "react-icons/fa";
import { TiSocialInstagram } from "react-icons/ti";

const CardChild = React.createClass({
  render: function () {
    return (
      <div>
        <Card>
          {/* TITLE + IsANIMATED? */}
          <Card.Header>
            <Card.Title style={{ margin: "auto" }}>
              {this.props.title}
              {this.props.isAnimated ? (
                <BsClock size={15} style={{ margin: "1vh" }} />
              ) : (
                ""
              )}
            </Card.Title>

            {/* IMAGE */}
            <Link
              to={{
                pathname: `/img/${this.props.id}`,
                state: { background: location },
              }}
            >
              <Card.Img
                variant="top"
                src={this.props.image}
                style={{ marginTop: "1em", marginBottom: "1em" }}
              />
            </Link>

            {/* ICONS */}
            <Card.Body style={{ justifyContent: "space-between" }}>
              <Col>
                {/************************
                 * username ROW + description ROW
                 *************************/}
                <Row style={{ justifyContent: "space-between" }}>
                  {/* USERNAME + description*/}

                  <div>
                    {" "}
                    <b>{this.props.username} </b> {this.props.description}
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

                  <Nav.Link style={{ color: "black", display: "inline-block" }}>
                    <AiOutlineStar />
                    {this.props.rating}
                  </Nav.Link>

                  {/* Code Icon */}
                  <CodeIcon code={this.props.code} />

                  {/* Save Icon */}
                  <SaveIcon />

                  {/* Comment Icon */}
                  <Link
                    to={{
                      pathname: `/img/${this.props.id}`,
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
      </div>
    );
  },
});

export default CardParent = React.createClass({
  getInitialState: function () {
    return { cards: Cards };
  },
  render: function () {
    const names = this.state.cards.map((card) => {
      return (
        <CardChild
          key={i}
          id={card.id}
          title={card.title}
          url={card.url}
          image={card.image}
          description={card.description}
          rating={card.rating}
          username={card.username}
          isAnimated={card.isAnimated}
          code={card.code}
        />
      );
    });
    return <div>{card}</div>;
  },
});
