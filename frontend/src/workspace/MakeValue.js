import React from "react";
import { Group } from "react-konva";
import Konva from "konva";
import gui from "./mistgui-globals";
import { Spring, animated } from "react-spring/renderprops-konva";
import nodeDimensions from "./globals-nodes-dimensions.js";
import global, { width, height } from "./globals.js";

export const valGroup = function (
  addNode,
  valName,
  x,
  y,
  vis,
  changeKey,
  index
) {
  return (
    <Group
      name={valName}
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
            addNode("val", valName, e.target._lastPos.x, e.target._lastPos.y);
            changeKey();
          //}, 200);
        }
        else {
          changeKey();
        }
      }}
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > width - nodeDimensions.valueWidth) {
          pos.x = width - nodeDimensions.valueWidth;
        }
        if (pos.y < 0) {
          pos.y = 0;
        }
        if (pos.y > height - global.funBarHeight - nodeDimensions.valueWidth) {
          pos.y = height - global.funBarHeight - nodeDimensions.valueWidth;
        }
        return pos;
      }}
    >
      <Spring
        native
        from={{
          x: vis ? nodeDimensions.valueOffset : -300,
          scaleX: 1,
          scaleY: 1,
        }}
        to={{
          x: vis ? nodeDimensions.valueOffset : -300
        }}
      >
        {(props) => (
          <animated.Rect
            {...props}
            y={0}
            width={nodeDimensions.valueSideLength}
            height={nodeDimensions.valueSideLength}
            fill={gui.values[valName].color}
            cornerRadius={10}
            rotation={45}
          />
        )}
      </Spring>
      <Spring
        native
        from={{ x: vis ? 0 : -300, fontSize: gui.nodeFontSize }}
        to={{
          x: vis ? 0 : -300
        }}
      >
        {(props) => (
          <animated.Text
            {...props}
            text={gui.values[valName].rep}
            fontFamily={gui.globalFont}
            fill={"black"}
            y={0}
            width={nodeDimensions.valueWidth}
            height={nodeDimensions.valueWidth}
            align={"center"}
            verticalAlign={"middle"}
          />
        )}
      </Spring>
    </Group>
  );
};
