// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * report.js
 * 
 * This exports the report form page.
 * To be developed:
    * submit button submits form into database 
    * could use some styling
    
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