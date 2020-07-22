import React from "react";
import "./styleSheets/generalStyles.css";
import { Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

/**
 * Creates the footer
 */

function Footer() {
  return (
    <Container fluid id="footer">
      <p className="justify-content-center">&copy;2020 Glimmer Labs </p>
      <Nav className="justify-content-center" activeKey="/home">
        <Nav.Item>
          <Nav.Link href="/about" id="footer-button">
            About
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/contact" id="footer-button">
            Contact
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/license" id="footer-button">
            License
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/privacy" id="footer-button">
            Privacy Policy
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
}

export default Footer;
