import PropTypes from 'prop-types';
import React from 'react';
import {
    Button,
    Modal,
} from 'react-bootstrap';

function Popup(props) {
    return (
        <Modal show={props.isOpen} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body> {props.message}
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={props.onClose}
                    variant="secondary">Close</Button>
                <Button
                    onClick={() => { props.onConfirm(); props.onClose() }}
                    variant="primary">
                    Confirm</Button>
            </Modal.Footer>
        </Modal>)
}

Popup.propTypes = {
    isOpen: PropTypes.bool,
    message: PropTypes.string,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default Popup;