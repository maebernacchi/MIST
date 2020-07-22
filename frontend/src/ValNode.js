import React, { useState } from "react";
import { Rect, Group, Text, Shape, Image } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImageCreate";
import useImage from "use-image";
import nodeDimensions from "./globals-nodes-dimensions.js";
import globals from "./globals.js";

/**
 *
 * @param props
 */
function ValNode(props) {
  const name = props.name;
  const x = props.x;
  const y = props.y;
  const index = props.index;
  const rep = gui.values[name].rep;
  const renderFunction = gui.values[name].rep;
  const [showImage, setShowImage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./Logos/trash.png"));

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.valueTrashX}
        y={nodeDimensions.valueTrashY}
        width={14}
        height={14}
        shadowColor={trashHovered ? "red" : "cyan"}
        shadowBlur={5}
        visible={hovered}
        onMouseEnter={() => {
          setTrashHovered(true);
        }}
        onMouseLeave={() => {
          setTrashHovered(false);
          setHovered(false);
        }}
        onClick={() => props.removeNode(props.index)}
      />
    );
  }

  return (
    <Group
      x={x}
      y={y}
      draggable
      dragBoundFunc={function (pos) {
        if (pos.x < 0 - nodeDimensions.functionStrokeWidth) {
          pos.x = 0;
        }
        if (
          pos.x >
          window.innerWidth -
            nodeDimensions.functionTotalSideLength -
            nodeDimensions.functionStrokeWidth
        ) {
          pos.x = window.innerWidth - nodeDimensions.functionTotalSideLength;
        }
        if (pos.y < globals.menuHeight) {
          pos.y = globals.menuHeight;
        }
        if (
          pos.y >
          window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionTotalSideLength
        ) {
          pos.y =
            window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionTotalSideLength;
        }
        return pos;
      }}
      onDragStart={(e) => {
        e.target.setAttrs({
          shadowOffset: {
            x: 15,
            y: 15,
          },
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
          shadowOffsetX: 5,
          shadowOffsetY: 5,
        });
      }}
      onDragMove={(e) => {
        props.handler(index, e.currentTarget.x(), e.currentTarget.y());
      }}
      onClick={(e) => {
        props.clickHandler(index);
      }}
      onDblClick={(e) => {
        props.dblClickHandler(index);
      }}
    >
      <Group
        onMouseEnter={(e) => {
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
        }}
      >
        <Rect
          x={nodeDimensions.valueOffset}
          y={0}
          width={nodeDimensions.valueSideLength}
          height={nodeDimensions.valueSideLength}
          fill={gui.values[name].color}
          cornerRadius={10}
          lineJoin={"round"}
          rotation={45}
          stroke={gui.values[name].color}
          strokeWidth={nodeDimensions.functionStrokeWidth}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          _useStrictMode
        />
        <Text
          text={rep}
          fontFamily={gui.globalFont}
          fill={"black"}
          fontSize={gui.nodeFontSize}
          x={0}
          y={0}
          width={nodeDimensions.valueWidth}
          height={nodeDimensions.valueWidth}
          align={"center"}
          verticalAlign={"middle"}
          _useStrictMode
        />
        <Trashcan />
      </Group>
      {showImage ? (
        <Portal>
          <MISTImage
            onClick={() => setShowImage(!showImage)}
            x={x + nodeDimensions.valueImageBoxOffset + props.offsetX}
            y={y + nodeDimensions.valueImageBoxOffset + props.offsetY}
            width={nodeDimensions.renderSideLength}
            height={nodeDimensions.renderSideLength}
            renderFunction={renderFunction}
            automated={false}
          />
        </Portal>
      ) : (
        <Rect
          onClick={() => setShowImage(!showImage)}
          name={"imageBox"}
          x={nodeDimensions.valueImageBoxOffset}
          y={nodeDimensions.valueImageBoxOffset}
          width={nodeDimensions.imageBoxSideLength}
          height={nodeDimensions.imageBoxSideLength}
          fill={gui.imageBoxColor}
          expanded={false}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
        />
      )}
    </Group>
  );
}

export default ValNode;
