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
    title: "one",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 4",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
    ]
  },

  {
    title: "two",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: false,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 4",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: false,
        challenge: <h1>Challenge</h1>
      },
    ]
  },

  {
    title: "three",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: false,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 4",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
    ]
  },

  {
    title: "four",
    subsections: [
      {
        title: "subsection 1",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: false,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 2",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 3",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
      {
        title: "subsection 4",
        keywords: ["introduction", "MIST", "general"],
        text: <h1>Text</h1>,
        isCheckpoint: true,
        checkpoint: <h1>Checkpoint</h1>,
        isChallenge: true,
        challenge: <h1>Challenge</h1>
      },
    ]
  }
]



function TutorialSlideShow(props){
  const [sectionNum, setSectionNum] = useState(props.sectionNum);
  const [subsectionNum, setSubsectionNum] = useState(props.subsectionNum);
  const [displayed, setDisplayed] = useState(sections[props.sectionNum].subsections[props.subsectionNum]);

  function subsectionForward() {
    let nextSubsectionNum = (subsectionNum + 1) % sections[sectionNum].subsections.length;
    let nextSectionNum = ((nextSubsectionNum == 0) ? sectionNum + 1 : sectionNum) % sections.length;
    // if next
    setSubsectionNum(nextSubsectionNum);
    setSectionNum(nextSectionNum);

    setDisplayed(sections[sectionNum].subsections[subsectionNum]);
    
  }


  // function stageForward() {
  //   let nextNum = stageNum + 1;
  //   if ( nextNum == 0) {
  //     setDisplayed(sections[sectionNum].subsections[subsectionNum].text);
  //   }
  //   if ( nextNum == 1) {
  //     if()
  //     setDisplayed(sections[props.sectionNum].subsections[props.subsectionNum].text);

      
  //   }
  //   if ( nextNum == 2) {

  //   }
  //   else {
  //     subsectionForward();
  //     setStage(0);
  //   }

    // setSubsectionNum((subsectionNum + 1) % sections[sectionNum].subsections.length);


    // if (sectionNum = lastSect) {
    //   setSectionNum(0);
    // }
  // }

  // function stageBack() {
  //   let nextNum = stageNum + 1;
  //   if ( nextNum == 0) {

  //   }
  //   else if ( nextNum == 1) {
  //     if
      
  //   }
  //   else if ( nextNum == 0) {

  //   }
  //   setSubsectionNum((subsectionNum + 1) % sections[sectionNum].subsections.length);
  //   // if (sectionNum = lastSect) {
  //   //   setSectionNum(0);
  //   // }
  // }

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
          <h1>{sections[sectionNum].title}</h1>
          <p>{sections[sectionNum].subsections[subsectionNum].title}</p>
          {/* <h1>Section number: {sectionNum}</h1>
          <h1>Subsection number: {subsectionNum}</h1> */}
          <Button onClick={() => subsectionForward()} >Next</Button>
        </Container>
      </Jumbotron>
      <Container>
          <h3>
            {sections[sectionNum].subsections[subsectionNum].keywords}
          </h3>
          {displayed.text}
          <br/>
          <br/>
          {displayed.isCheckpoint ? displayed.checkpoint : ""}
          <br/>
          <br/>
          {displayed.isChallenge ? displayed.challenge : ""}
          <br/>
          <br/>
      </Container>
      
    </Container>
  );

}

export default TutorialSlideShow;
