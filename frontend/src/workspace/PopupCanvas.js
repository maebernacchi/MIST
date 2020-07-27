import React, { useState } from "react";
import Portal from "./Portal";
import { Rect, Group, Text } from "react-konva";
import gui from "./mistgui-globals.js";
import MISTImage from "./MISTImageCreate";
import "../styleSheets/FunBar.css";


function PopupCanvas(props) {

    const [imageName, setImageName] = useState("");

    return (
        <Portal>
            <Background {...props} />
            <PortalImage {...props} />
            <PortalFunction {...props} />
            <PortalTextBox {...props} setImageName={setImageName} />
            <PortalButtons {...props} imageName={imageName} />
        </Portal>
    );
}

function Background(props) {
    return (
        <Group>
            <div // div makes workspace background dark
                style={{
                    position: "absolute",
                    top: props.top,
                    left: props.left,
                    width: gui.width,
                    height: gui.height,
                    backgroundColor: "black",
                    opacity: 0.7,
                }}
            />
            <div // white rounded square background
                style={{
                    position: "absolute",
                    top: props.top + 0.5 * gui.popSaveGroupY,
                    left: props.left + gui.popSaveGroupX,
                    width: gui.popRectWidth,
                    height: gui.popRectHeight,
                    borderRadius: 25,
                    backgroundColor: gui.popRectColor,
                }}
            />
        </Group>
    );
}

function PortalImage(props) {

    return (
        <MISTImage
            x={props.left + gui.popCanvasShiftX}
            y={props.top + gui.popCanvasShiftY}
            width={gui.popCanvasSide}
            height={gui.popCanvasSide}
            renderFunction={props.renderFunction.renderFunction}
            automated={true}
        />
    );
}

function PortalFunction(props) {
    return (
        <div // Displays render function
            style={{
                position: "absolute",
                top: props.top + gui.popTextShiftY,
                left: props.left + gui.popSaveGroupX + gui.popTextShiftX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                textAlign: "center",
                verticalAlign: "middle",
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                overflow: "auto",
            }}
        >
            <p>{props.renderFunction.renderFunction}</p>
        </div>
    );
}


function PortalTextBox(props) {
    return (
        <div // Text box: "Enter Name of Image"
            style={{
                position: "absolute",
                top: props.top + 0.8 * gui.popSaveGroupY,
                left: props.left + gui.popTextShiftX + gui.popSaveGroupX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                textAlign: "center",
            }}
        >
            <form>
                <input
                    type={"text"}
                    placeholder={"Enter Name Of Image"}
                    style={{
                        width: 0.7 * gui.popTextWidth,
                        height: 0.7 * gui.popTextHeight,
                        border: "2px solid #008CBA",
                    }}
                    onChange={e => props.setImageName(e.target.value)}
                />
            </form>
        </div>
    );
}

function PortalButtons(props) {
    return (
        <div
            style={{
                position: "absolute",
                top: props.top + gui.popSaveGroupY + gui.popCanvasSide + gui.popTextHeight * 2,
                left: props.left + gui.popTextShiftX + gui.popSaveGroupX,
                fontSize: gui.popTextFontSize,
                fontFamily: gui.functionFont,
                width: gui.popTextWidth,
                height: gui.popTextHeight,
                textAlign: "center",
            }}
        >
            {["Cancel", "Download"].map((u, i) => {
                return (
                    <button
                        class="button button2"
                        onClick={() => {
                            if (u === "Cancel") {
                                props.closePortal();
                            }
                        }}
                    >
                        {u}
                    </button>
                );
            })}
            <SaveButton {...props} />
        </div>
    );
}

function SaveButton(props) {

    const [imageExists, setImageExists] = useState("initial");

    function SaveImage() {
        //var newName = props.imageName;
        //newName = removeOuterWhiteSpace(newName);
        //var response = getImageExists(newName);
        console.log("response = " + imageExists);
    }

    function getImageExists(title) {
        let url = 'api/?action=imageexists&title=' + title;
        fetch(url)
          .then(req => req.json())
          .then(exists => setImageExists(exists));
    }

    return (
        <Group
            class="button button2"
            onClick={() => SaveImage()}
        >
            <Rect
                x={0}
                y={0}
                fill={'#A0A3A3'}
                stroke={'black'}
                strokeWidth={1}
                shadowColor={'black'}
                shadowEnabled={false}
            >
                <Text x={0} fill={'black'} fontSize={16}>
                    Save
            </Text>
            </Rect>
        </Group>
    );
}

/**
* removeOuterWhiteSpace takes a string and removes white space at the beginning and end
* of the string, but not the white space in the middle of the string.
* returns a string
*/
var removeOuterWhiteSpace = function (string) {
    string = string.replace(/^ */, "");
    string = string.replace(/ *$/, "");
    return string;
}; 

export default PopupCanvas  