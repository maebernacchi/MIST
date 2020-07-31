import React, { createContext } from "react";

export const funBarContext = createContext();

export function FunBarDimensions(props) {
  const funbarY = props.height - props.funBarHeight;

  const margin = props.funBarHeight * 0.1;

  const rfTextAreaWidth = props.width * 0.8;
  const rfTextAreaHeight = rfTextAreaWidth * 0.03;

  const functionButtonX = props.width * 0.85;
  const functionButtonWidth = props.width * 0.06;
  const functionButtonHeight = rfTextAreaWidth * 0.03;

  const imageButtonX = props.width * 0.92;
  const imageButtonWidth = props.width * 0.06;
  const imageButtonHeight = rfTextAreaWidth * 0.03;

  return(
      <funBarContext.Provider
        value={{
            funbarY: funbarY,
            margin: margin,
            rfTextAreaWidth: rfTextAreaWidth,
            rfTextAreaHeight: rfTextAreaHeight,
            functionButtonX: functionButtonX,
            functionButtonWidth: functionButtonWidth,
            functionButtonHeight: functionButtonHeight,
            imageButtonX: imageButtonX,
            imageButtonWidth: imageButtonWidth,
            imageButtonHeight: imageButtonHeight,
        }}
        >
            {props.children}
        </funBarContext.Provider>
  )
}
