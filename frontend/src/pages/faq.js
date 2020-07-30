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

// +-------------------+----------------------------------------------------------------------
// | faq.js    |
// +-------------------+
/**
 * This is the faq.js
 * This file is  displays Frequently Asked Question and their answers.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+

import React from 'react';
import "./../design/styleSheets/styles.css";
import "./../design/styleSheets/about.css";
import { Container } from 'react-bootstrap';

//FAQ about MIST; with links to forms to report bugs, 
//request features, and how to reach MIST admin
const Faq = () => {
    return (
        <Container fluid className="clear:left;">
        <h2>FAQ</h2>
        <dl>
          <dt>
            What can I do on this site?
          </dt>
          <dd>
            <ul>
              <li>Browse interesting images in the galleries.</li>
              <li>Create interesting images yourself using the gui. </li>
              <li>Challenge yourself to figure out how to make the images that appear in the challenges section.</li>
            </ul>
          </dd>
          <dt>
            Where can I find the bug report form?
          </dt>
          <dd>
            Here's <a href="https://docs.google.com/forms/d/1TrMg8uoYFa1JJYR4qRAxX396gGW46UazTnU_Z23eQm8/viewform">the bug report form</a>.
          </dd>
          <dt>
            Where can I find the feature request form?
          </dt>
          <dd>
            Here's <a href="https://docs.google.com/forms/d/1vWQcSE6oU-yiM0CWk-q55aBj6Ec8zTRTepUlKdbPdog/viewform">the feature request form</a> .
          </dd>
          <dt>
            What should I do if I have other questions?
          </dt>
          <dd>
            Send us mail at <a href='mailto:MIST@grinnell.edu'>MIST@grinnell.edu</a>!
          </dd>
          <dt>
            Why are you using a self-signed certificate for https?
          </dt>
          <dd>
            We haven't had time to get a reasonable certificate.
          </dd>
        </dl>
      </Container>
    );
}
 
export default Faq;
