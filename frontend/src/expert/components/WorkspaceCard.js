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
    OverlayTrigger,
    Row,
    Tab,
    Tabs,
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
    const [key, setKey] = useState('createFunction');
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
            <Tabs
                id="controlled-center-body"
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >
                <Tab eventKey="createFunction" title="Create Function">
                    <Card.Body>
                        <FunctionHeader
                            addUserDefinedFunction={props.addUserDefinedFunction}
                            clearFunction={props.clearFunction}
                            currentForm={props.getCurrentWorkspace().form}
                            doesFunctionExist={props.doesFunctionExist}
                            expertRef={props.expertRef}
                            loadFunction={props.loadFunction}

                            triggerPopup={props.triggerPopup}
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
                </Tab>

                <Tab eventKey="createImage" title="Create Image">
                    <Form>
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
                    </Form>
                </Tab>

            </Tabs>

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
                        const warning_message = 'You are about to overwrite a previous custom function. Are you sure that you want to continue?'
                        if (props.doesFunctionExist(fun_name)) {
                            props.triggerPopup({
                                message: warning_message,
                                onConfirm: () => props.addUserDefinedFunction(),
                            });
                        } else {
                            props.addUserDefinedFunction();
                        }
                    }}><FiSave /></Button>
                </OverlayTrigger>

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
                            const warning_message = ' Your function form is currently in use. Are you sure that you want to clear it?'
                            if (checkIfFormInUse())
                                props.triggerPopup({
                                    message: warning_message,
                                    onConfirm: () => props.clearFunction(),
                                });
                        }}
                    >
                        <GrPowerReset />
                    </Button>
                </OverlayTrigger>
            </ButtonGroup>
        </Row >
    )
}

export default WorkspaceCard;
