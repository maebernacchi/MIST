import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import gui from "./mistgui-globals";
import { Spring, animated } from "react-spring/renderprops-konva";
import nodeDimensions from "./globals-nodes-dimensions.js";
import global, { width, height } from "./globals.js";

export const funcGroup = function makeFunctionGroup(
  addNode,
  funName,
  x,
  y,
  vis,
  changeKey,
  index
) {
  return (
    <Group
      name={funName}
      key={index}
      x={x}
      y={y}
      draggable
      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
          shadowBlur: 6,
          scaleX: 1.1,
          scaleY: 1.1,
        });
      }}
      onDragEnd={(e) => {
        e.target.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
        });
        if (e.currentTarget.y() > global.menuHeight) {
          //setTimeout(function () {
            addNode("fun", funName, e.target._lastPos.x, e.target._lastPos.y);
            changeKey();
          //}, 200);
        } else {
          changeKey();
        }
      }}
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > width - nodeDimensions.functionWidth) {
          pos.x = width - nodeDimensions.functionWidth;
        }
        if (pos.y < 0) {
          pos.y = 0;
        }
        if (
          pos.y >
          height - global.funBarHeight - nodeDimensions.functionWidth
        ) {
          pos.y = height - global.funBarHeight - nodeDimensions.functionWidth;
        }
        return pos;
      }}
    >
      <Spring
        native
        from={{
          x: vis ? 0 : -300,
          scaleX: 1,
          scaleY: 1,
        }}
        to={{
          x: vis ? 0 : -300
        }}
      >
        {(props) => (
          <animated.Rect
            {...props}
            y={0}
            width={nodeDimensions.functionWidth}
            height={nodeDimensions.functionWidth}
            fill={gui.functions[funName].color}
            cornerRadius={10}
          />
        )}
      </Spring>
      <Spring
        native
        from={{ x: vis ? 0 : -300,
          fontSize: gui.nodeFontSize }}
        to={{ x: vis ? 0 : -300 }}
      >
        {(props) => (
          <animated.Text
            {...props}
            text={gui.functions[funName].rep}
            fontFamily={gui.globalFont}
            fill={"white"}
            y={0}
            width={nodeDimensions.functionWidth}
            height={nodeDimensions.functionWidth}
            align={"center"}
            verticalAlign={"middle"}
          />
        )}
      </Spring>
    </Group>
  );
};
