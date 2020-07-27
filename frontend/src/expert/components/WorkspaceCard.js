// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * Workspace.js
 * The only export here is the WorkspaceCard React Component.
 * 
 * Here we build the WorkspaceCard component which mainly consists of the Form a user
 * fills out on the expert page.
 * 
 * We might rename the WorkspaceCard to FunctionCard.
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
    Card,
    Form,
} from 'react-bootstrap';
import Editor from 'react-simple-code-editor';
import { highlight } from 'prismjs/components/prism-core';
import prism_mist from './prism-mist.js';

function WorkspaceCard(props) {
    return (
        <Card className='scroll panel' id='expert-workspace'>
            <Card.Body>
                <Card.Title>Function</Card.Title>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="formTextbox"
                            onChange={(e) => props.setName(e.target.value)}
                            placeholder="Please name your MIST image"
                            rows="1"
                            value={props.name}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Params</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="formTextbox"
                            onChange={(e) => props.setParams(e.target.value)}
                            placeholder="Please list your params, separated by commas and no spaces"
                            rows="1"
                            value={props.params}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Desription</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="formTextbox"
                            onChange={(e) => props.setDescription(e.target.value)}
                            placeholder="Please describe your MIST image"
                            rows="2"
                            value={props.description}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Code</Form.Label>

                        <Editor
                            className='formTextbox'
                            id='expert-code'
                            value={props.code}
                            ref={props.codeRef}
                            onValueChange={code => props.setCode(code)}
                            highlight={code => highlight(code, prism_mist, 'mist')}
                            padding={10}
                            tabSize={4}
                            textareaId='code-editor'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            id="message"
                            className="formTextbox"
                            value={props.message}
                            readOnly
                            rows="3" />
                    </Form.Group>

                </Form>
            </Card.Body>
        </Card>
    )
}

WorkspaceCard.propTypes = {
    name: PropTypes.string,
    params: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
}

export default WorkspaceCard;
