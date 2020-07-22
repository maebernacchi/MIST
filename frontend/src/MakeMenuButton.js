import React, { useState } from "react";
import { Rect, Group, Text, Shape, useStrictMode } from "react-konva";
import Konva from "konva";
import gui from "./mistgui-globals.js";
import { Spring, animated } from "react-spring/renderprops-konva";

/**
 * Makes one of those "Reset Workspace", "Open Workspace", and "Save Workspace" buttons
 * @param {*} props
 */
function MakeMenuButton(props) {
  const [hovered, setHover] = useState(false);

  function handleMouse(e) {
    e.target.to({
      duration: 0.2,
      shadowBlur: 2,
      shadowColor: "blue",
    });
  }

  function handleMouseOut(e) {
    e.target.to({
      duration: 0.1,
      shadowBlur: 0,
    });
  }

  function handleClick(e) {
    if (props.text === "Reset Workspace") {
      props.handleClick();
    }
  }

  return (
    <Group
      x={props.x}
      y={props.y}
      onClick={() => {
        if (props.text === "Reset Workspace") {
          props.handleClick();
        }
      }}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Spring // animates the fill color change
        from={{ fill: props.buttonColor }}
        to={{ fill: hovered ? "orange" : props.buttonColor }}
      >
        {(props) => (
          <animated.Rect // rectangle of the button
            {...props}
            x={5}
            y={0}
            width={gui.menuCornerWidth - 2 * gui.menuOffset}
            height={gui.menuControlHeight}
            shadowColor={"black"}
            shadowEnabled={false}
            cornerRadius={15}
          />
        )}
      </Spring>
      <Text
        x={0}
        y={gui.menuTextOffset}
        width={gui.menuCornerWidth - 2 * gui.menuOffset}
        height={gui.menuControlHeight}
        text={props.text}
        align={"center"}
        fill={"white"}
        fontFamily={gui.globalFont}
        fontSize={gui.menuFontSize}
      />
    </Group>
  );
}

export default MakeMenuButton;
