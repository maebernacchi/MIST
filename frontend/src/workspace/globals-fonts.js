import React, { createContext } from "react";

export const fontContext = createContext();
// +--------------+--------------------------------------------------
// | FunBar Fonts |
// +--------------+

export function FontGlobals(props) {
  const funBarFontSize = props.width / 75;
  const menuTabFontSize = props.width / 60;

  return (
    <fontContext.Provider
      value={{
          funBarFontSize: funBarFontSize,
          menuTabFontSize: menuTabFontSize,
        }}
    >
      {props.children}
    </fontContext.Provider>
  );
}
