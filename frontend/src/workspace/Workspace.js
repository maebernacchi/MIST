/**
 * The workspace area in MIST.
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
/*
  1. Nodes and lines are saved in arrays of JSONs.

  2. Nodes save the following information:
  - name: String
  - type: String; 'fun' or 'val'
  - x: int
  - y: int
  - renderFunction: {String, boolean}; {renderFunction: String; isRenderable: boolean}
  - lineOut: int[]; array of indices of the lines
  - numInputs: int; number of lines coming into the node
  - numOutlets: int; number of outlets
  - activeOutlets: int[]; each item is a source index if it exists,
    or false if it doesn't have an incoming line

  3. Lines save the following information:
  - sourceIndex: int; index of the source node in the nodes array
  - sinkIndex: int; ndex of the sink node in the nodes array
  - headPosition: {float, float}; coordinates of the end that connects to the source
  - tailPosition: {float, float}; coordinates of the end that connects to the sink
  - outletIndex: int; index of outlet that the line goes into

  4. The indices in redoFromIndices are where re-adjusting the
     render functions need to start from. The render function
     gets updated at each index, and renderFunctionReo gets called
     recursively to do the same for all of the child nodes.

  5. UseStrictMode is a good react-konva practice.

*/
// +-------+
// | Notes |
// +-------+---------------------------------------------------------

// +----------------------------+------------------------------------
// | All dependent files        |
// +----------------------------+

import FunBar from "./FunBar";
import FunNode from "./FunNode";
import colors from "./globals-themes";
import DrawArrow from "./line";
import Menu from "./Menu";
import gui from "./mistgui-globals";
import {
  width,
  height,
  menuHeight,
  funBarHeight,
  functionWidth,
  valueWidth,
} from "./globals.js";
import { MIST } from "./mist.js";
import React, { useState, useEffect } from "react";
import { Stage, Layer, Rect, Group, Text, useStrictMode } from "react-konva";
import ValNode from "./ValNode";
import nodeDimensions from "./globals-nodes-dimensions.js";

// +----------------------------+
// | All dependent files        |
// +----------------------------+------------------------------------

//container for everything related to the create workspace
export default function Workspace(props) {
  useStrictMode(true);

  //example layouts for testing
  let layout1 = new MIST.Layout();

  // +--------+--------------------------------------------------------
  // | States |
  // +--------+

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    console.log("nodes changed");
  }, [nodes]);

  const [lines, setLines] = useState([]);

  useEffect(() => {
    console.log("lines changed");
    for (let i = 0; i < nodes.length; i++) {
      console.log("nodes[i].x:" + nodes[i].x);
    }
  }, [lines]);

  // (indices of) the nodes starting from which the render function should be updated
  const [redoFromIndices, setRedoFromIndices] = useState([]);

  /**
   * Executes only when redoFromIndices is updated
   */
  useEffect(() => {
    // for (let i = 0; i < nodes.length; i++) {
    //   console.log("node name:" + nodes[i].name + " type:" + nodes[i].type);
    // }
    for (let i = 0; i < redoFromIndices.length; i++) {
      findRenderFunction(redoFromIndices[i]);
      // TO-DO: call this only on the branches
      //console.log("nodes[0].renderFunction:" + nodes[0].renderFunction),
      renderFunctionRedo(redoFromIndices[i]);
    }
  }, [redoFromIndices]);

  // index of the node that was double-clicked and has a temporary line coming out of it
  const [newSource, setNewSource] = useState(null);

  // this is necessary for the temporary line to follow the cursor
  const [mouseListenerOn, setMouseListenerOn] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  // { sourceX: nodes[index].x, sourceY: nodes[index].y }
  const [tempLine, setTempLine] = useState(null);

  const [currentNode, setCurrentNode] = useState(null);

  // this isn't neither used yet nor prioritized at the moment
  const [layouts, setLayouts] = useState([layout1]);

  // list of theme names
  const themes = ["classic", "dusk", "dark"];

  // index of the themes list that is taking effect
  const [themeIndex, setThemeIndex] = useState(1);

  // name of the current theme -- TODO: probably redundant
  const [theme, setTheme] = useState("dusk");

  // the value 72 is kind of a temporary fix, but it seems to be fine??
  const offsetY = 72;
  const offsetX = 0;

  // there's a rectangle at the bottom of the workspace with this height.
  const footerHeight = 95;

  // +--------+
  // | States |
  // +--------+--------------------------------------------------------

  // +------------------------+----------------------------------------
  // | Adding Nodes and Lines |
  // +------------------------+

  useEffect(() => {
    //createLayout("sum(x, y)");
    pushNode("val", "x", 200, 200);
    //pushNode("val", "x", 200, 350);
    //pushNode("val", "x", 350, 200);
    //pushNode("val", "x", 350, 350);
    // pushNode('fun', 'add', 200, 200);
    // pushNode('fun', 'add', 200, 350);
    // pushNode('fun', 'add', 350, 200);
    // pushNode('fun', 'add', 350, 350);
  }, []);

  function createLayout(expression) {
    let newNodes = [...nodes];
    let newLines = [...lines];
    let redoIndices = [];

    const sink = newNodes.length;

    if (expression.class === "MIST.App") {
      const name = gui.repToFun[expression.operation];
      const outermost = {
        // Creating a new node
        name: name,
        type: "fun",
        x: Math.random() * (0.8 * width),
        y:
          gui.menuHeight +
          Math.random() * (height - menuHeight - 2 * funBarHeight),
        renderFunction: { renderFunction: "", isRenderable: false },
        lineOut: [],
        numInputs: 0,
        numOutlets: gui.functions[gui.repToFun[expression.operation]].min,
        activeOutlets: Array(
          gui.functions[gui.repToFun[expression.operation]].min
        ).fill(false),
        parentNodes: [],
      };
      newNodes.push(outermost);
      console.log("pushed operation " + outermost.name);
      evalFrom(sink, expression.operands);
    } else {
      // it's a value
      if (gui.values[expression.name] == undefined) {
        return Error();
      }
      const val = {
        name: expression.name,
        type: "val",
        x: Math.random() * (0.8 * width),
        y:
          menuHeight + Math.random() * (height - menuHeight - 2 * funBarHeight),
        renderFunction: { renderFunction: expression.code, isRenderable: true },
        lineOut: [],
        numInputs: null,
        numOutlets: null,
        activeOutlets: null,
        parentNodes: null,
      };
      newNodes.push(val);
    }

    function evalFrom(sinkIndex, operands) {
      if (
        gui.functions[newNodes[sinkIndex].name].color === gui.functionMultColor
      ) {
        if (
          operands.length < gui.functions[newNodes[sinkIndex].name].min ||
          operands.length > gui.functions[newNodes[sinkIndex].name].max
        ) {
          return Error(
            newNodes[sinkIndex].name +
              " must contain between " +
              gui.functions[newNodes[sinkIndex].name].min +
              " and " +
              gui.functions[newNodes[sinkIndex].name].max +
              " parameters"
          );
        }
      } else {
        if (operands.length !== gui.functions[newNodes[sinkIndex].name].min) {
          return Error(
            nodes[sinkIndex].name +
              " must contain " +
              gui.functions[nodes[sinkIndex].name].min +
              " parameters"
          );
        }
      }
      for (let i = 0; i < operands.length; i++) {
        let sourceIndex = newNodes.length;
        let lineIndex = newLines.length;
        // checking if the operand is a function
        if (operands[i].class === "MIST.App") {
          const sourceNode = {
            // Creating a new node
            name: gui.repToFun[operands[i].operation],
            type: "fun",
            x: Math.random() * (0.8 * window.innerWidth),
            y:
              menuHeight +
              Math.random() * (height - menuHeight - 2 * funBarHeight),
            renderFunction: { renderFunction: "", isRenderable: false },
            lineOut: [],
            numInputs: 0,
            numOutlets: gui.functions[gui.repToFun[operands[i].operation]].min,
            activeOutlets: Array(
              gui.functions[gui.repToFun[operands[i].operation]].min
            ).fill(false),
            parentNodes: [],
          };
          newNodes.push(sourceNode);
          newLines.push({
            sourceIndex: sourceIndex,
            sinkIndex: sinkIndex,
            outletIndex: i,
          });
          // setting all the dependent node values after pushing a new line
          newNodes[sourceIndex].lineOut.push(lineIndex); //add line to lineOut array of source node
          newNodes[sinkIndex].numInputs += 1; // updating the number of inputs for sink node
          if (
            newNodes[sinkIndex].numInputs >= newNodes[sinkIndex].numOutlets &&
            gui.functions[newNodes[sinkIndex].name].color ===
              gui.functionMultColor
          ) {
            // Adding a new outlet once existing outlets are used
            newNodes[sinkIndex].numOutlets += 1;
            newNodes[sinkIndex].activeOutlets.push(false);
          }
          newNodes[sinkIndex].activeOutlets[i] = lineIndex;
          evalFrom(sourceIndex, operands[i].operands);
        } else {
          // value
          if (gui.values[operands[i].name] == undefined) {
            return Error();
          }
          const sourceNode = {
            name: operands[i].name,
            type: "val",
            x: Math.random() * (0.8 * width),
            y:
              menuHeight +
              Math.random() * (height - menuHeight - 2 * funBarHeight),
            renderFunction: {
              renderFunction: operands[i].code,
              isRenderable: true,
            },
            lineOut: [],
            numInputs: null,
            numOutlets: null,
            activeOutlets: null,
            parentNodes: null,
          };
          newNodes.push(sourceNode);
          newLines.push({
            sourceIndex: sourceIndex,
            sinkIndex: sinkIndex,
            outletIndex: i,
          });
          // setting all the dependent node values after pushing a new line
          newNodes[sourceIndex].lineOut.push(lineIndex); //add line to lineOut array of source node
          newNodes[sinkIndex].numInputs += 1; // updating the number of inputs for sink node
          if (
            newNodes[sinkIndex].numInputs >= newNodes[sinkIndex].numOutlets &&
            gui.functions[newNodes[sinkIndex].name].color ===
              gui.functionMultColor
          ) {
            // Adding a new outlet once existing outlets are used
            newNodes[sinkIndex].numOutlets += 1;
            newNodes[sinkIndex].activeOutlets.push(false);
          }
          newNodes[sinkIndex].activeOutlets[i] = lineIndex;
        }
        redoIndices.push(sinkIndex);
      }
    }

    setNodes(newNodes);
    setLines(newLines);
    setRedoFromIndices(redoIndices);
  }
  /**
   * Adds a node to the node array
   * @param {String} type
   * @param {String} name
   * @param {float} x
   * @param {float} y
   */

  function pushNode(type, name, x, y) {
    const newIndex = nodes.length;
    let rf = {};
    switch (type) {
      case "fun":
        rf = { renderFunction: "", isRenderable: false };
        break;
      case "val":
        rf = { renderFunction: gui.values[name].rep, isRenderable: true };
        break;
      default:
        console.log("Error: neither a function or a value node.");
        break;
    }
    const node = {
      // Creating a new node
      name: name,
      type: type,
      x: x,
      y: y,
      renderFunction: rf,
      lineOut: [],
      numInputs: 0,
      numOutlets: type === "fun" ? gui.functions[name].min : 0,
      activeOutlets:
        type === "fun"
          ? // e.g. if the function is 'add', this will be [false, false]
            Array(gui.functions[name].min).fill(false)
          : null,
      parentNodes: [],
    };
    setNodes((nodes) => [...nodes, node]);
  }

  /**
   * Pushes a new line to 'lines'. Updates information for the sink node.
   * @param {int} source
   * @param {int} sink
   */
  function pushLine(source, sink, outletIndex) {
    // preventing infinite loops
    if (!nodes[source].parentNodes.includes(sink)) {
      let newLines = [...lines];
      let lineIndex = newLines.length; // index of the new line about to be pushed

      newLines.push({
        sourceIndex: source,
        sinkIndex: sink,
        headPosition: {
          x: nodes[source].x + functionWidth / 2,
          y: nodes[source].y + functionWidth / 2,
        },
        tailPosition: {
          x: nodes[sink].x - nodeDimensions.outletXOffset * 2,
          y:
            nodes[sink].y +
            nodeDimensions.outletStartY +
            outletIndex * nodeDimensions.outletYOffset,
        },
        outletIndex: outletIndex, // index of the outlet that the line is sinking into
      });
      let newNodes = [...nodes];
      newNodes[source].lineOut.push(lineIndex); //add line to lineOut array of source node
      newNodes[sink].numInputs += 1; // updating the number of inputs for sink node
      if (
        newNodes[sink].numInputs >= newNodes[sink].numOutlets &&
        gui.functions[newNodes[sink].name].color === gui.functionMultColor
      ) {
        // Adding a new outlet once existing outlets are used
        newNodes[sink].numOutlets += 1;
        newNodes[sink].activeOutlets.push(false);
      }
      newNodes[sink].activeOutlets[outletIndex] = lineIndex;
      setNodes(newNodes);
      setLines(newLines);
      setRedoFromIndices([sink]);
    }
  }

  // +------------------------+
  // | Adding Nodes and Lines |
  // +------------------------+----------------------------------------

  // +------------------------+----------------------------------------
  // | Updating Node Position |
  // +------------------------+

  /**
   * Updates the position of a node
   * @param {int} index
   * @param {float} x
   * @param {float} y
   */
  function updateNodePosition(index, x, y) {
    let newLst = [...nodes];
    newLst[index].x = x;
    newLst[index].y = y;
    setNodes(newLst);
  }

  function updateLinePosition(nodeIndex, end, x, y) {
    console.log(
      "updateLinePosition " +
        nodes[nodeIndex].numInputs +
        " " +
        nodes[nodeIndex].lineOut.length
    );
    if (nodes[nodeIndex].numInputs > 0 || nodes[nodeIndex].lineOut.length > 0) {
      let newLines = [...lines];
      // updating line position for all the incoming lines
      for (let i = 0; i < nodes[nodeIndex].numOutlets; i++) {
        if (typeof nodes[nodeIndex].activeOutlets[i] === 'number') {
          let lineIndex = nodes[nodeIndex].activeOutlets[i];
          let line = newLines[lineIndex];
          newLines[lineIndex].tailPosition = {
            x: x - nodeDimensions.outletXOffset * 2,
            y:
              y +
              nodeDimensions.outletStartY +
              line.outletIndex * nodeDimensions.outletYOffset,
          };
        }
      }
      // updating line position for all the outgoing lines
      for (let i = 0; i < nodes[nodeIndex].lineOut.length; i++) {
        if (typeof nodes[nodeIndex].lineOut[i] === 'number') {
          let lineIndex = nodes[nodeIndex].lineOut[i];
          newLines[lineIndex].headPosition = {
            x: x + functionWidth / 2,
            y: y + functionWidth / 2,
          };
        }
      }
      setLines(newLines);
    }
  }

  // +------------------------+
  // | Updating Node Position |
  // +------------------------+----------------------------------------

  // +--------------------------+--------------------------------------
  // | Removing Nodes and Lines |
  // +--------------------------+

  /**
   * Resets the nodes and lines to reflect the deletion of a node at index
   * @param {index} index
   */
  function removeNode(index) {
    let newNodes = [...nodes];
    let newLines = [...lines];
    const node = nodes[index];
    // update info for the incoming lines
    if (node.type === "fun") {
      // updates lines and nodes according to the lines coming out of the node
      for (let i = 0; i < node.activeOutlets.length; i++) {
        const lineIndex = node.activeOutlets[i];
        if (typeof lineIndex === "number") {
          const source = newNodes[newLines[lineIndex].sourceIndex];
          // finds and sets the line to false
          newNodes[
            newLines[lineIndex].sourceIndex // gets the source index of the line
          ].lineOut[source.lineOut.indexOf(lineIndex)] = false; // gets the source node of the line // gets the index of the line within the source node's lineIndex array
          newLines[lineIndex] = false;
        }
      }
    }
    // all the nodes that get directly affected by deleting the node
    let newRedoIndices = [];
    // update info for the outgoing lines and sink nodes
    for (let i = 0; i < node.lineOut.length; i++) {
      const lineIndex = node.lineOut[i];
      if (typeof lineIndex === "number") {
        const sinkIndex = newLines[lineIndex].sinkIndex;
        const outletIndex = newLines[lineIndex].outletIndex;
        newNodes[sinkIndex].activeOutlets[outletIndex] = false; // updates status of the sink node
        newNodes[sinkIndex].numInputs -= 1; // updates sink node's number of inputs
        let numOutlets = newNodes[sinkIndex].numOutlets;
        // deleting extra outlets at the bottom
        let j = numOutlets - 1;
        while (
          j >= gui.functions[newNodes[sinkIndex].name].min &&
          !newNodes[sinkIndex].activeOutlets[j]
        ) {
          console.log("j:" + j);
          newNodes[sinkIndex].activeOutlets.pop();
          newNodes[sinkIndex].numOutlets--;
          j--;
        }
        newRedoIndices.push(sinkIndex);
        newLines[lineIndex] = false; // removes the line
      }
    }
    newNodes[index] = false;
    setNodes(newNodes);
    setLines(newLines);
    setRedoFromIndices(newRedoIndices);
  } // removeNode

  /**
   * Resets the nodes and lines to reflect the deletion of a line at index
   * @param {int} index
   */
  function removeLine(index) {
    const sourceIndex = lines[index].sourceIndex;
    const sinkIndex = lines[index].sinkIndex;
    const outletIndex = lines[index].outletIndex;
    let newNodes = [...nodes];
    newNodes[sourceIndex].lineOut[
      // index of the removed line in the source node's lineOut array
      newNodes[sourceIndex].lineOut.indexOf(index)
    ] = false;
    newNodes[sinkIndex].activeOutlets[outletIndex] = false; // updates the sink node's outlet status
    newNodes[sinkIndex].numInputs -= 1;
    let numOutlets = newNodes[sinkIndex].numOutlets;
    let j = numOutlets - 1;
    while (
      j >= gui.functions[newNodes[sinkIndex].name].min &&
      !newNodes[sinkIndex].activeOutlets[j] &&
      newNodes[sinkIndex].numInputs + 1 < newNodes[sinkIndex].numOutlets
    ) {
      console.log("j:" + j);
      newNodes[sinkIndex].activeOutlets.pop();
      newNodes[sinkIndex].numOutlets--;
      j--;
    }
    let newLines = [...lines];
    newLines[index] = false;
    setNodes(newNodes);
    setLines(newLines);
    setRedoFromIndices([sinkIndex]);
  }

  // +--------------------------+
  // | Removing Nodes and Lines |
  // +--------------------------+--------------------------------------

  // +-------------------------------+---------------------------------
  // | Updating the Render Functions |
  // +-------------------------------+

  /**
   * Updates the render function of the node at index as well as all the nodes that branch out of it
   * @param {int} index
   */
  function renderFunctionRedo(index) {
    console.log("renderFunctionRedo");
    let newNodes = [...nodes];

    let node = nodes[index];
    let rf = "";
    let isRenderable = true;
    let lineCount = 0;
    let parentNodes = [];
    // getting the render function from each outlet (w/o going deeper into the tree)
    for (let i = 0; i < node.activeOutlets.length; i++) {
      const lineIndex = node.activeOutlets[i];
      if (typeof lineIndex === "number") {
        lineCount++;
        let sourceIndex = lines[lineIndex].sourceIndex;
        let sourceNode = nodes[sourceIndex];
        // update parentNodes
        if (sourceNode.type === "fun") {
          parentNodes.push(sourceIndex);
          parentNodes.push(...sourceNode.parentNodes);
        }
        rf += sourceNode.renderFunction.renderFunction;
        rf += ",";
        // checks if any of the child node's render function is invalid;
        // if so, sets isRenderable to false
        if (!sourceNode.renderFunction.isRenderable) {
          isRenderable = false;
        }
      }
    }
    // runs if the minimum number of inputs isn't met
    for (
      let i = 0;
      i < Math.max(0, gui.functions[node.name].min - lineCount);
      i++
    ) {
      rf += "__,";
      // missing information means the function isn't renderable
      isRenderable = false;
    }
    if (rf !== "") {
      rf = rf.substring(0, rf.length - 1);
      // puts the function's name and parentheses around the parameters
      rf = gui.functions[node.name].prefix + "(" + rf + ")";
    }

    newNodes[index].renderFunction = {
      renderFunction: rf,
      isRenderable: isRenderable,
    };
    newNodes[index].parentNodes = parentNodes;

    /*for(let j = 0; j < newNodes.length; j++) {
      console.log("hello");
      for (let i = 0; i < newNodes[j].parentNodes.length; i++) {
        console.log(
          "parentNode for " +
          newNodes[j].name +
            ": " +
            newNodes[j].parentNodes[i]
        );
      }
    }*/

    setNodes(newNodes);
    // goes through all of the lines coming out of the current node
    for (let i = 0; i < node.lineOut.length; i++) {
      const lineIndex = node.lineOut[i];
      if (typeof lineIndex === "number") {
        // recursively calls this function on its children (?) nodes
        renderFunctionRedo(lines[lineIndex].sinkIndex);
      }
    }
  }

  /**
   * Finds and sets the render function of the node of given index.
   * @param {int} index
   */
  function findRenderFunction(index) {
    const node = nodes[index];
    if (node.type === "val") {
      return node.renderFunction;
    }
    let rf = "";
    let isRenderable = node.renderFunction.isRenderable;
    // checking all the incoming lines
    let lineCount = 0;
    for (let i = 0; i < node.activeOutlets.length; i++) {
      const lineIndex = node.activeOutlets[i];
      if (typeof lineIndex === "number") {
        lineCount++;
        rf += findRenderFunction(lines[lineIndex].sourceIndex).renderFunction;
        rf += ",";
      }
    }
    // runs if the minimum number of inputs isn't met
    for (
      let i = 0;
      i < Math.max(0, gui.functions[node.name].min - lineCount);
      i++
    ) {
      rf += "__,";
      // missing information means the function isn't renderable
      isRenderable = false;
    }
    if (rf !== "") {
      rf = rf.substring(0, rf.length - 1);
    }
    if (node.type === "fun" && rf !== "") {
      // prevent parentheses with nothing in them
      rf = gui.functions[node.name].prefix + "(" + rf + ")";
    }
    let newNodes = [...nodes];
    newNodes[index].renderFunction = {
      renderFunction: rf,
      isRenderable: isRenderable,
    };

    setNodes(newNodes);
    console.log(
      "node index:" + index + " rf:" + rf + " isRenderable: " + isRenderable
    );
    return { renderFunction: rf, isRenderable: isRenderable };
  }

  // +-------------------------------+
  // | Updating the Render Functions |
  // +-------------------------------+---------------------------------

  // +------------------------+----------------------------------------
  // | Updating the Workspace |
  // +------------------------+

  /**
   * Clears all nodes and lines
   */
  function clearWorkspace() {
    setNodes([]);
    setLines([]);
  }

  // +------------------------+
  // | Updating the Workspace |
  // +------------------------+----------------------------------------

  // +----------------------+------------------------------------------
  // | Mouse Event Handlers |
  // +----------------------+

  function updateMousePosition(x, y) {
    console.log("updateMousePosition");
    setMousePosition({ x: x, y: y });
  }

  /**
   * When a function node gets clicked, its render function gets displayed in FunBar.
   * @param {int} index
   */
  function funClicked(index) {
    setCurrentNode(index);
    // for (let i = 0; i < nodes[index].parentNodes.length; i++) {
    //   console.log(
    //     "parentNode for " +
    //       nodes[index].name +
    //       ": " +
    //       nodes[index].parentNodes[i]
    //   );
    // }
  }

  /**
   * When a value node gets clicked, its name gets displayed in FunBar.
   * @param {int} index
   */
  function valClicked(index) {
    setCurrentNode(index);
  }

  /**
   * If the connection is valid, clicking the outlet pushes a new line
   * @param {*} sinkIndex
   * @param {*} outletIndex
   */
  function outletClicked(sinkIndex, outletIndex) {
    if (
      newSource !== null &&
      newSource !== sinkIndex &&
      nodes[sinkIndex].activeOutlets[outletIndex] === false &&
      nodes[sinkIndex].numInputs < gui.functions[nodes[sinkIndex].name].max
    ) {
      // a line coming out of source
      pushLine(newSource, sinkIndex, outletIndex);
    }
  }

  /**
   * Called when the background is clicked.
   */
  function bgClicked(e) {
    setNewSource(null);
    setTempLine(null);
    setMouseListenerOn(false);
  }

  /**
   * When a node is double-clicked, a line comes out of it with the end on the cursor
   * @param {int} index
   */
  function dblClicked(index) {
    if (!tempLine && nodes[index].name !== "rgb") {
      setNewSource(index);
      setMouseListenerOn(true);
      setMousePosition({
        x: nodes[index].x + gui.functionRectSideLength / 2,
        y: nodes[index].y + gui.functionRectSideLength / 2,
      });
      setTempLine({ sourceX: nodes[index].x, sourceY: nodes[index].y });
    }
  }

  // +----------------------+
  // | Mouse Event Handlers |
  // +----------------------+------------------------------------------

  // +--------+--------------------------------------------------------
  // | RENDER |
  // +--------+

  return (
    <div id="workspace">
      <Stage
        width={width}
        height={height + footerHeight}
        onClick={bgClicked}
        onMouseMove={(e) => {
          if (mouseListenerOn) {
            updateMousePosition(
              e.evt.clientX -
                document.getElementById("workspace").getBoundingClientRect().x,
              e.evt.clientY -
                document.getElementById("workspace").getBoundingClientRect().y
            );
          }
        }}
      >
        <Layer>
          <Rect
            y={gui.menuHeight}
            width={width}
            height={height - menuHeight}
            fill={colors.workspaceBackground[theme]}
          />
          {tempLine && (
            <DrawArrow
              sourceX={tempLine.sourceX + functionWidth / 2}
              sourceY={tempLine.sourceY + functionWidth / 2}
              sinkX={mousePosition.x}
              sinkY={mousePosition.y}
              fill={colors.lineFill[theme]}
            />
          )}
        </Layer>
        <Layer>
          {nodes.length !== 0 &&
            lines.map(
              (line, index) =>
                line && (
                  <DrawArrow
                    index={index}
                    sourceX={line.headPosition.x}
                    sourceY={line.headPosition.y}
                    sinkX={line.tailPosition.x}
                    sinkY={line.tailPosition.y}
                    removeLine={removeLine}
                    fill={colors.lineFill[theme]}
                    hoverShadowColor={colors.nodeHoverShadow[theme]}
                  />
                )
            )}
        </Layer>
        <Layer>
          {console.log("node layer")}
          {nodes.map(
            (node, index) =>
              (node && node.type === "fun" && (
                <FunNode
                  name={node.name}
                  key={index} // just to silence a warning message
                  index={index}
                  x={node.x}
                  y={node.y}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  numInputs={node.numInputs}
                  numOutlets={node.numOutlets}
                  renderFunction={
                    node.renderFunction.isRenderable
                      ? node.renderFunction.renderFunction
                      : false
                  }
                  updateNodePosition={updateNodePosition}
                  updateLinePosition={updateLinePosition}
                  funClicked={funClicked}
                  outletClicked={outletClicked}
                  dblClickHandler={dblClicked}
                  removeNode={removeNode}
                  hoverShadowColor={colors.nodeHoverShadow[theme]}
                />
              )) ||
              (node && node.type === "val" && (
                <ValNode
                  name={node.name}
                  key={index}
                  index={index}
                  x={node.x}
                  y={node.y}
                  offsetX={offsetX}
                  offsetY={offsetY}
                  renderFunction={
                    node.renderFunction.isRenderable
                      ? node.renderFunction.renderFunction
                      : false
                  }
                  updateNodePosition={updateNodePosition}
                  updateLinePosition={updateLinePosition}
                  clickHandler={valClicked}
                  dblClickHandler={dblClicked}
                  removeNode={removeNode}
                />
              ))
          )}
        </Layer>
        <Layer>
          {console.log("menu layer")}
          {
            <Menu
              addNode={pushNode}
              addLine={pushLine}
              clearWorkspace={clearWorkspace}
              createLayout={createLayout}
              bgColor={colors.menuBackground[theme]}
              wsButtonColor={colors.workspaceButton[theme]}
              valueMenuColor={
                (theme === "classic" && colors.valueMenuColor1) ||
                (theme === "dusk" && colors.valueMenuColor2) ||
                (theme === "dark" && colors.valueMenuColor3)
              }
              top={offsetY}
              left={offsetX}
            />
          }
        </Layer>
        <Layer>
          <FunBar
            renderFunction={
              currentNode !== null && nodes[currentNode]
                ? nodes[currentNode].renderFunction
                : { renderFunction: "", isRenderable: false }
            }
            bg={colors.funBarBackground[theme]}
            onClick={() => {
              let i = (themeIndex + 1) % themes.length;
              setThemeIndex(i);
              setTheme(themes[i]);
            }}
            functionBoxBg={theme === "dark" ? "darkgray" : "white"}
            functionTextColor={theme === "dark" ? "black" : "black"}
            top={offsetY}
            left={offsetX}
          />
          <Text
            x={10}
            y={130}
            width={200}
            height={50}
            text={"CHANGE THEME"}
            fill={theme === "dark" ? "white" : "black"}
            fontSize={14}
            onClick={() => {
              let i = (themeIndex + 1) % themes.length;
              setThemeIndex(i);
              setTheme(themes[i]);
            }}
          />
          <Rect
            x={0}
            y={height}
            width={width}
            height={footerHeight}
            fill={"pink"}
          />
        </Layer>
      </Stage>
    </div>
  );
}
