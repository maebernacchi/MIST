import React, { createContext } from "react";

export const funBarContext = createContext();

export function FunBarDimensions(props) {
  const funbarY = props.height - props.funBarHeight;

  const margin = props.funBarHeight * 0.2;

  const rfTextAreaHeight = props.funBarHeight - 2 * margin;

  const functionButtonX = props.width * 0.85;
  const functionButtonWidth = props.width * 0.06;
  const functionButtonHeight = props.funBarHeight - 2 * margin;

  const imageButtonX = props.width * 0.92;
  const imageButtonWidth = props.width * 0.06;
  const imageButtonHeight = props.funBarHeight - 2 * margin;

  return(
      <funBarContext.Provider
        value={{
            funbarY: funbarY,
            margin: margin,
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
