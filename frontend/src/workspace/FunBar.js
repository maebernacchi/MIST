import React, { useState, useContext, useEffect } from "react";
import { Rect, Group, Text } from "react-konva";
import gui from "./mistgui-globals.js";
import "../design/styleSheets/FunBar.css";
import { Spring, animated } from "react-spring/renderprops-konva";
import PopupCanvas from "./PopupCanvas";
import { funBarContext } from "./globals-funbar-dimensions";
import { globalContext } from "./global-context";
import { fontContext } from "./globals-fonts";

function FunBar(props) {
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  const funBarHeight = useContext(globalContext).funBarHeight;
  const funbarDimensions = useContext(funBarContext);
  const funBarFontSize = useContext(fontContext).funBarFontSize;
  const funBarRFFontSize = useContext(fontContext).funBarRFFontSize;
  // only here because props isn't recognized from Spring
  const renderFunction = props.renderFunction;

  const [functionButtonHovered, setFunctionButtonHovered] = useState(false);
  const [imageButtonClicked, setImageButtonClicked] = useState(false);
  const [imageButtonHovered, setImageButtonHovered] = useState(false);

  return (
    <Group y={funbarDimensions.funbarY}>
      {/* <Rect width={50} height={50} fill={'pink'}/>
      <Text y={100} fill={'blue'} text={funbarDimensions.funbarY}/> */}
      <BarBase {...props} />
      <FunctionButton {...props} />
      <ImageButton {...props} />
    </Group>
  );

  function BarBase(props) {
    return (
      <Group>
        {/* <Rect // Blue bar at bottom of workspace
          x={0}
          y={0}
          width={width}
          height={funBarHeight}
          fill={props.bg}
        /> */}
        <Rect // Render function white background
          x={funbarDimensions.margin}
          y={funbarDimensions.margin}
          width={funbarDimensions.rfTextAreaWidth}
          height={funbarDimensions.rfTextAreaHeight}
          fill={props.functionBoxBg}
          shadowBlur={5}
          shadowOffset={{ x: 2, y: 3 }}
          shadowOpacity={0.5}
        />
        <Text // Render function text display
          text={props.renderFunction.renderFunction}
          x={funbarDimensions.margin}
          y={funbarDimensions.margin}
          width={funbarDimensions.rfTextAreaWidth}
          height={funbarDimensions.rfTextAreaHeight}
          verticalAlign={"middle"}
          fill={props.functionTextColor}
          fontFamily={"Courier New"}
          fontSize={funBarRFFontSize}
        />
      </Group>
    );
  }

  function FunctionButton(props) {
    return (
      <Group // Function Button on blue bar
        x={funbarDimensions.functionButtonX}
        y={funbarDimensions.margin}
      >
        <Spring // animates function button fill
          native
          from={{
            fill: "orange",
          }}
          to={{
            fill:
              props.renderFunction.isRenderable && functionButtonHovered
                ? "white"
                : "orange",
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              x={0}
              y={0}
              width={funbarDimensions.functionButtonWidth}
              height={funbarDimensions.functionButtonHeight}
              //stroke={"#424874"}
              cornerRadius={8}
              shadowBlur={5}
              shadowOffset={{ x: 2, y: 3 }}
              shadowOpacity={0.5}
              opacity={renderFunction.isRenderable ? 1 : 0.8}
            />
          )}
        </Spring>
        <Text // function button
          text={"Function"}
          x={0}
          width={funbarDimensions.functionButtonWidth}
          height={funbarDimensions.functionButtonHeight}
          align={"center"}
          verticalAlign={"middle"}
          fill={!functionButtonHovered ? "white" : "grey"}
          fontSize={funBarFontSize}
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
    function closePortal() {
      setImageButtonClicked(false);
    }

    return (
      <Group // Image Button on blue bar
        x={funbarDimensions.imageButtonX}
        y={funbarDimensions.margin}
      >
        <Spring // animates image button fill
          native
          from={{
            fill: "orange",
          }}
          to={{
            fill:
              props.renderFunction.isRenderable && imageButtonHovered
                ? "white"
                : "orange",
          }}
        >
          {(props) => (
            <animated.Rect // function button
              {...props}
              width={funbarDimensions.imageButtonWidth}
              height={funbarDimensions.imageButtonHeight}
              //stroke={"#424874"}
              cornerRadius={8}
              shadowBlur={5}
              shadowOffset={{ x: 2, y: 3 }}
              shadowOpacity={0.5}
              opacity={renderFunction.isRenderable ? 1 : 0.8}
            />
          )}
        </Spring>
        <Text
          text={"Image"}
          width={funbarDimensions.imageButtonWidth}
          height={funbarDimensions.imageButtonHeight}
          align={"center"}
          verticalAlign={"middle"}
          fill={imageButtonHovered ? "gray" : "white"}
          fontSize={funBarFontSize}
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
        {imageButtonClicked && (
          <Group>
            <PopupCanvas
              {...props}
              x={-funbarDimensions.imageButtonX}
              y={-(height - funBarHeight - funbarDimensions.margin)}
              closePortal={closePortal}
            />
          </Group>
        )}
      </Group>
    );
  }
}

export default FunBar;
