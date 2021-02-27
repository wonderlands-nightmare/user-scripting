/*************************************************
 *  ANCHOR Common debugger function
 *************************************************/
// Mainly used to identify when the page needs reloading on settings change
let dataDebugMode = wkof.settings[scriptId].debug_data;
let htmlDebugMode = wkof.settings[scriptId].debug_html;

// Data debug function
function wlWanikaniDebug(debugType, debugMessage, debugItem = '') {
    if ((dataDebugMode && debugType == 'data') || (htmlDebugMode && debugType == 'html')) {
        console.log(debugMessage, debugItem);
    }
};