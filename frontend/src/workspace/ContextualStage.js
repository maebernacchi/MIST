import React from "react";

class MyStage extends React.Component {
  static contextType = MyContext;
  render() {
    return <Stage>...</Stage>;
  }
}

export default MyStage;
