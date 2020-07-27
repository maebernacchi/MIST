import React, { useState, useEffect, useRef } from "react";
import { Rect, Group, Text, Shape, Image } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImage";
import useImage from "use-image";
import nodeDimensions from "./globals-nodes-dimensions.js";
import globals from "./globals.js";

/**
 *
 * @param props
 */
function FunNode(props) {
  const name = props.name;
  const index = props.index;
  const x = props.x;
  const y = props.y;
  const rep = gui.functions[name].rep;
  const numOutlets = props.numOutlets;
  const [showImage, setShowImage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [trashHovered, setTrashHovered] = useState(false);
  const [image] = useImage(require("./trash.png"));
  const groupRef = useRef(null);

  function Trashcan() {
    return (
      <Image
        image={image}
        x={nodeDimensions.functionTrashX}
        y={nodeDimensions.functionTrashY}
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

  useEffect(() => {
    if (!props.renderFunction) {
      setShowImage(false);
    }
  }, [props.renderFunction]);

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      draggable
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > window.innerWidth - nodeDimensions.functionWidth) {
          pos.x = window.innerWidth - nodeDimensions.functionWidth;
        }
        if (pos.y < globals.menuHeight) {
          pos.y = globals.menuHeight;
        }
        if (
          pos.y >
          window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionWidth
        ) {
          pos.y =
            window.innerHeight -
            globals.funBarHeight -
            nodeDimensions.functionWidth;
        }
        return pos;
      }}
      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
          shadowOffset: {
            x: 5,
            y: 5,
          },
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
        props.updateNodePosition(index, e.currentTarget.x(), e.currentTarget.y());
      }}
      onDragMove={(e) => {
        props.updateLinePosition(index, 'fun', e.currentTarget.x(), e.currentTarget.y());
      }}
      onClick={(e) => {
        if (e.target.attrs.name) {
          props.outletClicked(
            index,
            parseInt(e.target.attrs.name.substring(6)) - 1
          );
        } else {
          props.funClicked(index);
        }
      }}
      onDblClick={() => {
        props.dblClickHandler(index);
      }}
    >
      <Group
        onMouseEnter={(e) => {
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1.07,
              scaleY: 1.07
            })
            return 0;
          })
          setHovered(true);
        }}
        onMouseLeave={(e) => {
          setHovered(false);
          groupRef.current.children.map((u, i) => {
            u.to({
              duration: 0.5,
              easing: Konva.Easings.ElasticEaseOut,
              scaleX: 1,
              scaleY: 1
            })
            return 0;
          })
        }}
      >
        <Rect
          x={0}
          y={0}
          width={nodeDimensions.functionWidth}
          height={
            props.numOutlets <= 3
              ? nodeDimensions.functionWidth
              : nodeDimensions.functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          fill={gui.functions[name].color}
          cornerRadius={10}
          shadowColor={
            hovered ? (trashHovered ? "red" : props.hoverShadowColor) : "black"
          }
          shadowOffset={{ x: hovered ? 0 : 1, y: hovered ? 0 : 1 }}
          shadowBlur={3}
          _useStrictMode
        />
        <Text
          text={rep}
          fontFamily={gui.globalFont}
          fill={"white"}
          fontSize={gui.nodeFontSize}
          x={0}
          y={0}
          width={nodeDimensions.functionWidth}
          height={
            props.numOutlets <= 3
              ? nodeDimensions.functionWidth
              : nodeDimensions.functionWidth +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          align={"center"}
          verticalAlign={"middle"}
          _useStrictMode
        />
        <Trashcan />
      </Group>
      {showImage ? (
        <Portal>
          <MISTImage
            onClick={() => setShowImage(false)}
            x={x + nodeDimensions.functionImageBoxOffset + props.offsetX}
            y={y + nodeDimensions.functionImageBoxOffset + props.offsetY}
            width={nodeDimensions.renderSideLength}
            height={nodeDimensions.renderSideLength}
            renderFunction={props.renderFunction ? props.renderFunction : ""}
            automated={false}
          />
        </Portal>
      ) : (
        <Rect
          onClick={() => {
            console.log(props.renderFunction);
            if (props.renderFunction) {
              setShowImage(true);
            }
          }}
          name={"imageBox"}
          x={nodeDimensions.functionImageBoxOffset}
          y={
            props.numOutlets <= 3
              ? nodeDimensions.functionImageBoxOffset
              : nodeDimensions.functionImageBoxOffset +
                (props.numOutlets - 3) * nodeDimensions.outletYOffset
          }
          width={nodeDimensions.imageBoxSideLength}
          height={nodeDimensions.imageBoxSideLength}
          fill={gui.imageBoxColor}
          shadowColor={"gray"}
          shadowBlur={2}
          shadowOffsetX={1}
          shadowOffsetY={1}
          expanded={false}
          visible={typeof props.renderFunction === 'string'}
        />
      )}
      {name === "rgb"
        ? ["red", "green", "blue"].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -gui.bezPoint,
                  -gui.bezPoint,
                  -gui.bezPoint,
                  gui.bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              key={i} // to silence a warning
              x={nodeDimensions.outletXOffset}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: -5 }}
              fillRadialGradientStartRadius={3}
              fillRadialGradientEndPoint={{ x: -15, y: -5 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[0, u, 1, "dark" + u]}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
          ))
        : [...Array(numOutlets)].map((u, i) => (
            <Shape
              sceneFunc={function (context) {
                context.beginPath();
                context.moveTo(0, 0);
                context.bezierCurveTo(
                  -gui.bezPoint,
                  -gui.bezPoint,
                  -gui.bezPoint,
                  gui.bezPoint,
                  0,
                  0
                );
                context.closePath();
                context.fillStrokeShape(this);
              }}
              name={"outlet" + (i + 1)}
              x={nodeDimensions.outletXOffset}
              key={i}
              y={i * nodeDimensions.outletYOffset + nodeDimensions.outletStartY}
              fillRadialGradientStartPoint={{ x: -19, y: -5 }}
              fillRadialGradientStartRadius={3}
              fillRadialGradientEndPoint={{ x: -15, y: -5 }}
              fillRadialGradientEndRadius={15}
              fillRadialGradientColorStops={[
                0,
                gui.outletColor,
                1,
                gui.outletColor2,
              ]}
              onMouseOver={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1.2,
                  scaleY: 1.2,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
              onMouseOut={(e) => {
                e.target.to({
                  duration: 0.3,
                  easing: Konva.Easings.ElasticEaseOut,
                  scaleX: 1,
                  scaleY: 1,
                  shadowOffsetX: 5,
                  shadowOffsetY: 5,
                });
              }}
            />
          ))}
    </Group>
  );
}
export default FunNode;
