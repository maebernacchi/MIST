import React from "react";
import { useState } from "react";
import {
  Nav,
  Image,
  Accordion,
  Card,
  Button,
  Container,
  Row,
  Col,
  Jumbotron,
  Modal,
  Popover,
  OverlayTrigger,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";

// import { Container } from "konva/types/Container";
// import { Row } from "react-bootstrap";

/**
 * sections data
 */
const sections = [

  {
    title: "Getting Started",
    subsections: [
      {
        title: "Introduction to Mist",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 1.1</h1>,
          // <h1>Checkpoint 1.1</h1>,
          // <h1>Challenge 1.1</h1>
        ]
      },
      {
        title: "The Graphic Workspace",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Here we will introduce users to the workspace. Perhaps we could also include a workspace component in this section?</h1>,
          <h1>Workspace Checkpoint -- might use the workspace component </h1>,
          // <h1>Challenge  1.2</h1>
        ]
      },
      {
        title: "Text UI",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>intro to the code workspace :shrug:</h1>,
          <h1>We can't exactly have a checkpoint for this since the code workspace isn't exactly portable... :/</h1>,
          // <h1>Challenge  1.3</h1>
        ]
      },
    ]
  },

  {
    title: "Variables",
    subsections: [
      {
        title: "X, Y, and Constants",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>This will be a bunch of information about the constants</h1>,
          <h1>Checkpoint to make sure they've got it down :sunglasses:</h1>,
          <h1>X, Y, and Constants CHALLENGES MUAHAHAHAHA</h1>
        ]
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 2.2</h1>,
          <h1>Checkpoint 2.2</h1>,
          <h1>Challenge 2.2</h1>
        ]
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 2.3</h1>,
          <h1>Checkpoint 2.3</h1>,
          <h1>Challenge 2.3</h1>
        ]
      },
    ]
  },

  {
    title: "three",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 3.1</h1>,
          <h1>Checkpoint 3.1</h1>,
          <h1>Challenge 3.1</h1>
        ]
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 3.2</h1>,
          <h1>Checkpoint 3.2</h1>,
          <h1>Challenge 3.2</h1>
        ]
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 3.3</h1>,
          <h1>Checkpoint 3.3</h1>,
          <h1>Challenge 3.3</h1>
        ]
      },
      {
        title: "subsection 4",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 3.4</h1>,
          <h1>Checkpoint 3.4</h1>,
          <h1>Challenge 3.4</h1>
        ]
      },
    ]
  },

  {
    title: "four",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 4.1</h1>,
          <h1>Checkpoint 4.1</h1>,
          <h1>Challenge4.1</h1>
        ]
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 4.2</h1>,
          <h1>Checkpoint 4.2</h1>,
          <h1>Challenge 4.2</h1>
        ]
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        stages: [
          <h1>Text 4.3</h1>,
          <h1>Checkpoint 4.3</h1>,
          <h1>Challenge 4.3</h1>
        ]
      },
    ]
  }
]



function TutorialSlideShow(props) {

  // tracks the indices
  const [sectionNum, setSectionNum] = useState(props.sectionNum);
  const [subsectionNum, setSubsectionNum] = useState(props.subsectionNum);
  const [stageNum, setStageNum] = useState(props.stageNum);

  // tracks the currently displayed elements
  // const [section, setDisplayed] = useState(sections[sectionNum]);
  // const [subsection, setSubsection] = useState(section.subsections[subsectionNum]);
  // const [stage, setStage] = useState(subsection.stages[stageNum]);

  // tracks the currently displayed elements
  const section = sections[sectionNum];
  const subsection = section.subsections[subsectionNum];
  const stage = subsection.stages[stageNum];

  function stageForward() {
    // gets the next number 
    let nextStageNum = (stageNum + 1);

    let nextSubsectionNum = subsectionNum;
    let nextSectionNum = sectionNum;

    if (nextStageNum == sections[sectionNum].subsections[subsectionNum].stages.length) {
      // if we need to rollover stageNum
      nextStageNum = 0; // set stageNum back to 0
      nextSubsectionNum++; // increment nextSubsectionNum
      if (nextSubsectionNum == sections[sectionNum].subsections.length) {
        // if we need to rollover subsectionNum
        nextSubsectionNum = 0;
        nextSectionNum++;
        if (nextSectionNum == sections.length) {
          // if we need to rollover sectionNum.
          nextSectionNum = 0;
        }
      }
    }
    // these three function calls update the indices
    setStageNum(nextStageNum);
    setSubsectionNum(nextSubsectionNum);
    setSectionNum(nextSectionNum);


    // console.log(nextStageNum+ ", " + nextSubsectionNum + ", " + nextSectionNum);

    // this updates the item that's being displayed. Not sure yet if it's
    // actually necessary to have the displayed item in the state. I'll experiment.
    // setDisplayed(sections[sectionNum].subsections[subsectionNum].stages[stageNum]);
  }

  return (
    <Container>
      <Jumbotron
        fluid
        style={{
          borderRadius: "20px",
          border: "solid",
          borderWidth: "1px",
          borderColor: "gray",
        }}
      >
        <Container>
          <Row>
            <Col sm="8">
              <h1 style={{ textAlign: "left" }}>
                {section.title}{" "}
                {/* <Link
                            to={"#" + subsection.id}
                            style={{ color: "gray" }}
                          >
                        
                          </Link> */}
                <br />
                {/* Here is where a link used to be! */}
              </h1>
              <hr />

              {/* keywords */}
              <Row style={{ marginLeft: "1vh" }}>
                {subsection.keywords.map((keyword) => (
                  <p1 style={{ margin: "1vh" }}>
                    {" "}
                    {keyword} &#x25CF;
                  </p1>
                ))}
              </Row>

              {/* Buttons for the text, video, final, and challenges sections */}
              <Row style={{ marginLeft: "1em", paddingTop: "2vh" }}>
                <Button onClick={() => stageForward()}> Click here for next stage!</Button>
              </Row>
            </Col>

            {/* The Final Image */}
            <Col style={{ justifyContent: "center" }}>
              <Row style={{ justifyContent: "center" }}>
                {/* {subsection.image} */}
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/>
                Image will go here!Image will go here!<br/><br/>
              </Row>
              <Row style={{ justifyContent: "center" }}>
                {/* {subsection.isAnimated ? (
                            <p>
                              <BsClock size={15} style={{ margin: "1vh" }} />
                              Hover over for animation!
                            </p>
                          ) : (
                            ""
                          )} */}
                Indication of animation will go here!
              </Row>
            </Col>
          </Row>
        </Container>
      </Jumbotron>

      <Container>
        {stage}
      </Container>

    </Container>
  );

}

export default TutorialSlideShow;
