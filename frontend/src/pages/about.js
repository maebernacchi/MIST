/**
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


// +-------------+----------------------------------------------------------------------
// | About.js    |
// +-------------+

/**
 * This is the About.js
 * This file is that displays the About page
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 *
 */

// +-------------+----------------------------------------------------------------------
// | Imports     |
// +-------------+
import React from "react";
import { Container } from "react-bootstrap";
import "./../design/styleSheets/styles.css";
import "./../design/styleSheets/about.css";


//page contents
const About = () => {
  return (
    <Container fluid style={{marginTop: "2vh", marginBottom: "0", paddingBottom: "7.5rem"}}>
      <AboutHeader />
      <AboutContent />
    </Container>
  );
};

//page title
const AboutHeader = () => {
  return (
    <div>
      <h1>About MIST</h1>
    </div>
  );
};

//page contents (Q&A)
const AboutContent = () => {
  return (
    <div>
      <dl id="aboutQA">
        <Container>
          <dt>What is MIST?</dt>
          <dd>
            MIST (or the Mathematical Image Synthesis Toolkit) is a tool for
            creating images and animations using simple math functions. You can
            make your own art from scratch, complete challenges, and share your
            creations with the MIST community.
          </dd>
        </Container>
        <Container>
          <dt>Who can use MIST?</dt>
          <dd>
            Anyone! MIST does not require any prior experience in art, math, or
            computer science.
          </dd>
        </Container>
        <Container>
          <dt>What can I learn with MIST?</dt>
          <dd>
            You will learn artistic creativity, functional problem solving, and
            computational thinking.
          </dd>
        </Container>
        <Container>
          <dt>How can I share my art?</dt>
          <dd>
            Create an account to see, share, and modify the work of other users.
            You will join a community of people who love to create art and learn
            computing.
          </dd>
        </Container>
        <Container>
          <dt>Community Guidelines</dt>
          <dd>
            You can find our community guidelines <a href="/community">here</a>
          </dd>
        </Container>
      </dl>
    </div>
  );
};

export default About;