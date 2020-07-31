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

import React, { useState, useRef, useContext } from "react";
import { Rect, Group, Text, Shape } from "react-konva";
import gui from "./mistgui-globals";
import { MIST } from "./mist.js";
import Portal from "./Portal";
import MakeMenuButton from "./MakeMenuButton";
import FuncGroup from "./MakeFunction1";
import ValGroup from "./MakeValue1";
import { globalContext } from "./global-context.js";
import { menuContext1 } from "./globals-menu-dimensions1";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function Menu1(props) {
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

  const menuDimensions = useContext(menuContext1);
  const global = useContext(globalContext);
  const width = useContext(globalContext).width;
  const valueWidth = useContext(globalContext).valueWidth;
  const functionWidth = useContext(globalContext).functionWidth;

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

  return (
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
              fill={props.bgColor}
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
            {gui.valNames.map((u, index) => (
              <ValGroup
                addNode={props.addNode}
                valName={gui.valNames[index]}
                x={
                  -menuDimensions.valueListLength +
                  menuDimensions.valueListStartX +
                  index * (menuDimensions.valueMargin + valueWidth)
                }
                y={gui.menuYspacing - 20}
                vis={isValueMenuOpen}
                changeKey={changeKey}
                index={index}
              />
            ))}
            {u.name === "Functions" &&
              gui.funNames.map((u, index) => (
                <FuncGroup
                  addNode={props.addNode}
                  funName={gui.funNames[index]}
                  x={
                    -menuDimensions.functionListLength +
                    menuDimensions.functionListStartX +
                    index * (menuDimensions.functionMargin + functionWidth)
                  }
                  y={gui.menuYspacing - 20}
                  vis={isFunctionMenuOpen}
                  changeKey={changeKey}
                  index={index}
                />
              ))}
          </Group>
        );
      })}
      <Group visible={false}>
        {[
          { name: "Reset Workspace", func: props.clearWorkspace },
          { name: "Open Workspace" },
          { name: "Save Workspace" },
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
    </Group>
  );
}

export default Menu1;
