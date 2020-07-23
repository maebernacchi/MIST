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
import React, { useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    Form,
    Modal,
    OverlayTrigger,
    Row,
    Tooltip,
} from 'react-bootstrap';
import { FiSave } from 'react-icons/fi';
import { GrPowerReset } from 'react-icons/gr'
import Editor from 'react-simple-code-editor';
import { highlight, match_macros, match_params } from './prism-mist.js';

function WorkspaceCard(props) {
    // Class toggles are used to force a highlight update when moving through the code
    // TODO: see if there's a better way to do this
    const [, setHighlightSwitch] = useState(true);
    const updateHighlight = () => setHighlightSwitch(hs => !hs);

    useEffect(() => {
        match_macros(props.functions);
    }, [props.functions])

    useEffect(() => {
        match_params(props.params.replace(/\s/g, "").split(","));
    }, [props.params])

    return (
        <Card className='scroll panel' id='expert-workspace'>
            <Card.Title >Create Your Custom Function</Card.Title>
            <Card.Body>
                <FunctionHeader
                    addUserDefinedFunction={props.addUserDefinedFunction}
                    clearFunction={props.clearFunction}
                    currentForm={props.getCurrentWorkspace().form}
                    doesFunctionExist={props.doesFunctionExist}
                    expertRef={props.expertRef}
                    loadFunction={props.loadFunction}
                />

                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="formTextbox"
                            onChange={(e) => props.setName(e.target.value)}
                            placeholder="Please name your MIST Function"
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
                        <Form.Label>Default Params</Form.Label>
                        <Form.Control
                            as="textarea"
                            className="formTextbox"
                            onChange={(e) => props.setDefaultParams(e.target.value)}
                            placeholder="Please pick your default params, separated by commas and no spaces"
                            rows="1"
                            value={props.default_params}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
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
                            highlight={code => (
                              highlight(code, "code-editor")
                            )}
                            id='expert-code'
                            onKeyUp={updateHighlight}
                            onValueChange={code => props.setCode(code)}
                            padding={10}
                            ref={props.codeRef}
                            tabSize={4}
                            textareaId='code-editor'
                            value={props.code}
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

// FunctionDropdown
// Contains all actions related directly to the function form
function FunctionHeader(props) {

    const [clearFunctionModalShow, setClearFunctionModalShow] = useState(false);
    const [addUserDefinedFunctionShow, setAddUserDefinedFunctionShow] = useState(false);

    // check if form is in use

    const checkIfFormInUse = () => {
        const currentForm = props.currentForm;
        return (currentForm.name || currentForm.params || currentForm.description || currentForm.code);
    }

    // check if workspace is in use

    return (

        <Row style={{ justifyContent: 'space-between' }}>

            <ButtonGroup>
                <OverlayTrigger
                    container={props.expertRef}
                    key={'addToWorkspace'}
                    placement="right"
                    overlay={
                        <Tooltip>
                            Save your function to your workspace
                        </Tooltip>
                    }>
                    <Button onClick={() => {
                        const fun_name = props.currentForm.name;
                        if (props.doesFunctionExist(fun_name)) {
                            setAddUserDefinedFunctionShow(true);
                        } else {
                            props.addUserDefinedFunction();
                        }
                    }}><FiSave /></Button>
                </OverlayTrigger>

                <Modal
                    container={props.expertRef}
                    show={addUserDefinedFunctionShow}
                    onHide={() => setAddUserDefinedFunctionShow(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add Custom Function</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> You are about to overwrite a previous custom function. Are you sure that you want
                    to continue?
                </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => setAddUserDefinedFunctionShow(false)}
                            variant="secondary">Close</Button>
                        <Button
                            onClick={() => { props.addUserDefinedFunction(); setAddUserDefinedFunctionShow(false); }}
                            variant="primary">
                            Continue</Button>
                    </Modal.Footer>
                </Modal>

            </ButtonGroup>

            <ButtonGroup>

                <OverlayTrigger
                    container={props.expertRef}
                    key={'clearFunction'}
                    placement="right"
                    overlay={
                        <Tooltip>
                            Reset the function form to the default state
                        </Tooltip>
                    }>
                    <Button
                        onClick={() => {
                            if (checkIfFormInUse())
                                setClearFunctionModalShow(true);
                        }}
                    >
                        <GrPowerReset />
                    </Button>
                </OverlayTrigger>

                <Modal
                    container={props.expertRef}
                    show={clearFunctionModalShow}
                    onHide={() => setClearFunctionModalShow(false)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Clear your function</Modal.Title>
                    </Modal.Header>
                    <Modal.Body> Your function form is currently in use. Are you sure that you want
                    to clear it?
                </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => setClearFunctionModalShow(false)}
                            variant="secondary">Close</Button>
                        <Button
                            onClick={() => { props.clearFunction(); setClearFunctionModalShow(false); }}
                            variant="primary">
                            Clear</Button>
                    </Modal.Footer>
                </Modal>

            </ButtonGroup>
        </Row>
    )
}

export default WorkspaceCard;
