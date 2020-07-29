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
    Modal,
    Navbar,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { BsCloud, BsFullscreen, BsFullscreenExit } from 'react-icons/bs';
import { FaRegShareSquare } from 'react-icons/fa';

function Menu(props) {
    // A reference to keep track of the name that the user picks for their workspace
    const workspaceNameRef = createRef('workspaceName');

    return (
        <Navbar id='menu' bg="dark" variant="dark" style={{ justifyContent: 'space-between', }}>
            <ButtonGroup>
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
            </ButtonGroup>
            <ButtonGroup>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Save your workspace</Tooltip>}
                >
                    <Button onClick={() => props.saveWorkspace(workspaceNameRef.current.value)}> <BsCloud /> Save</Button>
                </OverlayTrigger>
                <OverlayTrigger
                    placement='top'
                    overlay={<Tooltip>Publish your final image</Tooltip>}
                >
                    <Button><FaRegShareSquare /> Publish</Button>
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
            <Button onClick={props.exitFullscreen}><BsFullscreenExit /></Button>
        );
    } else {
        return (
            <Button onClick={props.requestFullscreen}><BsFullscreen /></Button>
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
                variant="primary"
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
                <Dropdown.Item onClick={()=>alert('Not yet implemented')}>Delete Workspace</Dropdown.Item>
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