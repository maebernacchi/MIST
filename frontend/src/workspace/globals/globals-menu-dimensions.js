import React, { createContext } from "react";

export const menuContext = createContext();

export function MenuContextProvider(props) {

    const totalMenuHeight = props.menuHeight;
    const upperMenuHeight = totalMenuHeight * .73;
    const lowerMenuHeight = totalMenuHeight * .27;

    const valueMargin = props.valueWidth / 10;
    const functionMargin = props.functionWidth / 10;
  
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
