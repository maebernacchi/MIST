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
 * Popup.js
 * This is our Popup Component that is used by the Expert component to create
 * popups. Or rather, we do not create popups, but rerender this component whenever
 * we need one in a situation where we need to confirmation for an action.
 * 
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
    Button,
    Modal,
} from 'react-bootstrap';

/*
 * Our Popup React component. For props we expect to receive:
 * isOpen, 
 * onClose,
 * message,
 * onConfirm.
 * which we elaborate in the propTypes immediately after. 
 */
function Popup(props) {
    return (
        <Modal show={props.isOpen} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body> {props.message}
            </Modal.Body>
            {(props.footer) ? <Modal.Footer>
                <Button
                    onClick={props.onClose}
                    variant="secondary">Close</Button>
                <Button
                    onClick={() => { props.onConfirm(); props.onClose() }}
                    variant="primary">
                    Confirm</Button>
            </Modal.Footer> : <></>}
        </Modal>)
}

/*
 * isOpen: a boolean that represents whether or not Popup is shown
 * message: a string that represents the contents of the popup
 * onConfirm: a function that is the action we need a confirmation for
 * onClose: a function that is what needs to happen when we close our modal, additionally
 *  we need to set isOpen to false within this function
 */
Popup.propTypes = {
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default Popup;