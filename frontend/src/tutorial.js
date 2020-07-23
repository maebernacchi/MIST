// +----------------------------------------------------------------------------------------------------------
// | Tutorial.js |
// +-------------+

/**
 * This is the Tutorials page.
 * 
 * Copyright (c) 2020 Samuel A. Rebelsky and the people who did the work.
 * This work is licenced under a LGLP 3.0 or later .....
 * 
 */

 // +--------------------------------------+-------------------------------------------------------------------
 // | Design Issues  -- The Sections array |
 // +--------------------------------------+

 /**
  * All the tutorials page content is in an array called sections[].
  *   Sections are the following as of Summer 2020: 
  *       - Getting Started
  *       - Varaibles
  *       - Functions
  *       - Shapes
  *       - Customize
  *       - Interesting Images
  * 
  *   Each SECTIONS have the following fields:
  *     - title
  *         | This is the name that is shown on the UI (button)
  * 
  *     - subsections
  *         | Subsections are eg. Introduction to Mist, The Workspace, ... , Circle, Rhombus, Triangle, etc.
  * 
  *   ----------------------------------------------------------------------------------------------------------
  *   Each SUBSECTIONS have the following fields: 
  *     - title
  *        | The title of the subsection (eg. Introduction to MIST) 
  * 
  *     - id
  *        | The id of the subsection to refer to, 
  *        |and is also related to the URL(eg. intro-to-mist)
  * 
  *     - keywords
  *        | the keywords of the different subsections
  *        |  Needs to be mapped, not yet connected / called in the code
  * 
  *     - final product image
  *        | need to be added in this array, will be a MISTimg probably
  * 
  *     - text
  *        | the text tutorial option -- html code content
  * 
  *     - video
  *        | The video tutorial option
  * 
  *     - final
  *        | mini workspace with the final product layout
  * 
  *     - challenges
  *        | an array of challenges
  *        | each challenge has the following fields:
  *        |    - question:  html code question + possible image
  *        |    - hint    :  html code content for hint
  *   ------------------------------------------------------------------------------------------------------------
  */

 // +-----------------------------+-------------------------------------------------------------------------------
 // | Design Issues  -- This File |
 // +-----------------------------+

 /**
  * 1. Imports 
  * 2. Tutorial Code
  *       - Table of Contents
  *       - Tutorials contents
  *           | SubsectionButton
  *                 + Button that has a section name on (eg. text), 
  *                 + and goes to that subsection
  *           | Help Modal 
  *                 + the overlay modal that comes up when someone needs help in challenges
  *           | Text Tutorial
  *           | Video Tutorial
  *           | Final
  * 3. Sections array
  * 
  * Both the *Table of Contents* and the *Tutorials contents*
  * are relying on sections[].
  */

// +---------+--------------------------------------
// | IMPORTS |
// +---------+
import React from "react";
import "./styleSheets/tutorial.css";

import { Nav, Accordion, Card, Button, Container, Row, Col, Jumbotron, Modal, DropdownButton, Dropdown } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.css";





import { BsQuestionCircle } from "react-icons/bs";
import {RiMenu2Line} from "react-icons/ri"

import MISTImage from "./MISTImageGallery"


//Tutorial Header
function Tutorial() {
  return (

    <Row style={{ marginLeft: "1em", marginRight: "1em", alignItems: "flex-start" }}>
      <Col xs="3"  style={{ position: "sticky", top: "2rem" }}>
      {/* Table of Contents */}
      <TableContents />
      </Col>
      <Col xs="9">
      {/* Tutorials */}
      <Tutorials />
      </Col>

    </Row>
  );
};

// +--------------------+--------------------------------------------
// | Table of Contents  |
// +------------------- +

function TableContents() {
  return (
    <Card>

      {/* Title -- Table of Contents */}
      <Card.Header style={{ margin: "auto" }}>
        <h3>Table of Contents </h3>
      </Card.Header>
      {/* All the sections and subsections */}
      <Accordion>

        {/* Maps each sections  */}
        {sections.map((section, idx) => ( 
          <Card>
            <Card.Header>
              {/* Displays the title of the section */}
              <Accordion.Toggle as={Button} variant="link" eventKey={idx+1} style={{ color: "black" }}>
                {section.title}
              </Accordion.Toggle>
            </Card.Header>

            {/* On eventkey, it opens the Buttons with the same eventkey */}
            <Accordion.Collapse eventKey={idx+1}>
              <Card.Body>
                <Nav className="flex-column">

                  {/* Maps each subsections */}
                  {section.subsections.map((subsection) => (

                    //The button in the Table of Contents with the subsection title
                    <Button offset='10'
                      href={'#' + subsection.id}
                      style={{ color: "black", background: "none", border: "none", textAlign: "left" }}>
                      {subsection.title}
                    </Button>
                  ))}

                </Nav>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>
    </Card>

  )
}

// +----------------------------+----------------------------------------
// | Tutorial Contents          |
// +--------------------------- +

function Tutorials() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <Container >
      {/* Maps each sections */}
      {sections.map((section, idx) => (
        <div>

          {/* Maps each subsections */}
          {section.subsections.map((subsection, idx) => (

            //Has correct subsection id
            <section id={subsection.id}>
              <Container  >

                {/* The "header" of the subsection */}
                <Jumbotron fluid style={{ borderRadius: "20px", border: "solid", borderWidth: "1px", borderColor: "gray" }}>
                  <Container>
                    <Row>
                      <Col sm="8">
                        <h1 style={{ textAlign: "left" }}>{subsection.title}</h1>
                        <hr />

                        {/* keywords */}
                        <Row style={{marginLeft: "1vh"}}>
                        
                          {subsection.keywords.map((keyword) => (
                            <p1 style={{margin: "1vh"}}> {keyword}  &#x25CF;</p1>
                          ))}
                           
                        </Row>

                        {/* Buttons for the text, video, final, and challenges sections */}
                        <Row style={{ marginLeft: "1em", paddingTop: "2vh" }}>

                        <SubsectionButton id={subsection.id} type="text"/>
                        <SubsectionButton id={subsection.id} type="video"/>
                        <SubsectionButton id={subsection.id} type="final"/>
                        <SubsectionButton id={subsection.id} type="challenges"/>
                         
                        </Row>
                      </Col>

                      {/* The Final Image */}
                      <Col>
                      <MISTImage code='x' resolution="250" />
                      </Col>
                    </Row>
                  </Container>
                </Jumbotron>
                {/* END OF "HEADER" OF SUBSECTION! */}

                {/* Text, Video, Final, Challenges sections */}
                <Text text={subsection.text} id={subsection.id} />
                <Video video={subsection.video} id={subsection.id} />
                <Final final={subsection.final} id={subsection.id} />

                {/* Challenges Section */}

                <Card id={subsection.id + '-challenges'} style={{ borderRadius: "15px", backgroundColor: "white", borderWidth: "1px", margin: "1vh" }}>
                  <Card.Body>
                    <Row >
                      <Col xs="11">
                    <Container>Challenges</Container>
                    <Container>
                      {/* Maps each challenges */}
                      {subsection.challenges.map(challenge => (
                        <Container>
                          {challenge.question}
                          
                          {/* Help Icon Button */}
                          <Nav.Link onClick={() => setModalShow(true)}>
                            <BsQuestionCircle />
                          </Nav.Link>

                          <HelpModal
                            show={modalShow}
                            onHide={() => setModalShow(false)}
                            hint={challenge.hint}
                          />
                        </Container>
                        
                      ))}
                      
                    </Container>
                    </Col>
                    <Col xs="1">
                    <SectionMenu id={subsection.id}/>
          </Col>
                    </Row>
                  </Card.Body>
                </Card>

              </Container>
            </section>
          ))}
        </div>
      ))}


    </Container>
  )
}

function SubsectionButton(props) {
  return (
    <Button
      variant="outline-dark"
      style={{ marginRight: "1em" }}
      href={'#' + props.id + '-' + props.type} >

      {props.type}
    </Button>
  )
}

function HelpModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Hint
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
       
          {props.hint}
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

function Text(props) {
  return (

  
    <Card id={props.id + '-text'} style={{ borderRadius: "15px", backgroundColor: "white", borderWidth: "1px", margin: "1vh" }}>
      <Card.Body>
        <Row>
        <Col xs="11">
        <Container> Text </Container>
        {props.text}
        </Col>
        <Col xs="1">
        <SectionMenu id={props.id}/>
        </Col>
    </Row>
      </Card.Body>
    </Card>
  )
}

function SubsectionDropdownItem(props) {
  return (
    <Dropdown.Item
      style={{ marginRight: "1em", color: "black", background: "none", border: "none" }}
      href={'#' + props.id + '-' + props.type} 
      
      variant="secondary" >

      {props.type}
    </Dropdown.Item>
  )
}

function Video(props) {
  return (

    
    <Card id={props.id + '-video'} style={{ borderRadius: "15px", backgroundColor: "white", borderWidth: "1px", margin: "1vh" }}>
      <Card.Body>
        <Row> 
        <Col xs="11">
        <Container>Video </Container>
        {props.video}
        </Col>
        <Col xs="1">
          <SectionMenu id={props.id}/>
            </Col>
    </Row>
      </Card.Body>
    </Card>
  )
}


function Final(props) {
  return (

    <Card id={props.id + '-final'} style={{ borderRadius: "15px", backgroundColor: "white", borderWidth: "1px", margin: "1vh" }}>
    <Card.Body>
      <Row>
      <Col xs="11">
      <Container> Final </Container>
      {props.final}
      </Col>
      <Col xs="1">
        <SectionMenu id={props.id}/>
          </Col>
  </Row>
    </Card.Body>
  </Card>
  )
}

function SectionMenu(props){
  return(
  <DropdownButton variant="secondary-outline" id="dropdown-item-button" title={<RiMenu2Line/>} sticky="top" style={{ position: "sticky", top: "2rem" }}>
          <Col>
          <SubsectionDropdownItem id={props.id} type="text" />
          <SubsectionDropdownItem id={props.id} type="video"/>
          <SubsectionDropdownItem id={props.id} type="final" />
          <SubsectionDropdownItem id={props.id} type="challenges"/>
          </Col>
          </DropdownButton>
          )
}

 //+---------------------+----------------------------------------------------------------------------------------------------------------------
    //| Section Array    |
    //+------------------+


const sections = [
  
  {

    //+------------------+----------------------------------------------------------------------------------------------------------------------
    //| Getting Started  |
    //+------------------+

    
    title: "Getting Started",

    subsections:
      /* Introduction to MIST */
      [
        
        {
        title: "Introduction to MIST", id: 'intro-to-mist',
        keywords: ["introduction", "MIST", "general"],
        //Text
        text:
          <Container>
            
              Welcome to MIST, the Mathematical Image Synthesis Toolkit!
              <br />
              In this video we will go over the basic ideas of MIST!
              <br />
              After this, you will have a better understanding of how variables and functions are getting translated to the cool images that you can create with MIST.
              <br />
              All images in MIST are drawn on a square canvas.
              <br />
              We have an x and a y axis, just like in math class!
              <br />
              X values range from -1 at the left to 1 at the right. Y values range from -1 at the top to 1 at the bottom (This is
              different from what you have experienced in math class!).
              <br />
              Numbers also represent colors. Since we're working in the range -1 to 1, we must assign a meaning to each number. We'll start with greyscale images. In greyscale, the value 1 represents the color black (or lots of ink).
              Conversely, -1 is white.
              <br />
              And anything between -1 and 1 is grey.
              <br />
              Here's an image in which each color depends on the x coordinate.
              <br />
              We would write this as x.
              <br />
              We can apply mathematical operations, too. Here's what happens when we multiply x times y. (Don't worry about how we're writing it; you'll use a graphical user interface to build images.)

              You've learned the basics of the MIST world. It's time to start making your own images.
          </Container>,


        //Video
        video:
          <Container>This is a video </Container>,

        //Final
        final:
          <Container>This is the final product </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container>This is a Challenge 1 </Container>,
            hint:
              <Container>This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]

      },


      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| The Workspace    |
      //+------------------+

      {
        title: "The Workspace", ref: '#workspace', id: 'workspace',
        keywords: ["graph", "grayscale", "general"],
        //Text
        text:
          <Container>
            Welcome to the workspace! This is where you will be making all of your lovely 
            images from mathematical equations.
            <br />
            Here, you are able to choose from a variety of values and 
            functions that allow the images to be made and are connected through lines. 
            <br />
            Each image has a range of -1 to 1, where -1 represents white and 1
             represents black; everything in between is gray until the rbg 
             function is used. X- values range from -1 on the left and 1 on the 
             right, while y-values range from -1 at the top to 1 at the bottom.


          </Container>,

        //Video
        video:
          <Container>This is a video </Container>,

        //Final
        final:
          <Container>This is a video</Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2</Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| The Expert UI    |
      //+------------------+

      {
        title: "The Expert UI", ref: '#expert-ui', id: 'expert-ui',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
           This section is about the Expert UI!
          </Container>,

        //Video
        video:
          <Container>This is a video </Container>,

        //Final
        final:
          <Container>This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container>This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| The Website      |
      //+------------------+
      {
        title: "The Website", ref: '#website', id: 'website',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
            Welcome to a tour of the MIST website!
            <br />
            To start off, this is the home page. There are many different routes you can take here, from looking at other peoples' images to creating your own. Let's begin with the create page, which you can get to by clicking "create" on the top left of the page on the menu bar. 
            <br /> 
            On the create page, you can make your own images using the workspace on it. 
            <br />
            Next is the challenges page, which can also be found by clicking the button beside "create." Here, you can click on a challenge, which is an image that you try to recreate! 
            <br />
            After this, we're going to go to the tutorial page, which is the page that we're currently on if you're reading this!
            <br />
            Next up is the gallery. With the gallery, you can see what other people have created. Here, you can click on images to learn more about it. You can see who created the image, how many favorites it has, you can save or share, or view or add a comment! 
            <br />
            After this, we can look at the About MIST and development page. This explain what MIST is about! 
            <br />
            We can also go to the community guidelines page. This explains the guidelines for using MIST and being a respectful of other peoples
            <br />
            Next we can go to the FAQ, which is still under the "About" tab. 
            <br />
            Use the "Sign In/Up" tab to login or sign up for MIST!
            <br />
            You can use the search bar in the top right corner to look up users, images, and albums!
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Good Practices  |
      //+------------------+
      /*{
        title: "Good Practices", ref: '#good-practices', id: 'good-practices',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>Good practices who?</Container>,
        //Video
        video:
          <Container> This is a video </Container>,
        //Final
        final:
          <Container> This is a video </Container>,
        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>
          }]
      } */]
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Variables    |
  //+------------------+
  {

    title: "Variables",
    subsections:
      [{
        title: "X, Y, and Constants", ref: '#x-y-constants', id: 'x-y-constants',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
              <b>X</b>, <b>Y</b> and <b>constants</b> are values in MIST that are inputted into functions or even used on their own. 
              <br />
              The <b>X</b> variable ranges from -1 to 1 based on the x-values. This means that from left to right, the colors of this block change white to black. This is because x-values change horizontally. 
              <br />
              The <b>Y</b> variable ranges from -1 to 1 based on the y-values. Remember that for <b>Y</b>, -1 starts at the top and 1 is at the bottom. Therefore, white is at the top and slowly turns black, which comes from y-values changing hoizontally. 
              <br />
              A constant is a value that doesn't change, hence the name constant. For example, if we had the value <b>2</b>, it would always remain as <b>2</b>. 
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+---------------------+------------------------------------------------------------------------------------------------------------------
      //| Time and Animations |
      //+---------------------+
      {
        title: "Time and Animations", ref: '#time-animations', id: 'time-animations',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
            In order to get an animation, you'll have to connect a time variable to your workspace! This includes the blocks <b>t.s</b>, <b>t.m</b>, <b>t.h</b>, <b>t.d</b>. These are divided by increasing times, with s standing for seconds, m for minutes, h for hours, and d for days. 
            <br />
            Adding time causes the image to become an animation. This is because time passes, it changes the input and therefore changes the image. 
            <br />
            Time and animations can be manipulated. You can add them, multiply them, or change them with other functions and this speeds up or slows down the animation. 
            <br />
            To show an example of this:
            <br />
            1. Add an <b>x</b> and <b>t.s</b> variable to the workspace.
            <br />
            2. Dran in a <b>mult</b> block and connect the <b>x</b> and <b>t.s</b> to it. Now you can see time changes what was once a a simple <b>x</b> image. 
            <br />
            3. To change the speed of the animation, bring in a <b>constant</b> variable and set it equal to 2. Connect this to the <b>mult</b> block that is already there and see how the speed changes. It should move much quicker now!
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------------+-------------------------------------------------------------------------------------------------------------------
      //| Moving with the Mouse  |
      //+------------------------+
      {
        title: "Moving with the Mouse", ref: '#moving-with-mouse', id: 'moving-with-mouse',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
              Moving with the mouse means that you can change what the image looks like just by moving your mouse around on the image. In order to do this, the <b>m.x</b> block, <b>m.y</b> block, or both must be used. 
              <br />
              The <b>m.x</b> block changes the colors along the x-values. You can try it yourself by opening the preview for <b>m.x</b> and moving your mouse from side to side over it!
              <br />
              The <b>m.y</b> block changes the shades from white to black across the y-values. This is because the y-values refer to the vertical values in math!
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      }]
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Functions    |
  //+------------------+
  {

    title: "Functions",
    subsections:
      [{
        title: "Multiple Inputs", ref: '#multiple-input', id: 'multiple-input',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
              Multiple input functions are functions that must have at least 2 inputs and can have up to 20. These functions include <b>sum</b>, <b>wsum</b>, <b>mult</b>, and <b>avg</b>. 
              <br />
              The <b>sum</b> function adds numbers together. It sums together numbers up to -1 and 1. For example, if you add together 0.5 and 0.7, it will stay equal to 1. 
              <br />
              The <b>wsum</b> (wrap sum) function works similarly to how <b>sum</b> does. However, instead of maxing out at 1 or -1, it wraps back around. 
              <br />
              The <b>mult</b> block lets you multiply two or more numbers together. Using the example multiplying x and y together, you can see in the top left corner, that it is black because -1 x -1 is 1. Then, if you look at the bottom left corner, it is black 
              <br />
              The <b>avg</b> function averages together values. For example, the average of -1 and 1 is 0.
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Fixed Inputs     |
      //+------------------+
      {
        title: "Fixed Inputs", ref: '#fixed-input', id: 'fixed-input',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
            Fixed input functions mean that the number of inputs is unchanging. This includes blocks for <b>sqr</b>, <b>neg</b>, <b>sin</b>, <b>cos</b>, <b>abs</b>, <b>sign</b>, <b>if</b>.
            <br />
            <b>Sqr</b> stands for squaring a number or variable. This means that multiplying a variable like x by itself twice is the same as squaring it once.
            <br />
            <b>Neg</b> means negative, this changes the input from positive to negative, or if the input was already negative, it would change it to a positive output. 
            <br />
            <b>Sin</b> and <b>cos</b> stand for sine and cosine, which are trigonometric functions. To see a difference, drag an <b>x</b> and <b>y</b> variable into the workspace. Next, add a <b>sin</b> and <b>cos</b> block to connect to each. Here, you can see how they differ. 
            <br /> 
            <b>Abs</b> is absolute value. This turns anything that is negative or positive into its positive counterpart. For example, the absolute value of -1 is one, whereas the absolute value of 1 is also 1. 
            <br /> 
            <b>Sign</b> is used to round values. Every value below 0 gets rounded to -1 and every value equal to or greater than 0 gets rounded to one. This also means that there will be no gray areas in the image you make! 
            <br />
            <b>If</b> blocks work by taking 3 inputs. To see for yourself, drag an <b>x</b> and <b>y</b> variable into the workspace. Connect the <b>x</b> to the first two nodes of the <b>if</b> block. Then, connect the <b>y</b> variable to the third node of the <b>if</b> block. In this example below, the test case, which is the first input, is <b>x</b>. So while the input is less than 0, the returned value is negative, which means that it calls <b>y</b>. When it reaches 0 or greater, it returns positive, which in this case is x. This is why the image looks "split" in this case. 

          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Adding Color     |
      //+------------------+
      {
        title: "Adding Color", ref: '#adding-color', id: 'adding-color',
        keywords: ["graph", "color", "axis"],
        //Text
        text:
          <Container>
            The <b>RGB</b> function adds color! <b>RGB</b> is defined by three components: red, green, and blue. These components are the primary colors in a pixel on your screen that can be mixed by varying degrees so that other colors can be made. It helps to think about RGB in terms of mixing light rather than mixing paint colors in that the more you add, the closer you get to white light.
            <br />
            To the right is an example of solid red, represented by a 1 in the red component's position and -1 in the green and blue positions. Meaning that the amount of red in the light mixture is at its highest and the amounts of green and blue are at their lowest.
            <br />
            Together, these all change the color. If the <b>RGB</b> function is given 1, 1 and 1, it will interpret these numbers as pure white since in our [-1,1] world these are our highest values. Given -1,-1 and -1, <b>RGB</b> would show pitch black. Within the limits of our world, adding more of any of the three components will change the 'amount' of that color in the mixture.
            <br />
            To make your own colorful image, try this!
            <br />
            1. Start by adding an <b>x</b>, <b>x</b>, and <b>y</b> to your workspace.
            <br />
            2. Drag in a <b>mult</b> block and connect y to it twice. 
            <br />
            3. Add a <b>sin</b> and connect the x to it.
            <br />
            4. Finally, bring in a <b>RGB</b> block. Connect the <b>mult</b> block to the red, the x to the green, and sign to the blue. Check out your colorful image! 

          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      }]
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Shapes       |
  //+------------------+
  {

    title: "Shapes",
    subsections:
      [{
        title: "Circle", ref: '#circle', id: 'circle',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
            Have you ever wanted to try making shapes? Here is an example of a circle!
            1. Place an <b>x</b> and a <b>y</b> in the workspace.
            <br />
            2. <b>Square</b> each of them! We square them because x<sup>2</sup> + y<sup>2</sup> is the equation of a circle.
            <br />
            3. Add <b>wsum</b>. And make sure it has a W!
            <br />
            4. Connect it to a <b>sign</b> function! This gets rid of all of the gray areas and makes it purely black and white. 
            <br />
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Triangle         |
      //+------------------+
      {
        title: "Triangle", ref: '#triangle', id: 'triangle',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>
            Making a basic triangle is pretty straightforward! 
            <br />
            1. Drag in a <b>x</b> and a <b>y</b> in the workspace.
            <br />
            2. Add a <b>sum</b> block. You can also add a wsum block to see how they look different. However, in this tutorial, we will just be focusing on sum.
            <br />
            3. Next, place in a <b>sign</b> block. Now if you click on the preview button, you will see that you have a triangle! 
            <br />
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Rhombus          |
      //+------------------+
      {
        title: "Rhombus", ref: '#rhombus', id: 'rhombus',
        keywords: ["graph", "grayscale", "shape"],
        //Text
        text:
          <Container>
            For a rhombus, we’re going to do <b>x</b> and <b>y</b> one at a time. 
            <br />
            1. First, add the variable <b>x</b> and values <b>1</b> and <b>-1</b> to the workspace. 
            <br />
            2.Then, bring in an <b>if</b> statement. 
            <br />
            3. When connecting to the <b>if</b> statement, make sure it goes in the correct order! Connect the <b>x</b> to the first node of the if statement. 
            <br />
            4. Then, connect <b>-1</b> to the second node. This means that if x is a positive number or 0, it will return this -1. 
            <br />
            5. After that, connect <b>1</b> to the third node. If the input is less than 0, it will return 1. This is why when you click the preview for if, the right side is white and the left side is black. You can see how it should look below!
            <br />
            6. Next, add <b>x</b> and a value block to the workspace. Set the value of this block equal to <b>2</b>.       
            <br />
            7. Bring in a <b>mult</b> block and connect the <b>x</b>, the <b>2</b>, and the <b>if</b> block to it. If you look at the preview now, you can see how it has changed!
            <br />
            8. Now do the same thing again, but this time using <b>y</b> instead of <b>x</b>. This will change the pattern from a vertical split to a horizontal one. 
            <br />
            9. Connect a <b>y</b>, <b>-1</b>, and <b>1</b> to an <b>if</b> block, in that order, just like in step 3 to 5. It should look like this.
            <br />
            10. Then add another <b>y</b>, <b>2</b>, and <b>mult</b> block. 
            <br />
            11. Connect the <b>y</b>, <b>2</b> and previous <b>if</b> block to the <b>mult</b> block.
            <br />
            12. After this is completed, let’s add a <b>sum</b> block. Connect this to the <b>mult</b> block that was used for <b>x</b>, and the <b>mult</b> block that we used with <b>y</b> to it. 
            <br />
            13. We’re also going to add another value block and set it to <b>2</b>. Now we should have a diamond shaped rhombus outline!
            <br />
            14. To make this more clear, we’re going to add a <b>sign</b> block. Connect <b>sum</b> to <b>sign</b> and click the preview; you should see a rhombus!
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      }]
  },

  //+------------------+----------------------------------------------------------------------------------------------------------------------
  //| The Customize    |
  //+------------------+
  {

    title: "Customize",
    subsections:
      [
        /* Flipping */
        {
          title: "Flipping", ref: '#multiple-input', id: 'multiple-input',
          keywords: ["shape", "grayscale", "shape"],
          //Text
          text:
            <Container>
              Flipping an image means that you create the impression of flipping an image when you invert the colors! Here is an example with a simple triangle. 
              <br /> 
              1. Start by making a triangle. To do this, drag in a <b>x</b> and a <b>y</b> in the workspace.
              <br />
              2. Add a <b>sum</b> block. 
              <br />
              3. Next, place in a <b>sign</b> block.
              <br />
              4. Instead of this being the end, add a <b>neg</b> block. Connect the <b>sign</b> to this. Now you should see that your triangle has been flipped!
              </Container>,

          //Video
          video:
            <Container> This is a video </Container>,

          //Final
          final:
            <Container> This is a video </Container>,

          //Challenges
          challenges:
            [{
              question:
                <Container> This is a Challenge 1 </Container>,
              hint:
                <Container> This is a hint 1 </Container>
            },
            {
              question:
                <Container> This is a Challenge 2 </Container>,
              hint:
                <Container> This is a hint 2</Container>

            }]
        },

        //+------------------+----------------------------------------------------------------------------------------------------------------------
        //| Resizing         |
        //+------------------+
        {
          title: "Resizing", ref: '#resizing', id: 'resizing',
          keywords: ["size", "shape", "grayscale"],
          //Text
          text:
            <Container>
              Resizing can be useful when trying to get an image to look a certain way. The easiest way to alter the size of an image inside the canvas is to include a constant. Let's go through an example of that!
              <br />
              1. Start by adding an <b>x</b> and <b>y</b> variable to the workspace. 
              <br />
              2. Add a <b>cos</b> block and connect the <b>x</b> to it.
              <br />
              3. Drag a <b>sin</b> block to the space and connect the <b>y</b>.
              <br />
              4. Bring in a <b>wsum</b> block. 
              <br />
              5. Add a <b>constant</b> and set it equal to 0.5. The 0 must be included in the front in order for it to work!
              <br />
              6. Connect the <b>cos</b> and <b>sin</b> to the <b>wsum</b>. Take a look at the preview to see how it looks now.
              <br />
              7. Finally, connect the <b>0.5</b> to <b>wsum</b> and see how the size changes!
              </Container>,

          //Video
          video:
            <Container> This is a video </Container>,

          //Final
          final:
            <Container> This is a video </Container>,

          //Challenges
          challenges:
            [{
              question:
                <Container> This is a Challenge 1 </Container>,
              hint:
                <Container> This is a hint 1 </Container>
            },
            {
              question:
                <Container> This is a Challenge 2 </Container>,
              hint:
                <Container> This is a hint 2</Container>

            }]
        },

        //+------------------+----------------------------------------------------------------------------------------------------------------------
        //| Moving around    |
        //+------------------+
        {
          title: "Moving around", ref: '#moving-around', id: 'moving-around',
          keywords: ["graph", "grayscale", "axis"],
          //Text
          text:
            <Container>hellobello2</Container>,

          //Video
          video:
            <Container> This is a video </Container>,

          //Final
          final:
            <Container> This is a video </Container>,

          //Challenges
          challenges:
            [{
              question:
                <Container> This is a Challenge 1 </Container>,
              hint:
                <Container> This is a hint 1 </Container>
            },
            {
              question:
                <Container> This is a Challenge 2 </Container>,
              hint:
                <Container> This is a hint 2</Container>

            }]
        },

        //+------------------+----------------------------------------------------------------------------------------------------------------------
        //| Assemble         |
        //+------------------+
        {
          title: "Assemble", ref: '#assemble', id: 'assemble',
          keywords: ["graph", "grayscale", "axis"],
          //Text
          text:
            <Container>hellobello2</Container>,

          //Video
          video:
            <Container> This is a video </Container>,

          //Final
          final:
            <Container> This is a video </Container>,

          //Challenges
          challenges:
            [{
              question:
                <Container> This is a Challenge 1 </Container>,
              hint:
                <Container> This is a hint 1 </Container>
            },
            {
              question:
                <Container> This is a Challenge 2 </Container>,
              hint:
                <Container> This is a hint 2</Container>

            }]
        }]
  },

  //+---------------------------+-------------------------------------------------------------------------------------------------------------
  //| The Interesting Images    |
  //+---------------------------+
  {

    title: "Interesting Images",
    //+------------------+----------------------------------------------------------------------------------------------------------------------
    //| Colorful Image   |
    //+------------------+
    subsections:
      [{
        title: "Colorful Image", id: 'colorful-image',
        keywords: ["graph", "grayscale", "interesting"],
        //Text
        text:
          <Container>
            Here is an example of a colorful image using many of the skills you just learned! 
            <br />
            1. To start,  add an <b>x</b>, <b>y</b>, and <b>t.s</b> variable to the workspace. 
            <br />
            2. After this, bring in a <b>sin</b> and <b>cos</b> block. Connect the <b>x</b> to <b>cos</b> first then <b>sin</b>. If we click on the previews for <b>sin</b> and <b>cos</b>, we can see how the differences in how they look!
            <br />
            3. Now, let’s add another <b>sin</b> block and connect the <b>sin</b> from the previous step to it. 
            <br />
            4. Next, we’re going to drag in a <b>mult</b> block. Let’s connect the <b>sin</b> block and the <b>y</b> variable to it!
            <br />
            5. Add a <b>wsum</b> block. We’re going to connect <b>t.s</b> and <b>y</b> to this. 
            <br />
            6. Finally, connect this to an <b>rgb</b> block. We’ll start at the top, with <b>sin</b> being red, the <b>mult</b> block going to green, and <b>wsum</b> connecting to blue. Now look at this colorful animation you just made!
          </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      //| Moving Image     |
      //+------------------+
      {
        title: "Moving Image", id: 'moving-image',
        keywords: ["animation", "grayscale", "interesting"],
        //Text
        text:
          <Container>
            Here is an example of an interesting and slightly more challenging image. It incorporates many aspects from the previous tutorials.
            To begin:
            <br />
            1. Start by adding an <b>x</b> and a <b>y</b> variable. 
            <br />
            2. Next, add a <b>sqr</b>, <b>mult</b>, and <b>neg</b>. Connect the <b>x</b> to the <b>sqr</b> and <b>mult</b> and the <b>y</b> to the <b>mult</b> and <b>neg</b>.
            <br />
            3. Then bring in another <b>neg</b> block and connect the <b>sqr</b> to this. 
            <br />
            4. Add a <b>t.s</b>, <b>m.x</b>, and <b>m.y</b>. 
            <br />
            5. Include another <b>mult</b> block into the workspace and connect the <b>t.s</b> and <b>m.y</b> to it.
            <br />
            6. On their own, the images look simple, but now it's time to put it all together. Start by adding a <b>wsum</b>. From there, connect both <b>neg</b> blocks and <b>mult</b> blocks. Additionally, connect the <b>t.s</b> and <b>m.x</b> to the <b>wsum</b> block as well.
            <br />
            7. Finally, connect the <b>wsum</b> to a new <b>sin</b> block and check out the final image!
            </Container>,

        //Video
        video:
          <Container> This is a video </Container>,

        //Final
        final:
          <Container> This is a video </Container>,

        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>

          }]
      },

      //+------------------+----------------------------------------------------------------------------------------------------------------------
      /*//| Adding Color     |
      //+------------------+
      {
        title: "Adding Color", id: 'adding-color',
        keywords: ["graph", "grayscale", "axis"],
        //Text
        text:
          <Container>hellobello2</Container>,
        //Video
        video:
          <Container> This is a video </Container>,
        //Final
        final:
          <Container> This is a video </Container>,
        //Challenges
        challenges:
          [{
            question:
              <Container> This is a Challenge 1 </Container>,
            hint:
              <Container> This is a hint 1 </Container>
          },
          {
            question:
              <Container> This is a Challenge 2 </Container>,
            hint:
              <Container> This is a hint 2</Container>
          }] 
      }*/]
  },
]

export default Tutorial;