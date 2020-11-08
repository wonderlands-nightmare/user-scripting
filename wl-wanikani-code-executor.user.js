// ==UserScript==
// @name         WaniKani Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @match        https://www.wanikani.com/*
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-code-executor.user.js
// @resource     COMMON_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-common-styles.user.css
// @resource     HELPERS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-helpers/wl-wanikani-helpers.user.css
// @resource     REARRANGER_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-dashboard-rearranger/wl-wanikani-dashboard-rearranger.user.css
// @resource     CRITICAL_ITEMS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-critical-items/wl-wanikani-critical-items.user.css
// @resource     HELPERS_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-helpers/wl-wanikani-helpers.user.js
// @resource     REARRANGER_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-dashboard-rearranger/wl-wanikani-dashboard-rearranger.user.js
// @resource     CRITICAL_ITEMS_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-critical-items/wl-wanikani-critical-items.user.js
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// ==/UserScript==

(async function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    const scriptNameSpace = 'wl-wanikani-dashboard';


    /*************************************************
     *  Execute script.
     *************************************************/
    console.log('Running ' + scriptNameSpace + ' functions.');
    // Add styles
    addStyles("COMMON_CSS");
    addStyles("HELPERS_CSS");
    addStyles("REARRANGER_CSS");
    addStyles("CRITICAL_ITEMS_CSS");
    // Add functions
    await addFunctions("HELPERS_JS");
    await addFunctions("REARRANGER_JS");
    await addFunctions("CRITICAL_ITEMS_JS");
    console.log('All ' + scriptNameSpace + ' functions have loaded.');

    console.log('Running ' + scriptNameSpace + ' functions2.');
    wkof.include('ItemData, Menu, Settings');
    wkof.ready('Apiv2, ItemData, Menu, Settings')
        .then(getCriticalItems)
        .then(getCriticalItemsData)
        .then(updatePageForCriticalItems)
        .then(function() { console.log('All ' + scriptNameSpace + ' functions have loaded2.'); });


    /*************************************************
     *  Helper functions.
     *************************************************/
    // Code goes here...


    /*************************************************
     *  Adds styling to page.
     *************************************************/
    function addStyles(cssFileName) {
        const styleCss = GM_getResourceText(cssFileName);
        GM_addStyle(styleCss);
    };

    function addFunctions(jsFileName) {
        const functionJs = GM_getResourceURL(jsFileName);

        let script = document.createElement('script');
        
        script.src = functionJs;
        script.type = 'text/javascript';
        script.className = 'custom-js';

        document.body.appendChild(script);
    };
})();