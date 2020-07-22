import React from "react";
import "./styleSheets/profile.css";
import "./styleSheets/generalStyles.css";
import {
    Button,
    Container,
    Row,
    Form,
    Col,
    Image,
    Nav,
    OverlayTrigger,
    Popover
} from "react-bootstrap";
/** 6745662 */
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import MISTImage from './MISTImageGallery'

import {
    AiOutlinePicture,
    AiOutlineStar,
} from "react-icons/ai";
import { GiAchievement } from "react-icons/gi";
import { GrAchievement } from "react-icons/gr";

export default function User() {
    return (
        <div>
            <Container>
                <h1> Example User </h1>
            </Container>
            <Container style={{ marginTop: "3vh", marginBottom: "3vh" }}>
                <FirstPart />
            </Container>

            <ProfileNav />
        </div>
    );
}

function FirstPart() {
    let [blocked, setBlocked] = useState(false);

    let blockPopover = (
        <Popover id="popover-basic">
            <Popover.Content>
                This user and their content will be blocked for you.
        </Popover.Content>
        </Popover>
    );

    function block() {
        if (!blocked) {
            setBlocked(true);
            alert("You have blocked this user and will no longer see their content. Visit your account settings to undo this.")
        }
    }

    let reportPopover = (
        <Popover id="popover-basic">
            <Popover.Content>
                Report this user.
        </Popover.Content>
        </Popover>
    );

    return (
        <Container style={{ width: "90%" }}>
            {/*
      <Row style={{ justifyContent: "flex-start" }}>
        {" "}
        <BsEnvelope size={28} /> <AiOutlineSetting size={28} />
        </Row> */ }
            <Row style={{ justifyContent: "space-between" }}>
                <Container style={{ width: "30%", justifyContent: "center" }}>
                    <MISTImage code="sin(x)" resolution="300" />
                    <OverlayTrigger trigger="hover" placement="right" overlay={blockPopover}>
                        <Button variant="secondary" onClick={() => block()}>
                            {blocked ? "Blocked" : "Block"}
                        </Button>
                    </OverlayTrigger> {' '}
                    <OverlayTrigger trigger="hover" placement="right" overlay={reportPopover}>
                        <Button href="/report" variant="danger">Report</Button>
                    </OverlayTrigger>
                </Container>

                {/** User informations + icon bar*/}

                <Container style={{ width: "50%", alignItems: "center" }}>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="4"> Name </Form.Label>
                            <Col sm="7">
                                <Form.Control
                                    plaintext
                                    readOnly
                                    defaultValue="Shrek"
                                />
                            </Col>

                            <Form.Label column sm="4"> Username </Form.Label>
                            <Col sm="7">
                                <Form.Control plaintext readOnly defaultValue="@donkey" />
                            </Col>
                            <Form.Label column sm="4">
                                Member since </Form.Label>

                            <Col sm="6">
                                <Form.Control plaintext readOnly defaultValue="June, 2020" />
                            </Col>

                            <Form.Label column sm="4">
                                Bio </Form.Label>

                            <Col sm="7">
                                <Form.Control plaintext rows="3" defaultValue="First the worst, Shrek the best" />
                            </Col>
                        </Form.Group>
                    </Form>
                    <hr />
                    <IconsBar />
                    <hr />
                </Container>
            </Row>
        </Container>
    );
}

function IconsBar() {
    const icons = [
        { iconName: <AiOutlinePicture size={28} />, num: 8, category: "images" },
        { iconName: <AiOutlineStar size={28} />, num: 2, category: "likes" },
        { iconName: <GiAchievement size={28} />, num: 4, category: "badges" },
        { iconName: <GrAchievement size={28} />, num: 6, category: "challenges" },
    ];
    return (
        <Row>
            {icons.map((iconBlock, idx) => (
                <Col key={idx}>
                    <Container style={{ textAlign: "center" }}>
                        {iconBlock.iconName}
                    </Container>
                    <Container style={{ textAlign: "center" }}>
                        {" "}
                        {iconBlock.num} <br />
                        {iconBlock.category}{" "}
                    </Container>
                </Col>
            ))}
        </Row>
    );
}

function ProfileNav() {
    return (
        <Container>
            <Nav fill variant="tabs" defaultActiveKey="link-1">
                <Nav.Item>
                    <Nav.Link eventKey="link-1" style={{ color: "black" }}>
                        Images
          </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-2" style={{ color: "black" }}>
                        Albums
          </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-4" style={{ color: "black" }}>
                        Badges
          </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-3" style={{ color: "black" }}>
                        Challenges
          </Nav.Link>
                </Nav.Item>
            </Nav>
        </Container>
    );
}
