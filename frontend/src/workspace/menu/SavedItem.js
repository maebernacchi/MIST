import React from 'react';
import { Text } from 'react-konva';

export default function SavedItem(props) {

    return(
        <Text
            x={props.x}
            y={props.y}
            text={props.name}
            onClick={props.openWS}
        />
    );
}