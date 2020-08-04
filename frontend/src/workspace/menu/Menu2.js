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

import React, { useState, useRef, useContext, useEffect } from "react";
import { Rect, Group, Text, Shape, Line } from "react-konva";
import gui from "../globals/mistgui-globals";
import { MIST } from "../mist/mist.js";
import Portal from "../buildingtools/Portal";
import FuncGroup from "./MakeFunction2";
import ValGroup from "./MakeValue2";
import { globalContext } from "../globals/global-context.js";
import { menuContext } from "../globals/globals-menu-dimensions";
import { fontContext } from "../globals/globals-fonts";
import { animated, useSpring } from "react-spring";
import globalsThemes from "../globals/globals-themes";
import { MenuTabsContextProvider } from "../globals/globals-menuTabs";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

function Menu2(props) {
  const global = useContext(globalContext);
  const menuDimensions = useContext(menuContext);
  const fonts = useContext(fontContext);

  // +--------+--------------------------------------------------------
  // | States |
  // +--------+

  const [isValueMenuOpen, setIsValueMenuOpen] = useState(false);
  const [isFunctionMenuOpen, setIsFunctionMenuOpen] = useState(true);
  const [isCustomMenuOpen, setIsCustomMenuOpen] = useState(false);
  const [isSavedMenuOpen, setIsSavedMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  useEffect(() => {
    props.setMenuTabs(isValueMenuOpen, isFunctionMenuOpen, isCustomMenuOpen, isSavedMenuOpen, isSettingsMenuOpen);
  }, [isValueMenuOpen, isFunctionMenuOpen, isCustomMenuOpen. isSavedMenuOpen, isSettingsMenuOpen])

  const [key, setKey] = useState(Math.random());
  const ref = useRef(null);
  const [formValue, setFormValue] = useState("Enter a MIST expression");

  // +--------+
  // | States |
  // +--------+--------------------------------------------------------
  const element = document.getElementById("workspace");
  console.log("props.top: " + props.top);
  const formStyle = useSpring({
    from: {
      position: "absolute",
      top: props.top + menuDimensions.lowerMenuHeight + 20,
      left: isValueMenuOpen
        ? 2 * global.width + props.left
        : isFunctionMenuOpen
        ? global.width + props.left
        : isCustomMenuOpen
        ? 0 + props.left
        : -global.width + props.left,
    },
    to: {
      position: "absolute",
      top: props.top + menuDimensions.lowerMenuHeight + 20,
      left: isValueMenuOpen
        ? 2 * global.width + props.left
        : isFunctionMenuOpen
        ? global.width + props.left
        : isCustomMenuOpen
        ? 0 + props.left
        : -global.width + props.left,
    },
  });

  /**
   * This gets called from MakeFunctions and MakeValues to change the group's
   * key to trigger a re-render (so that the node goes back to the right place
   * if it's drag-and-dropped into the menu, not the workspace)
   */
  function changeKey() {
    setKey(Math.random());
  }

  return (
      <Group
        width={global.width}
        height={menuDimensions.totalMenuHeight}
        key={key}
        ref={ref}
      >
        <Rect
          y={menuDimensions.lowerMenuHeight}
          width={global.width * 4}
          height={menuDimensions.upperMenuHeight}
          fill={props.bgColor}
          shadowBlur={5}
          opacity={0.98}
        />
        <Portal>
          <animated.form
            id="form"
            style={formStyle}
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
            <input
              id={"input"}
              style={{
                width: global.width,
                height: menuDimensions.upperMenuHeight * 0.7,
                backgroundColor: props.bgColor,
                border: "none",
              }}
              id="textbox"
              type="text"
              placeholder={formValue}
              onChange={(e) => {
                setFormValue(e.target.value);
              }}
            />
          </animated.form>
        </Portal>
        <Line
          points={[
            0,
            menuDimensions.lowerMenuHeight + 1.5,
            global.width,
            menuDimensions.lowerMenuHeight + 1.5,
          ]}
          stroke={
            isValueMenuOpen
              ? props.valTabColor
              : isFunctionMenuOpen
              ? props.funTabColor
              : isCustomMenuOpen
              ? props.customTabColor
              : isSavedMenuOpen
              ? props.savedTabColor
              : props.settingsTabColor
          }
          strokeWidth={3}
          shadowBlur={2}
          shadowOffsetY={1}
          shadowOpacity={0.3}
        />
        {[
          {
            text: "Value",
            open: isValueMenuOpen,
            func: function () {
              setIsValueMenuOpen(true);
              setIsFunctionMenuOpen(false);
              setIsCustomMenuOpen(false);
              setIsSavedMenuOpen(false);
              setIsSettingsMenuOpen(false);
            },
          },
          {
            text: "Function",
            open: isFunctionMenuOpen,
            func: function () {
              setIsValueMenuOpen(false);
              setIsFunctionMenuOpen(true);
              setIsCustomMenuOpen(false);
              setIsSavedMenuOpen(false);
              setIsSettingsMenuOpen(false);
            },
          },
          {
            text: "Custom",
            open: isCustomMenuOpen,
            func: function () {
              setIsValueMenuOpen(false);
              setIsFunctionMenuOpen(false);
              setIsCustomMenuOpen(true);
              setIsSavedMenuOpen(false);
              setIsSettingsMenuOpen(false);
            },
          },
          {
            text: "Saved",
            open: isSavedMenuOpen,
            func: function () {
              setIsValueMenuOpen(false);
              setIsFunctionMenuOpen(false);
              setIsCustomMenuOpen(false);
              setIsSavedMenuOpen(true);
              setIsSettingsMenuOpen(false);
            },
          },
          {
            text: "Settings",
            open: isSettingsMenuOpen,
            func: function () {
              setIsValueMenuOpen(false);
              setIsFunctionMenuOpen(false);
              setIsCustomMenuOpen(false);
              setIsSavedMenuOpen(false);
              setIsSettingsMenuOpen(true);
            },
          },
        ].map((u, i) => {
          return (
            <Group
              x={(global.width / 5) * i}
              width={global.width / 5}
              height={menuDimensions.lowerMenuHeight}
            >
              <Rect
                width={global.width / 5}
                height={menuDimensions.lowerMenuHeight}
                fill={
                  u.open
                    ? u.text === "Value"
                      ? props.valTabColor
                      : u.text === "Function"
                      ? props.funTabColor
                      : u.text === "Custom"
                      ? props.customTabColor
                      : u.text === "Saved"
                      ? props.savedTabColor
                      : props.settingsTabColor
                    : props.bgColor
                }
                opacity={u.open ? 1 : 0.5}
                shadowBlur={2}
                shadowOpacity={0.3}
                shadowOffsetY={-1.5}
                shadowEnabled={u.open}
                onMouseEnter={() => {
                  u.func();
                }}
              />
              <Text
                width={global.width / 5}
                height={menuDimensions.lowerMenuHeight}
                text={u.text}
                fill={
                  (u.text === "Function" ||
                    u.text === "Custom" ||
                    u.text === "Settings") &&
                  u.open
                    ? "white"
                    : props.theme === "dark"
                    ? "white"
                    : "black"
                }
                fontFamily={fonts.menuFont}
                fontStyle={"italic"}
                fontWeight={u.open ? "bold" : "light"}
                fontSize={fonts.menuTabFontSize}
                align={"center"}
                verticalAlign={"middle"}
                onMouseEnter={() => {
                  u.func();
                }}
              />
            </Group>
          );
        })}
        {gui.valNames.map((name, index) => (
          <ValGroup
            addNode={props.addNode}
            valName={name}
            x={
              menuDimensions.valueMargin +
              index * (menuDimensions.valueMargin + global.valueWidth)
            }
            y={
              menuDimensions.lowerMenuHeight +
              (menuDimensions.upperMenuHeight - global.valueWidth) / 2
            }
            tabs={{
              isValueMenuOpen: isValueMenuOpen,
              isFunctionMenuOpen: isFunctionMenuOpen,
              isCustomMenuOpen: isCustomMenuOpen,
              isSavedMenuOpen: isSavedMenuOpen,
              isSettingsMenuOpen: isSettingsMenuOpen,
            }}
            changeKey={changeKey}
            index={index}
          />
        ))}
        {gui.funNames.map((name, index) => (
          <FuncGroup
            addNode={props.addNode}
            funName={name}
            x={
              menuDimensions.functionMargin +
              index * (menuDimensions.functionMargin + global.functionWidth)
            }
            y={
              menuDimensions.lowerMenuHeight +
              (menuDimensions.upperMenuHeight - global.functionWidth) / 2
            }
            tabs={{
              isValueMenuOpen: isValueMenuOpen,
              isFunctionMenuOpen: isFunctionMenuOpen,
              isCustomMenuOpen: isCustomMenuOpen,
              isSavedMenuOpen: isSavedMenuOpen,
              isSettingsMenuOpen: isSettingsMenuOpen,
            }}
            changeKey={changeKey}
            index={index}
          />
        ))}
      </Group>
  );
}

export default Menu2;
