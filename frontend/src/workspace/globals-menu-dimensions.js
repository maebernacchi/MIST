import gui from "./mistgui-globals";

import React, { createContext } from "react";

export const menuContext = createContext();

export function MenuContextProvider(props) {

    const totalMenuHeight = props.menuHeight;
    const upperMenuHeight = totalMenuHeight * .75;
    const lowerMenuHeight = totalMenuHeight * .25;

    const valueMargin = props.valueWidth / 5;
    const functionMargin = props.functionWidth / 2;
  
  return (
    <menuContext.Provider
      value={{
        totalMenuHeight: totalMenuHeight,
        upperMenuHeight: upperMenuHeight,
        lowerMenuHeight: lowerMenuHeight,
        valueMargin: valueMargin,
        functionMargin: functionMargin
      }}
    >
      {props.children}
    </menuContext.Provider>
  );
}
