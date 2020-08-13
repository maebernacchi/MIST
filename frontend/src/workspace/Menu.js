/**
 * This file creates the Menu Bar and calls subsequent create nodes files.
 *
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

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useState, useRef } from "react";
import { Rect, Group, Text, Shape } from "react-konva";
import gui from "./mistgui-globals";
import { MIST } from "./mist.js";
import Portal from "./Portal";
import MakeMenuButton from "./MakeMenuButton";
import { funcGroup } from "./MakeFunction";
import { valGroup } from "./MakeValue";
import global, { width, valueWidth, functionWidth } from "./globals.js";
import menuDimensions from "./globals-menu-dimensions";
import { Button, Form, Modal } from 'react-bootstrap';

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function Menu(props) {
  //keeps track if the menus are open

  // +--------+--------------------------------------------------------
  // | States |
  // +--------+

  const [isValueMenuOpen, setIsValueMenuOpen] = useState(true);
  const [isFunctionMenuOpen, setIsFunctionMenuOpen] = useState(false);
  const [isCustomMenuOpen, setIsCustomMenuOpen] = useState(false);
  const [isSavedMenuOpen, setIsSavedMenuOpen] = useState(false);
  const [key, setKey] = useState(Math.random());
  const ref = useRef(null);
  const [formValue, setFormValue] = useState("Enter a MIST expression");

  // Ref for saving the workspace name
  const wsNameRef = useRef('wsName');

  // Ref for select form value
  const wsFormRef = useRef('wsForm');

  // create one modal that is for displaying content
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentModalInfo, setContentModalInfo] = useState({ title: 'STUB', body: 'STUB' });
  const [contentModalCallback, setContentModalCallack] = useState(() => () => console.log('STUB'))

  // create another modal that is for double confirmation
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationModalInfo, setConfirmationModalInfo] = useState({ title: 'STUB', body: 'STUB' });
  // check that this state callback is actually a function
  const [confirmationCallback, setConfirmationCallback] = useState(() => () => console.log('STUB'));

  // +--------+
  // | States |
  // +--------+--------------------------------------------------------

  /**
   * This gets called from MakeFunctions and MakeValues to change the group's
   * key to trigger a re-render (so that the node goes back to the right place
   * if it's drag-and-dropped into the menu, not the workspace)
   */
  function changeKey() {
    setKey(Math.random());
  }

  /**
   * Toggle content modal
   */
  function toggleContentModal() {
    setIsContentModalOpen(prev => !prev);
  }

  /**
   * Toggle confirmation modal
   */
  function toggleConfirmationModal() {
    setIsConfirmationModalOpen(prev => !prev);
  }

  return (
    <>
      <Portal>
        <Modal show={isContentModalOpen} onHide={toggleContentModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{contentModalInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body> {contentModalInfo.body}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={toggleContentModal}
              variant="secondary">Close</Button>
            <Button
              onClick={contentModalCallback}
              variant="primary">
              Confirm</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={isConfirmationModalOpen} onHide={toggleConfirmationModal}>
          <Modal.Header closeButton>
            <Modal.Title>{confirmationModalInfo.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body> {confirmationModalInfo.body}
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={toggleConfirmationModal}
              variant="secondary">Close</Button>
            <Button
              onClick={confirmationCallback}
              variant="primary">
              Confirm</Button>
          </Modal.Footer>
        </Modal>

      </Portal>
      <Group width={width} height={global.menuHeight} key={key} ref={ref}>
        <Rect // Entire menu bar
          width={width}
          height={global.menuHeight}
          fill={props.bgColor}
          shadowColor={"black"}
          shadowBlur={5}
        />
        {[
          {
            name: "Saved",
            tabPoints: menuDimensions.savedTabPoints,
            tabOffsetX: menuDimensions.savedTabOffsetX,
          },
          {
            name: "Functions",
            tabPoints: menuDimensions.functionTabPoints,
            tabOffsetX: menuDimensions.functionTabOffsetX,
          },
          {
            name: "Values",
            tabPoints: menuDimensions.valueTabPoints,
            tabOffsetX: menuDimensions.valueTabOffsetX,
          },
          {
            name: "Custom",
            tabPoints: menuDimensions.customTabPoints,
            tabOffsetX: menuDimensions.customTabOffsetX,
          },
        ].map((u, i) => {
          return (
            <Group
              x={
                (isCustomMenuOpen && menuDimensions.formWidth) ||
                (isValueMenuOpen && u.name !== "Custom"
                  ? menuDimensions.valueListLength
                  : 0) ||
                (isFunctionMenuOpen && u.name !== "Custom" && u.name !== "Values"
                  ? menuDimensions.functionListLength
                  : 0) ||
                (isSavedMenuOpen && u.name === "Saved" ? (width * 8) / 15 : 0)
              }
              key={i}
              onMouseEnter={() => {
                if (u.name === "Custom") {
                  setIsCustomMenuOpen(true);
                  setIsValueMenuOpen(false);
                  setIsFunctionMenuOpen(false);
                  setIsSavedMenuOpen(false);
                } else if (u.name === "Values") {
                  setIsValueMenuOpen(true);
                  setIsFunctionMenuOpen(false);
                  setIsCustomMenuOpen(false);
                  setIsSavedMenuOpen(false);
                } else if (u.name === "Functions") {
                  setIsFunctionMenuOpen(true);
                  setIsValueMenuOpen(false);
                  setIsCustomMenuOpen(false);
                  setIsSavedMenuOpen(false);
                } else {
                  setIsSavedMenuOpen(true);
                  setIsValueMenuOpen(false);
                  setIsFunctionMenuOpen(false);
                  setIsCustomMenuOpen(false);
                }
              }}
            >
              <Shape // saved tab arrow
                sceneFunc={function (context) {
                  context.beginPath();
                  context.moveTo(u.tabPoints.topLeft.x, u.tabPoints.topLeft.y);
                  context.lineTo(u.tabPoints.topRight.x, u.tabPoints.topRight.y);
                  context.lineTo(u.tabPoints.point.x, u.tabPoints.point.y);
                  context.lineTo(
                    u.tabPoints.bottomRight.x,
                    u.tabPoints.bottomRight.y
                  );
                  context.lineTo(
                    u.tabPoints.bottomLeft.x,
                    u.tabPoints.bottomLeft.y
                  );
                  context.closePath();
                  context.fillStrokeShape(this);
                }}
                fill={
                  (u.name === "Values" && props.valTabColor) ||
                  (u.name === "Functions" && props.funTabColor) ||
                  (u.name === "Custom" && props.customTabColor) ||
                  (u.name === "Saved" && props.savedTabColor)
                }
                strokeWidth={0}
                shadowOffsetX={1}
                shadowOffsetY={-2}
                shadowBlur={5}
                shadowOpacity={0.7}
              />
              <Text
                text={u.name}
                x={u.tabOffsetX - 50}
                y={global.menuHeight * 0.9}
                width={120}
                height={20}
                fill={"black"}
                align={"left"}
                verticalAlign={"middle"}
                fontFamily={"Impact"}
                fontSize={25}
                rotation={(-Math.atan(global.menuHeight / 60) * 180) / Math.PI}
              />
              {u.name === "Custom" && (
                <Portal>
                  <form
                    id="form"
                    style={{
                      position: "absolute",
                      top: props.top + menuDimensions.formY,
                      left: isCustomMenuOpen
                        ? props.left + menuDimensions.formX
                        : -menuDimensions.formWidth + menuDimensions.formX,
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      try {
                        props.createLayout(MIST.parse(formValue, ""));
                      } catch (err) {
                        //document.getElementById("input").style.borderColor = "red";
                        console.log("invalid function");
                      }
                      return false;
                    }}
                  >
                    <label>
                      <input
                        id={"input"}
                        style={{
                          width: menuDimensions.formWidth,
                          height: menuDimensions.formHeight,
                        }}
                        type="text"
                        placeholder={formValue}
                        onChange={(e) => {
                          setFormValue(e.target.value);
                        }}
                      />
                    </label>
                  </form>
                </Portal>
              )}
              {u.name === "Values" &&
                Array.from(new Array(gui.valNames.length), (val, index) =>
                  valGroup(
                    props.addNode,
                    gui.valNames[index],
                    -menuDimensions.valueListLength +
                    menuDimensions.valueListStartX +
                    index * (menuDimensions.valueMargin + valueWidth),
                    gui.menuYspacing - 20,
                    isValueMenuOpen,
                    changeKey,
                    index
                  )
                )}
              {u.name === "Functions" &&
                Array.from(new Array(gui.funNames.length), (val, index) =>
                  funcGroup(
                    props.addNode,
                    gui.funNames[index],
                    -menuDimensions.functionListLength +
                    menuDimensions.functionListStartX +
                    index * (menuDimensions.functionMargin + functionWidth),
                    gui.menuYspacing - 20,
                    isFunctionMenuOpen,
                    changeKey,
                    index
                  )
                )}
            </Group>
          );
        })}
        <Group visible={true}>
          {[
            {
              name: "Reset Workspace", func: props.clearWorkspace,
            },
            {
              name: "Open Workspace", func: async () => {
                try {
                  const workspaces = await props.getWorkspaces();
                  const workspacesObj = {};
                  // we need a scrollable list that we can find the index of an then
                  // load from workspaces based on the index
                  setContentModalInfo({
                    title: 'Pick a workspace to load',
                    body: (<div>
                      <Form>
                        <Form.Group>
                          <Form.Label>
                            Select a workspace to load
                          </Form.Label>
                          <Form.Control as='select' ref={wsFormRef}>
                            {workspaces.map(workspace => {
                              workspacesObj[workspace.name] = workspace.data;
                              return (<option key={workspace.name}>{workspace.name}</option>);
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </div>)
                  })
                  setContentModalCallack(() => () => {
                    props.loadWorkspace(workspacesObj[wsFormRef.current.value]);
                    toggleContentModal();
                  })
                  toggleContentModal();
                } catch (error) {
                  alert(error)
                }

              }
            },
            {
              name: "Save Workspace", func: () => {
                setContentModalInfo({
                  title: 'Saving Workspace',
                  body: (<div>
                    <input placeholder='Name your workspace' ref={wsNameRef} />
                  </div>)
                })
                setContentModalCallack(() => async () => {
                  try {
                    const wsName = wsNameRef.current.value;
                    if (!wsName) {
                      const error_message = 'Please enter a valid name for your workspace';
                      throw error_message;
                    }
                    const exists = await props.checkIfWorkspaceExists(wsName);
                    if (exists) {
                      // trigger confirmation popup
                      setConfirmationModalInfo({
                        title: 'Overwriting previous workspace',
                        body: (<div>You are about to overwrite the workspace named {wsName} Click confirm to continue</div>)
                      })
                      setConfirmationCallback(() => () => {
                        props.saveWorkspace(wsName);
                      })
                      toggleConfirmationModal();
                    } else {
                      props.saveWorkspace(wsName)
                    }
                  } catch (error) {
                    alert(error)
                  }
                })
                toggleContentModal();
              },
            },
            {
              name: "Delete Workspace", func: async () => {
                try {
                  const workspaces = await props.getWorkspaces();
                  const workspacesObj = {};
                  // we need a scrollable list that we can find the index of an then
                  // load from workspaces based on the index
                  setContentModalInfo({
                    title: 'Pick a workspace to dekete',
                    body: (<div>
                      <Form>
                        <Form.Group>
                          <Form.Label>
                            Select a workspace to load
                          </Form.Label>
                          <Form.Control as='select' ref={wsFormRef}>
                            {workspaces.map(workspace => {
                              workspacesObj[workspace.name] = workspace.data;
                              return (<option key={workspace.name}>{workspace.name}</option>);
                            })}
                          </Form.Control>
                        </Form.Group>
                      </Form>
                    </div>)
                  })
                  setContentModalCallack(() => () => {
                    props.deleteWorkspace(wsFormRef.current.value)
                      .then(message => { toggleContentModal(); alert(message); })
                      .catch(alert)
                  })
                  toggleContentModal();
                } catch (error) {
                  alert(error)
                }

              },
            }
          ].map((u, i) => (
            <MakeMenuButton //Calls MakeMenuButton.js to create the three side buttons
              key={i}
              text={u.name}
              x={0}
              y={(i + 1) * gui.menuOffset + i * gui.menuControlHeight}
              handleClick={u.func}
              buttonColor={props.wsButtonColor}
            />
          ))}
        </Group>
      </Group >
    </>
  );
}

export default Menu;
