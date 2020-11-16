import React, { useState, useContext } from "react";
import { UserContext } from "../../pages/components/Contexts/UserContext";
import { Button, Modal } from "react-bootstrap";
import { workspaceExists, saveWorkspace } from "../http.workspace";

function PopupCanvas(props) {
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <Modal centered show={props.show} onHide={props.closePortal}>
      <Modal.Header closeButton>
        <Modal.Title>Save you workspace</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <PortalTextBox />
      </Modal.Body>

      <Modal.Footer>
        <Buttons {...props} />
      </Modal.Footer>
    </Modal>
  );

  function PortalTextBox() {
    return (
      <div>
        <input
          type={"text"}
          placeholder={"Enter Name Of Image"}
          value={workspaceName}
          style={{
            border: "2px solid #008CBA",
            textAlign: "center",
          }}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
      </div>
    );
  }

  function Buttons(props) {
    const { updateAuthenticatedUser } = useContext(UserContext);
    function save(workspaceName, workspaceData) {
      function resolve(exists) {
        if (exists) {
          alert(`Cannot save a workspace with the name ${workspaceName} as it already exists`);
        } else {
          function resolveSave() {
            alert(`Successfully saved workspace with name ${workspaceName}`);
            updateAuthenticatedUser();
            setWorkspaceName("");
          }
          saveWorkspace(workspaceName, workspaceData, resolveSave);
        }
      };
      workspaceExists(workspaceName, resolve);
    }
    return (
      <>
        <Button onClick={props.closePortal} variant='secondary'>
          Exit
        </Button>
        <Button onClick={() => {
          const workspaceNameWithoutOuterWhiteSpace = removeOuterWhiteSpace(workspaceName);
          if (removeOuterWhiteSpace(workspaceNameWithoutOuterWhiteSpace)) {
            save(workspaceNameWithoutOuterWhiteSpace, props.workspaceData);
          } else {
            alert('Please enter a valid name for your workspace!');
          }
        }}>
          Save
        </Button>
      </>
    )
  }
}



/**
 * removeOuterWhiteSpace takes a string and removes white space at the beginning and end
 * of the string, but not the white space in the middle of the string.
 * returns a string
 */
function removeOuterWhiteSpace(string) {
  string = string.replace(/^ */, "");
  string = string.replace(/ *$/, "");
  return string;
};

export default PopupCanvas;
