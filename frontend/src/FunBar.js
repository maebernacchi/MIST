import React, { useState } from "react";
import { Rect, Group, Text, Shape, useStrictMode } from "react-konva";
import Konva from "konva";
import Portal from "./Portal";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImageCreate";
import "./styleSheets/FunBar.css";
import { Spring, animated } from "react-spring/renderprops-konva";
import { BsReverseLayoutSidebarInsetReverse } from "react-icons/bs";
import { render } from "react-dom";

function FunBar(props) {
  return (
    <Group x={0} y={gui.height - gui.funBarHeight}>
      <BarBase {...props}/>
      <FunctionButton {...props}/>
      <ImageButton {...props}/>
    </Group>
  );
}

function BarBase(props) {

  return (
    <Group>
    <Rect // Blue bar at bottom of workspace
      x={0}
      y={0}
      width={gui.funBarWidth}
      height={gui.funBarHeight}
      fill={props.bg}
    />
    <Rect // Render function white background
      x={gui.funBarOffset}
      y={gui.funBarOffset}
      width={gui.funBarTextAreaWidth}
      height={gui.funBarTextAreaHeight}
      fill={props.functionBoxBg}
    />
    <Text // Render function text display
      text={props.renderFunction.renderFunction}
      x={gui.funBarTextOffset}
      y={gui.funBarTextOffset}
      width={gui.funBarTextAreaWidth - gui.funBarTextOffset}
      height={gui.funBarTextAreaHeight - 2 * gui.funBarOffset}
      fill={props.functionTextColor}
      fontFamily={"Courier New"}
      fontSize={gui.funBarDisplayFontSize}
    />
    <Text // "Save as..." display in blue bar
      text={"Save as..."}
      x={gui.funBarTextAreaWidth + 2 * gui.funBarOffset}
      y={gui.funBarHeight / 2 - gui.funBarFontSize / 2}
      width={gui.funBarWidth * (3 / 25)}
      fill={"white"}
      fontSize={gui.funBarFontSize}
    />
    </Group>
  );
}

function FunctionButton(props) {
  const [functionButtonHovered, setFunctionButtonHovered] = useState(false);

  return(
    <Group // Function Button on blue bar
    x={
      gui.funBarTextAreaWidth +
      gui.funBarWidth * (2 / 25) +
      gui.funBarOffset
    }
    y={gui.funBarOffset}
  >
    <Spring // animates function button fill
      native
      from={{ fill: props.renderFunction.isRenderable ? 'orange' : "#f79f6a" }}
      to={{
        fill: props.renderFunction.isRenderable
          ? (functionButtonHovered ? "white" : 'orange')
          : "#f79f6a"
      }}
    >
      {(props) => (
        <animated.Rect // function button
          {...props}
          x={0}
          y={0}
          width={gui.funBarIconTextWidth}
          height={gui.funBarTextAreaHeight}
          stroke={"#424874"}
          cornerRadius={8}
        />
      )}
    </Spring>
    <Text // function button
      text={"Function"}
      x={0}
      y={gui.funBarOffset}
      width={gui.funBarIconTextWidth}
      height={gui.funBarTextAreaHeight}
      align={"center"}
      fill={!functionButtonHovered ? "white" : "grey"}
      fontSize={gui.funBarFontSize}
      onMouseOver={() => {
        setFunctionButtonHovered(true);
      }}
      onMouseOut={() => {
        setFunctionButtonHovered(false);
      }}
    />
  </Group>

  );
}

function ImageButton(props) {

  const [imageButtonClicked, setImageButtonClicked] = useState(false);
  const [imageButtonHovered, setImageButtonHovered] = useState(false);

  function closePortal() {
    setImageButtonClicked(false);
  }

  return(
    <Group // Image Button on blue bar
        x={
          gui.funBarTextAreaWidth +
          gui.funBarWidth * (2 / 25) +
          gui.funBarOffset +
          gui.funBarIconTextWidth +
          2 * gui.funBarOffset
        }
        y={gui.funBarOffset}
      >
        <Spring // animates image button fill
          native
          from={{ fill: props.renderFunction.isRenderable ? 'orange' : "#f79f6a" }}
          to={{
            fill: props.renderFunction.isRenderable
              ? (imageButtonHovered ? "white" : 'orange')
              : "#f79f6a"
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              x={0}
              y={0}
              width={gui.funBarIconTextWidth}
              height={gui.funBarTextAreaHeight}
              stroke={"#424874"}
              cornerRadius={8}
            />
          )}
        </Spring>
        {imageButtonClicked ? ( //temp; remove ! later
          <ImagePortal {...props} closePortal={closePortal}/>
        ) : (      
            <Text
              text={"Image"}
              x={0}
              y={gui.funBarOffset}
              width={gui.funBarIconTextWidth}
              align={"center"}
              fill={imageButtonHovered ? "gray" : "white"}
              fontSize={gui.funBarFontSize}
              onClick={() => {
                if (props.renderFunction.isRenderable) {
                  setImageButtonClicked(true);
                  setImageButtonHovered(false);
                }
              }}
              onMouseOver={() => {
                setImageButtonHovered(true);
              }}
              onMouseOut={() => {
                setImageButtonHovered(false);
              }}
            />
          )}
      </Group>

  );
}

function ImagePortal(props) {
  return(
    <Portal>
            <div
              style={{
                position: "absolute",
                top: props.top,
                left: props.left,
                width: gui.width,
                height: gui.height,
                backgroundColor: "black",
                opacity: 0.7,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: props.top + 0.5 * gui.popSaveGroupY,
                left: props.left + gui.popSaveGroupX,
                width: gui.popRectWidth,
                height: gui.popRectHeight,
                borderRadius: 25,
                backgroundColor: gui.popRectColor,
              }}
            />
            <MISTImage
              x={props.left + gui.popCanvasShiftX}
              y={props.top + gui.popCanvasShiftY}
              width={gui.popCanvasSide}
              height={gui.popCanvasSide}
              renderFunction={props.renderFunction.renderFunction}
              automated={true}
            />
            <div
              style={{
                position: "absolute",
                top: props.top + gui.popTextShiftY,
                left: props.left + gui.popSaveGroupX + gui.popTextShiftX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                textAlign: "center",
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                overflow: "auto",
              }}
            >
              <p>{props.renderFunction.renderFunction}</p>
            </div>
            <div
              style={{
                position: "absolute",
                top: props.top + 0.8 * gui.popSaveGroupY,
                left: props.left + gui.popTextShiftX + gui.popSaveGroupX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                textAlign: "center",
              }}
            >
              <form>
                <input
                  type={"text"}
                  placeholder={"Enter Name Of Image"}
                  style={{
                    width: 0.7 * gui.popTextWidth,
                    height: 0.7 * gui.popTextHeight,
                    border: "2px solid #008CBA",
                  }}
                />
              </form>
            </div>
            <div
              style={{
                position: "absolute",
                top: props.top + gui.popSaveGroupY + gui.popCanvasSide + gui.popTextHeight * 2,
                left: props.left + gui.popTextShiftX + gui.popSaveGroupX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                textAlign: "center",
              }}
            >
              {["Cancel", "Download", "Save"].map((u, i) => {
                return (
                  <button
                    class="button button2"
                    onClick={() => {
                      if (u === "Cancel") {
                        props.closePortal();
                      }
                    }}
                  >
                    {u}
                  </button>
                );
              })}
            </div>
          </Portal>

  );
}

export default FunBar;

