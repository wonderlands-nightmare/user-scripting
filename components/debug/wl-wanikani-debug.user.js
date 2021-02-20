/*************************************************
 *  ANCHOR Common debugger function
 *************************************************/
// Only used to initialise variable for code in this file
let debugMode = false;

// Called from main userscript to set debug mode
function setWlWanikaniDebugMode(debugModeBoolean) {
    debugMode = debugModeBoolean;
};

// Actual debug function
function wlWanikaniDebug(debugMessage, debugItem = '') {
    if (debugMode) {
        console.log(debugMessage, debugItem);
    }
};