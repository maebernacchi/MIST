import { width, functionWidth, valueWidth } from "./globals";

// +----------------+------------------------------------------------
// | Function Nodes |
// +----------------+

const functionTrashX = functionWidth * 4 / 5;

const functionTrashY = - functionWidth * 1 / 20;

// Horizontal offset of an outlet
const outletXOffset = functionWidth / 20;

// Vertical space between outlets
const outletYOffset = functionWidth / 4;

// Offset of the first outlet in relation to a node group
const outletStartY = (functionWidth - 2 * outletYOffset) / 2;

// Offset of the image render box in relation to the function group (Konva <Group/>).
const functionImageBoxOffset = functionWidth * 6 / 7;

// +-------------+---------------------------------------------------
// | Value Nodes |
// +-------------+

const valueOffset = valueWidth / 2;

const valueSideLength = valueOffset * 1.414; // 1.414 === √2

const valueTrashX = valueWidth * 1 / 6;

const valueTrashY = valueWidth * 1 / 7;

// Offset of the image render box in relation to the value group.
const valueImageBoxOffset = valueWidth * 2 / 3;

// +-----------+-----------------------------------------------------
// | All Nodes |
// +-----------+

// side length of the image render box when not expanded
const imageBoxSideLength = width / 80;

// side length of the image render box when expanded
const renderSideLength = width / 18;

// +---------+-------------------------------------------------------
// | Exports |
// +---------+

export default {
  // function nodes
  functionWidth,
  functionTrashX,
  functionTrashY,
  functionImageBoxOffset,
  // value nodes
  valueSideLength,
  valueOffset,
  valueWidth,
  valueTrashX,
  valueTrashY,
  valueImageBoxOffset,
  // all nodes
  imageBoxSideLength,
  renderSideLength,
  outletXOffset,
  outletYOffset,
  outletStartY,
};
