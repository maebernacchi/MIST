import React from "react";
import "./styleSheets/styles.css";
import "./styleSheets/about.css";
import { Container } from "react-bootstrap";

//Disclaimer about how MIST is still in developmental phases
const Development = () => {
  return (
    <Container fluid>
      <h1>Development</h1>
      <Container className="clear:left;">
        <p>
          Welcome to the MIST public beta release. We hope that you have fun
          experimenting with MIST. In case you haven't figured it out, MIST
          provides a new approach to making interesting abstract images. We hope
          that you will be inspired by the sample images already on the site and
          that you will be inspired to create your own.
        </p>
        <p>
          Because MIST is in its early stages of development, you are likely to
          find some things missing on this Web site, and you'll ocassionally
          find that things don't work as they should. We'd appreciate it if
          you'd take the time to let us know about
          <a href="https://docs.google.com/forms/d/1vWQcSE6oU-yiM0CWk-q55aBj6Ec8zTRTepUlKdbPdog/viewform">
            features
          </a>
          that you would like to see and any
          <a href="https://docs.google.com/forms/d/1TrMg8uoYFa1JJYR4qRAxX396gGW46UazTnU_Z23eQm8/viewform">
            bugs
          </a>
          that you have encountered. If you spend more than a few minutes on the
          site, we'd also appreciate it if you'd fill out the
          <a href="https://docs.google.com/forms/d/1DUo5eEY-5w8amayx9DJMifr7BvgzRUp1yy4a9-r09-g/viewform">
            user feedback form
          </a>
          .
        </p>
        <p className="text-align: right;">-- The MIST Team</p>
      </Container>
    </Container>
  );
};

export default Development;
