import {width, height, funBarHeight} from './globals';

const canvasX = width * 5 / 16;
const canvasY = height / 15;
const canvasWidth = width - 2 * canvasX;
const canvasHeight = height - 2 * canvasY;
const canvasMargin = width / 30;

const textfieldX = canvasX + 2 * canvasMargin;
const textfieldY = canvasY + canvasHeight / 30;
const textfieldWidth = canvasWidth - 4 * canvasMargin;
const textfieldHeight = canvasHeight / 20;

const imageX = canvasX + canvasMargin;
const imageY = canvasY + canvasHeight / 10;
const imageWidth = canvasWidth - 2 * canvasMargin;
const imageHeight = imageWidth;

const rfTextX = canvasX + canvasMargin;
const rfTextY = canvasY + canvasHeight * 8 / 10;
const rfTextWidth = canvasWidth - 2 * canvasMargin;
const rfTextHeight = canvasHeight / 20;

const buttonMargin = canvasWidth / 70;
const buttonOffset = (canvasWidth - 2 * canvasMargin) / 4;
const buttonX = canvasX + canvasMargin; // divide by the number of buttons
const buttonY = canvasY + canvasHeight * 9 / 10;
const buttonWidth = buttonOffset - 2 * buttonMargin;
const buttonHeight = canvasHeight / 20;

export default {
    canvasX,
    canvasY,
    canvasWidth,
    canvasHeight,
    canvasMargin,
    textfieldX,
    textfieldY,
    textfieldWidth,
    textfieldHeight,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    buttonMargin,
    buttonOffset,
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight,
    rfTextX,
    rfTextY,
    rfTextWidth,
    rfTextHeight
}