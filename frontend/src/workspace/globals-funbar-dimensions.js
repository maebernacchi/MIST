import {width, height, funBarHeight} from './globals';

const funbarY = height - funBarHeight;

const margin = funBarHeight * 0.2;

const rfTextAreaHeight = funBarHeight - 2 * margin;

const functionButtonX = width * 0.85;
const functionButtonWidth = width * 0.06;
const functionButtonHeight = funBarHeight - 2 * margin;

const imageButtonX = width * 0.92;
const imageButtonWidth = width * 0.06;
const imageButtonHeight = funBarHeight - 2 * margin;

export default {
    funbarY,
    margin,
    rfTextAreaHeight,
    functionButtonX,
    functionButtonWidth,
    functionButtonHeight,
    imageButtonX,
    imageButtonWidth,
    imageButtonHeight
}