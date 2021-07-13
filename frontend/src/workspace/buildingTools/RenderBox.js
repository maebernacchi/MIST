import MISTImage from "./MISTImage";
import {nodeContext} from "../globals/globals-nodes-dimensions.js";
import { globalContext } from "../globals/global-context";
import React, { useContext } from "react";

function RenderBox(props) {
  const nodeDimensions = useContext(nodeContext);
  const width = useContext(globalContext).width;
  const height = useContext(globalContext).height;
  
  return (
      <MISTImage //Mini image that can be seen at the bottom right of the screen
      x={width*.829}
      y={height-nodeDimensions.renderSideLength-35}
      width={nodeDimensions.renderSideLength}
      height={nodeDimensions.renderSideLength}
      renderFunction={props.renderFunction}
      automated={true}
    />
  );
}

export default RenderBox;
