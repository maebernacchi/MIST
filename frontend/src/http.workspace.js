/* This file contains some of the HTTP requests that will be 
 * made to the API.
 */

/* Currently documented are the HTTP requests made to the API
 * through the GUI Workspace.
 *
 */
/** Check if the user already has an image by the chosen name
 * @param imageName, String, the name of the image
 */
// API action imageexists
export async function imageExists(imageName) {
    const response = await fetch(`/api?action=imageexists&title=${imageName}`);
    if (response.ok) {
        const data = await response.json();
        return data
    }
    else {
        throw Error(response.status);
    }
};

/** Save an image */
// API action saveImage
export async function saveImage(imageName, imageMISTCode) {
    // save the image
    const image = { title: imageName, imageMISTCode };
    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({action: 'saveimage', image: image})
    });
    // data is {success: true/false, message: API message}
    const data = await response.json();
    return data;
}; 

/** Check if user already has a workspace by the chosen name */
export async function workspaceExists(workspaceName){
    const response = await fetch(`/api?action=wsexist&name=${workspaceName}`);
    const data = await response.json();
    return data;
}

/** Save a workspace */
// API action savews
export async function saveWorkspace(workspaceName, workspaceState) {
    const workspace = { name: workspaceName, data: workspaceState };
    const response = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'savews', workspace: workspace });
    });
    // data is {success: true/false, message: API message}
    const data = await response.json();
    return data;
}

/** Retrieve workspaces */
// API action getws
export async function getWorkspaces() {
    const response = await fetch('/api?action=getws', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    // data is {success: true/false, workspaces: array of workspaces OR message: API message}
    const data = await response.json();
    return data;
}

/** Rename a workspace */


/** Delete a workspace */
// API action deletews

/** Delete an image */
// API + database not implemented