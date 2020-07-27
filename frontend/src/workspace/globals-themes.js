// +------------------+----------------------------------------------
// | Workspace Colors |
// +------------------+

// Workspace's background.
const workspaceBackground = {
  classic: "#FAFBFF",
  dusk: "#f0f5ff",
  dark: "black",
};

// +-------------+---------------------------------------------------
// | Node Colors |
// +-------------+

// Color of the lines between nodes.
const lineFill = {
  classic: "black",
  dusk: "black",
  dark: "white",
};

// Color of the shadow when you hover over a node.
const nodeHoverShadow = {
    classic: 'cyan',
    dusk: 'cyan',
    dark: 'white',
}



// +-------------+---------------------------------------------------
// | Menu Colors |
// +-------------+

// Menu background color.
const menuBackground = {
    classic: 'white',
    dusk: '#EEF0FF',
    dark: '#1c170f',
}

// FOR NOW: Color of the value node on the menu value button.
const valueMenuColor1 = "#F2937C";
const valueMenuColor2 = "#ffa931";
const valueMenuColor3 = "#ffa931";

// Color of the reset/open/save buttons on the menu.
const workspaceButton = {
    classic: '#7FA7E7',
    dusk: '#111d5e',
    dark: '#4d4a45',
}

const menuFunTab = {
  classic: menuBackground.classic, //'#f5bcce',
  dusk: menuBackground.dusk, // '#401724',
  dark: menuBackground.dark // '#401724'
}

const menuValTab = {
  classic: menuBackground.classic, //'#fcf7ac',
  dusk: menuBackground.dusk, // '#5c591e',
  dark: menuBackground.dark // '#5c591e'
}

const menuCustomTab = {
  classic: menuBackground.classic, //'#bae3ff',
  dusk: menuBackground.dusk, // '#24465e',
  dark: menuBackground.dark // '#24465e'
}

const menuSavedTab = {
  classic: menuBackground.classic, //'#cffcdb',
  dusk: menuBackground.dusk, // '#1b4f2a',
  dark: menuBackground.dark // '#1b4f2a'
}

// +---------------+-------------------------------------------------
// | FunBar Colors |
// +---------------+

// Function bar's background.
const funBarBackground = {
    classic: '#7FA7E7',
    dusk: '#111d5e',
    dark: '#1c170f',
}

// +---------+-------------------------------------------------------
// | Exports |
// +---------+

export default {
  workspaceBackground,
  lineFill,
  nodeHoverShadow,
  menuBackground,
  valueMenuColor1,
  valueMenuColor2,
  valueMenuColor3,
  menuFunTab,
  menuValTab,
  menuCustomTab,
  menuSavedTab,
  workspaceButton,
  funBarBackground,
};
