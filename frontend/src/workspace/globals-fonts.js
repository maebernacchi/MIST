import React, { createContext } from "react";

export const fontContext = createContext();
// +--------------+--------------------------------------------------
// | FunBar Fonts |
// +--------------+

export function FontGlobals(props) {
  const globalFont = "Arial";
  const menuFont = "Trebuchet MS";
  const funBarFontSize = props.width / 75;
  const menuTabFontSize = props.width * 0.013;
  const functionFontSize = props.functionWidth * 0.36;
  const valueFontSize = props.valueWidth * 0.37;

  return (
    <fontContext.Provider
      value={{
        globalFont: globalFont,
        menuFont: menuFont,
        funBarFontSize: funBarFontSize,
        menuTabFontSize: menuTabFontSize,
        functionFontSize: functionFontSize,
        valueFontSize: valueFontSize,
      }}
    >
      {props.children}
    </fontContext.Provider>
  );
}
