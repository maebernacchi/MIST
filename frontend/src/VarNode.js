import React, { useState } from 'react';
import './styles/node.css';
//import { Stage, Layer, Rect, Text } from 'react-konva';


// variable nodes - for x, y, and other variables
function VarNode(props) {
    const [name, setName] = useState(props.name);
    const [isShown, setIsShown] = useState(false);

    return (
        <div>
            <div className="node"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
            >
                <div className="node-icon" id="varNode"></div>
            </div>
            {isShown && (
                <div className="info">varNode: name: {name}</div>
            )}
        </div>
    );


}

export default VarNode; 