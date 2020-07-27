// +--------------------------------------------------------------------------------
// | Notes |
// +-------+
/*
 * SidePanelCard.js
 * SidePanelCard is a React functional component. It builds the Side Panel of the 
 * MIST Expert GUI. It contains the user-defined functions as well as the MIST
 * built-in functions. We rely on a parent component to manage the user-defined 
 * functions.
 */

import PropTypes from 'prop-types';
import React from 'react';
import {
    Draggable,
    DragDropContext,
    Droppable
} from 'react-beautiful-dnd';
import {
    Button,
    Card,
    Col,
    Container,
    OverlayTrigger,
    Row,
    Tooltip,
} from 'react-bootstrap';
import { IconContext } from "react-icons";
import {
    FaPen,
    FaRegTrashAlt,
} from 'react-icons/fa';
import { MIST_builtin_functions } from '../Utilities';

function SidePanelCard(props) {

    // add functions
    const insertFunctions = (functions, specifiedKeys = null, userDefined = false) => {
        let keys = specifiedKeys || Object.keys(functions).sort();

        const wrap_user_defined_button = (button, fun_name, userDefined) => {
            if (userDefined) {
                return (
                    <>
                        <Col>
                            <IconContext.Provider
                                value={{ style: { color: 'white', cursor: 'pointer' } }}
                            >
                                <div>
                                    <FaRegTrashAlt onClick={() => props.deleteFunction(fun_name)} />
                                </div>
                            </IconContext.Provider>
                        </Col>
                        <Col xs={6} padding={0}>
                            {button}
                        </Col>
                        <Col>
                            <IconContext.Provider
                                value={{ color: 'white', style: { cursor: 'pointer' } }}
                            >
                                <div>
                                    <FaPen onClick={() => props.loadFunction(functions[fun_name])} />
                                </div>
                            </IconContext.Provider>
                        </Col>



                    </>
                )
            } else {
                return button;
            }
        }

        return (keys.map((fun_name, idx) => {
            let fun = functions[fun_name];
            let fun_signature = fun_name + "(" + fun.params + ")";

            return (
                <Draggable
                    draggableId={fun_name}
                    index={idx}
                    key={fun_name}
                >
                    {(provided) =>
                        (<div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <Row style={{ justifyContent: "space-between", marginBottom: '6px'}}>
                                {wrap_user_defined_button(<OverlayTrigger
                                    container={props.expertRef}
                                    key={idx}
                                    placement="right"
                                    overlay={
                                        <Tooltip>
                                            {fun.about + '\n'}
                                            <hr />
                                            {fun_signature}
                                        </Tooltip>
                                    }>

                                    <Button
                                        block
                                        className='insertButton'
                                        variant='dark'
                                        key={idx}
                                        onClick={() => { insertText(fun_signature) }}>
                                        {fun_name}
                                    </Button>

                                </OverlayTrigger>, fun_name, userDefined)}
                            </Row>
                        </div>)
                    }

                </Draggable>
            )
        }))
    }; // insertFunctions

    /**
    * Insert text into the code field.
    */
    function insertText(text) {
        // Code based on
        //   http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
        const code = document.getElementById('code-editor');
        if (document.selection) {
            code.focus();
            var sel = document.selection.createRange();
            sel.text = text;
            code.focus();
        }
        else if (code.selectionStart || code.selectionStart === 0) {
            var startPos = code.selectionStart;
            var endPos = code.selectionEnd;
            var scrollTop = code.scrollTop;
            code.value = code.value.substring(0, startPos) + text + code.value.substring(endPos, code.value.length);
            code.focus();
            code.selectionStart = startPos + text.length;
            code.selectionEnd = startPos + text.length;
            code.scrollTop = scrollTop;
            // update state
            props.setCode(code.value);
        }
        else {
            code.value += text;
            code.focus();
            // update state
            props.setCode(code.value);
        }
    } // insertText(txt)

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (destination && source.droppableId === 'user_defined_functions') {
            const new_index = result.destination.index;
            const old_index = result.source.index;
            const old_order = props.getFunctions();
            const new_order = Array.from(old_order);
            new_order.splice(old_index, 1);
            new_order.splice(new_index, 0, draggableId);
            props.setFunctionsOrder(new_order);
        }
    }
    return (
        <Card className='scroll panel'>
            {console.log('rendering sidepanelcard')}

            <Card.Body>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId='user_defined_functions'
                    >
                        {(provided) => (
                            <Container
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {
                                    insertFunctions(
                                        props.getStateFunctions(),
                                        props.getFunctions(),
                                        true)
                                }
                                {provided.placeholder}
                            </Container>)}
                    </Droppable>
                    <hr style={{ backgroundColor: 'white' }} />
                    <Droppable
                        droppableId='built_in_functions'
                    >
                        {(provided) => (
                            <Container
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {
                                    insertFunctions(MIST_builtin_functions)
                                }

                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            </Card.Body>
        </Card>
    )
}

SidePanelCard.propTypes = {
    codeRef: PropTypes.object.isRequired,
    getFormState: PropTypes.func.isRequired,
    getStateFunctions: PropTypes.func.isRequired,
    getFunctions: PropTypes.func.isRequired,
}

export default SidePanelCard;