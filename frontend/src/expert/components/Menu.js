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

// +-------+------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * Menu.js
 * 
 * This exports the Menu component of the MIST Expert GUI.
 * 
 */

import PropTypes from 'prop-types';
import React, { createRef, useEffect, useState } from 'react';
import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownButton,
    Form,
    FormControl,
    ListGroup,
    Modal,
    Nav,
    Navbar,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { BsCloud, BsFullscreen, BsFullscreenExit, BsQuestionCircle } from 'react-icons/bs';
import { FaRegShareSquare } from 'react-icons/fa';
import { Link } from "react-router-dom";

function Menu(props) {
    // A reference to keep track of the name that the user picks for their workspace
    const workspaceNameRef = createRef('workspaceName');

    return (
        <Navbar id='menu' bg="dark" variant="dark" style={{ justifyContent: 'space-between', }}>
            <Nav>

                <Button
                    className='menu-btn'
                    onClick={() => {
                        props.triggerPopup({
                            footer: false,
                            message: (
                                <div>
                                    <ListGroup>
                                        <ListGroup.Item>
                                            The <b>Side Panel</b> is the left-most panel is where you
                                        access builtin MIST functions and values as well as your saved functions.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Central Panel</b> is where you can write and save your own MIST function with however many
                                        parameters as well as write your MIST Image.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Final Image Panel</b> is where you can render and see the MIST image that you wrote out
                                        in the Central Panel.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            The <b>Workspace</b> you save is both the functions that you have saved as well as the contents
                                        of the function that you are currently writing.
                                        </ListGroup.Item>

                                        <ListGroup.Item>
                                            If you need additional help to start using the Expert UI, click the following button to
                                            checkout our tutorial!
                                            <a href='/tutorial/#expert-ui'>
                                                <Button>To Tutorials</Button>
                                            </a>
                                        </ListGroup.Item>

                                    </ListGroup>
                                </div>
                            ),
                            title: 'MIST Expert UI Terminology',
                        })
                    }}
                    variant="outline-light">
                    <BsQuestionCircle

                    />
                </Button>
                <FileDropdown
                    getCurrentWorkspace={props.getCurrentWorkspace}
                    isWorkspaceInUse={props.isWorkspaceInUse}
                    loadWorkspace={props.loadWorkspace}
                    resetWorkspace={props.resetWorkspace}
                    triggerPopup={props.triggerPopup}
                    workspaceNameRef={workspaceNameRef}
                />
                <Form inline>
                    <FormControl
                        className="mr-sm-2"
                        placeholder="Name your Workspace"
                        ref={workspaceNameRef}
                        type="text"
                    />
                </Form>
                <FullscreenButton
                    requestFullscreen={props.requestFullscreen}
                    exitFullscreen={props.exitFullscreen}
                />
            </Nav>

            <ButtonGroup>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Save your workspace</Tooltip>}
                >
                    <Button className='menu-btn'
                        onClick={() => props.saveWorkspace(workspaceNameRef.current.value)}
                        variant='outline-light'> <BsCloud /> Save</Button>
                </OverlayTrigger>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Publish your final image</Tooltip>}
                >
                    <Button className='menu-btn'
                        variant='outline-light'
                    ><FaRegShareSquare /> Publish</Button>
                </OverlayTrigger>
            </ButtonGroup>
        </Navbar>
    )
}

Menu.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    requestFullscreen: PropTypes.func.isRequired,
    exitFullscreen: PropTypes.func.isRequired,
}

/**
 * Button for the user to toggle fullscreen
 */
function FullscreenButton(props) {
    const [fullscreen, setFullscreen] = useState(document.fullscreen);
    useEffect(() => {
        const listener = () => setFullscreen(document.fullscreen);
        document.addEventListener('fullscreenchange', listener);
        return () => {
            document.removeEventListener('fullscreenchange', listener);
        }
    }, []);

    if (fullscreen) {
        return (
            <Button
                className='menu-btn'
                onClick={props.exitFullscreen}
                variant='outline'><BsFullscreenExit /></Button>
        );
    } else {
        return (
            <Button
                className='menu-btn'
                onClick={props.requestFullscreen}
                variant='outline-light'><BsFullscreen /></Button>
        );
    }
}

/**
 * Dropdown for where the user can perform actions related to workspaces other than saving
 */
function FileDropdown(props) {
    return (
        <>
            <DropdownButton
                as={ButtonGroup}
                className='menu-btn'
                id="file"
                title="File"
                variant="outline-light"
            >
                <Dropdown.Item
                    onClick={() => {
                        if (props.isWorkspaceInUse()) {
                            props.triggerPopup({
                                message: 'Your workspace is currently in use. Are you sure that you want to reset it?',
                                onConfirm: props.resetWorkspace,
                            })
                        }
                    }}
                >Reset Workspace</Dropdown.Item>

                <ImportWorkspace
                    loadWorkspace={props.loadWorkspace}
                    workspaceNameRef={props.workspaceNameRef} />
                <Dropdown.Item onClick={() => alert('Not yet implemented')}>Delete Workspace</Dropdown.Item>
                <Dropdown.Divider />

            </DropdownButton>{' '}
        </>
    )
}

FileDropdown.propTypes = {
    getCurrentWorkspace: PropTypes.func.isRequired,
    loadWorkspace: PropTypes.func.isRequired,
    resetWorkspace: PropTypes.func.isRequired,
    workspaceNameRef: PropTypes.object.isRequired,
}

/**
 * Button for the user to load a saved workspace from the server 
 */
function ImportWorkspace(props) {

    // Done in part by following
    // https://stackoverflow.com/questions/46712554/upload-files-using-react-bootstrap-formcontrol

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const loadFile = (selectedFiles) => {
        if (selectedFiles) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const json = event.target.result;
                let workspaceToLoad;
                try {
                    workspaceToLoad = JSON.parse(json);
                }
                catch (err) {
                    alert("File does not contain a MIST Workspace");
                    return;
                }
                if (workspaceToLoad.fun.class !== "MIST.FunInfo") {
                    alert("File does not contain a MIST Workspace");
                    return;
                }

                props.loadWorkspace(workspaceToLoad);
                props.workspaceNameRef.current.value = workspaceToLoad.name;
            }; // reader.onload
            reader.readAsText(selectedFiles[0]);
        } // if (selectedFiles)
    }

    return (
        <>
            <Dropdown.Item onClick={handleShow}>Load a Workspace</Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a function to load</Modal.Title>
                </Modal.Header>
                <Modal.Body> Select the file to load. Note that MIST Workspace
                     are typically stored in files with a suffix of .ws. </Modal.Body>
                <Form.File id="formcheck-api-regular">
                    <Form.File.Label>Regular file input</Form.File.Label>
                    <Form.File.Input onChange={(event) => { loadFile(event.target.files); handleClose() }} />
                </Form.File>
            </Modal>
        </>
    );
}

export default React.memo(Menu);