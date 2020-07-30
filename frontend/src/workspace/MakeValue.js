/**
 * This file creates the Value Nodes for the Menu bar.
 *
 * MIST is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// +-------+---------------------------------------------------------
// | Notes |
// +-------+
/*  1. The parameters required are as follows: 
    - addNode : function; Calls the pushNode in the index.js once node has been dropped in 
                the workspace
    - valName : String; Name of the value node
    - x : int; x coordinate
    - y : int; y coordinate 
    - vis : boolean; condition to either display or not display the function nodes on the menu bar
    - index : int; index of the node
    - changeKey : function; This gets called from MakeFunctions and MakeValues to change the group's
                  key to trigger a re-render (so that the node goes back to the right place
                  if it's drag-and-dropped into the menu, not the workspace) 

    2. React-Spring is the library used to create animations for the on hover attribute in the 
      menu bar for functions. 

    3. The dragBoundFunc attribute on the group helps keep the function node within the 
      boundaries of the workspace. 
  

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import React, { useContext } from "react";
import { Group } from "react-konva";
import Konva from "konva";
import gui from "./mistgui-globals";
import { Spring, animated } from "react-spring/renderprops-konva";
import nodeDimensions from "./globals-nodes-dimensions.js";
import { globalContext } from "./global-context.js";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

// +----------------------------------------+------------------------
// | Entire Value Group                     |
// +----------------------------------------+

function ValGroup(props) {

  const global = useContext(globalContext);
  const valName = props.valName;

  return (
    <Group
      name={valName}
      key={props.index}
      x={props.x}
      y={props.y}
      draggable
      onDragStart={(e) => {
        e.target.setAttrs({
          duration: 0.5,
          shadowBlur: 6,
          scaleX: 1.1,
          scaleY: 1.1,
        });
      }}
      onDragEnd={(e) => {
        e.target.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          scaleX: 1,
          scaleY: 1,
        });
        if (e.currentTarget.y() > global.menuHeight) {
          //setTimeout(function () {
            props.addNode("val", valName, e.target._lastPos.x, e.target._lastPos.y);
            props.changeKey();
          //}, 200);
        } else {
          props.changeKey();
        }
      }}
      dragBoundFunc={function (pos) {
        if (pos.x < 0) {
          pos.x = 0;
        }
        if (pos.x > global.width - nodeDimensions.valueWidth) {
          pos.x = global.width - nodeDimensions.valueWidth;
        }
        if (pos.y < 0) {
          pos.y = 0;
        }
        if (pos.y > global.height - global.funBarHeight - nodeDimensions.valueWidth) {
          pos.y = global.height - global.funBarHeight - nodeDimensions.valueWidth;
        }
        return pos;
      }}
    >
      <Spring
        native
        from={{
          x: props.tabs.isValueMenuOpen ? 0 + nodeDimensions.valueOffset :
            props.tabs.isFunctionMenuOpen ? - global.width + nodeDimensions.valueOffset :
            props.tabs.isCustomMenuOpen ? - 2 * global.width + nodeDimensions.valueOffset :
            - 3 * global.width + nodeDimensions.valueOffset}}
        to={{
          x: props.tabs.isValueMenuOpen ? 0 + nodeDimensions.valueOffset :
            props.tabs.isFunctionMenuOpen ? - global.width + nodeDimensions.valueOffset :
            props.tabs.isCustomMenuOpen ? - 2 * global.width + nodeDimensions.valueOffset :
            - 3 * global.width + nodeDimensions.valueOffset}}
      >
        {(props) => (
          <animated.Rect
            {...props}
            y={0}
            width={nodeDimensions.valueSideLength}
            height={nodeDimensions.valueSideLength}
            fill={gui.values[valName].color}
            cornerRadius={10}
            rotation={45}
          />
        )}
      </Spring>
      <Spring
        native
        from={{
          x: props.tabs.isValueMenuOpen ? 0 :
            props.tabs.isFunctionMenuOpen ? - global.width :
            props.tabs.isCustomMenuOpen ? - 2 * global.width :
            - 3 * global.width}}
        to={{
          x: props.tabs.isValueMenuOpen ? 0 :
            props.tabs.isFunctionMenuOpen ? - global.width :
            props.tabs.isCustomMenuOpen ? - 2 * global.width :
            - 3 * global.width}}
      >
        {(props) => (
          <animated.Text
            {...props}
            text={gui.values[valName].rep}
            fontFamily={gui.globalFont}
            fontSize={gui.nodeFontSize}
            fill={"black"}
            y={0}
            width={nodeDimensions.valueWidth}
            height={nodeDimensions.valueWidth}
            align={"center"}
            verticalAlign={"middle"}
          />
        )}
      </Spring>
    </Group>
  );
  // +----------------------------------------+
  // | Entire Value Group                     |
  // +----------------------------------------+----------------------
};

export default ValGroup