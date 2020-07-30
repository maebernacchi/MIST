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
// | report.js        |
// +-------------------+
/**
 * This is the report.js
 * This file displays the rerport page that allows users to submit a report.
 *
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 */
// +-------------------+----------------------------------------------------------------------
// | IMPORTS           |
// +-------------------+
import React from 'react';
import { Button, Container, Form } from 'react-bootstrap';

// +-------------------+----------------------------------------------------------------------
// | report.js        |
// +-------------------+
// will need to be styled
function ReportForm() {
    return (
        <Container className="reportForm">
            <h1>Report Form </h1>
            <p style={{ textAlign: "left" }}> To see the community guidelines click <a href="/community">here</a> </p>
            <Form className="form">
                {/* Radio buttons + text box */}
                <Form.Group required="required" controlId="formBasicCheckbox">
                    <Form.Label>Please select the reason for reporting: </Form.Label>
                    <Form.Check name="reason" type="radio" label="Spam" />
                    <Form.Check name="reason" type="radio" label="Personal Attack/Harassment" />
                    <Form.Check name="reason" type="radio" label="Illegal Activites" />
                    <Form.Check name="reason" type="radio" label="Explicit Material" />
                    <Form.Check name="reason" type="radio" label="Offensive Content" />
                    <Form.Check name="reason" type="radio" label="Discrimination" />
                    <Form.Check name="reason" type="radio" label="Trolling" />
                    <Form.Group>
                        <Form.Check name="reason" type="radio" label="Other" />
                        <Form.Control as="textarea" rows="3" type="other" placeholder="If none of the above, please explain here" />
                    </Form.Group>
                </Form.Group>

                {/* Additional Comments */}
                <Form.Group>
                    <Form.Label>Additonal Comment (Optional) </Form.Label>
                    <Form.Control as="textarea" rows="3" type="comment" placeholder="" />
                </Form.Group>

                {/* Submit Button */}
                <Form.Group>
                    <Button variant="outline-dark" type="submit" id="submitButton">
                        Submit </Button>
                </Form.Group>

            </Form>
        </Container>
    );
}

export default ReportForm;