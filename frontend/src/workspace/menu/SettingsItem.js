import React, { useContext } from "react";
import { Group, Image, Rect, Text } from "react-konva";
//import useImage from "use-image";
import { menuContext } from "../globals/globals-menu-dimensions";

function SettingItem(props) {

    const menuDimensions = useContext(menuContext);
    //const [image] = useImage(require("./"+props.name+".jpg"));

    /* function Button() {
        return (
            <Image
                image={image}
                x={props.x}
                y={props.y}
            />
        )
    } */

    return (
        <Group
            x={props.x}
            y={props.y}
        >
            <Rect
                width={props.width}
                height={props.height}
                fill={'pink'}
                cornerRadius={20}
            />
            <Text
                width={props.width}
                height={props.height}
                text={props.name}
            />
        </Group>
        
    )
}

export default SettingItem