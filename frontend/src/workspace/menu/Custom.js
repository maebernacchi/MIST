import React, { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";
import { globalContext } from "../globals/global-context.js";
import { menuContext } from "../globals/globals-menu-dimensions";
import { fontContext } from "../globals/globals-fonts";
import { MIST } from "../mist/mist";

function Custom(props) {
  const global = useContext(globalContext);
  const menuDimensions = useContext(menuContext);
  const fonts = useContext(fontContext);
  const isValueMenuOpen = props.menuTabs.isValueMenuOpen;
  const isFunctionMenuOpen = props.menuTabs.isFunctionMenuOpen;
  const isCustomMenuOpen = props.menuTabs.isCustomMenuOpen;
  const isSavedMenuOpen = props.menuTabs.isSavedMenuOpen;
  const isSettingsMenuOpen = props.menuTabs.isSettingsMenuOpen;
  const [formValue, setFormValue] = useState("Enter a MIST expression");
  const formStyle = useSpring({
    from: {
      position: 'absolute',
      top: menuDimensions.lowerMenuHeight + 20,
      left: isValueMenuOpen
        ? 2 * global.width
        : isFunctionMenuOpen
        ? global.width
        : isCustomMenuOpen
        ? 0
        : -global.width,
    },
    to: {
      position: 'absolute',
      top: menuDimensions.lowerMenuHeight + 20,
      left: isValueMenuOpen
        ? 2 * global.width
        : isFunctionMenuOpen
        ? global.width
        : isCustomMenuOpen
        ? 0
        : -global.width,
    },
  });

  return (
    <div style={{
        position: 'absolute'
    }}>
      <animated.form
        id="form"
        style={formStyle}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          try {
            this.createLayout(MIST.parse(formValue, ""));
          } catch (err) {
            //document.getElementById("input").style.borderColor = "red";
            console.log("invalid function");
          }
          return false;
        }}
      >
        <input
          id={"input"}
          style={{
            width: global.width,
            height: menuDimensions.upperMenuHeight * 0.7,
            backgroundColor: props.bgColor,
            border: "none",
          }}
          id="textbox"
          type="text"
          placeholder={formValue}
          onChange={(e) => {
            setFormValue(e.target.value);
          }}
        />
      </animated.form>
    </div>
  );
}

export default Custom;
