import React, { createContext } from "react";

export const fontContext = createContext();
// +--------------+--------------------------------------------------
// | FunBar Fonts |
// +--------------+

export function FontGlobals(props) {
  const funBarFontSize = props.width / 75;

  return (
    <fontContext.Provider
      value={{
          funBarFontSize: funBarFontSize
        }}
    >
      {props.children}
    </fontContext.Provider>
  );
}
