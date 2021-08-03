import React from "react";
import { Group, Image, Text } from "react-konva";
import useImage from "use-image";

function SettingItem(props) {
  const [image] = useImage(require("./" + props.name + ".png"));
  const [imageClassic] = useImage(require("./Classic.png"));
  const [imageDusk] = useImage(require("./Dusk.png"));
  const [imageDark] = useImage(require("./Dark.png"));
  const [imageMath] = useImage(require("./Math.png"));
  const [imageWords] = useImage(require("./Words.png"));

  function Button() {
    return (
      <Image
        image={props.name==="Dark"?
          imageClassic :
          props.name==="Classic"?
            imageDusk :
            props.name==="Dusk"? 
              imageDark :
                props.name==="Math"? 
                  imageWords :
                    props.name==="Words"? 
                      imageMath : image}
        x={(props.width - props.height * 0.8)/2}
        width={props.height * 0.8}
        height={props.height * 0.8}
        scaleX={108 / props.width}
        scaleY={108 / props.width}
      />
    );
  }

  return (
    <Group
      x={props.x}
      y={props.y}
      visible={props.tabs.settingsOpen}
      onClick={props.handler}
      onTap={props.handler}
    >
      <Button/>
      <Text
        y={props.height * 0.9}
        width={props.width}
        height={props.height * 0.1}
        text={props.name==="Dark"?
              "Classic" :
              props.name==="Classic"?
                  "Dusk" :
                  props.name==="Dusk"? 
                      "Dark" : 
                      props.name==="Words"? 
                        "Math" : 
                        props.name==="Math"? 
                          "Words" : props.name}
        fontSize={14}
        align={"center"}
        verticalAlign={"middle"}
        fill={props.theme === "Dark" ? "white" : "black"}
      />
    </Group>
  );
}

export default SettingItem;
