// ==UserScript==
// @name         WaniKani Custom Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      1.3
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-code-executor.user.js
// @resource     COMMON_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-common-styles.user.css
// @resource     ITEMS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-custom-items.user.css
// @resource     DASHBOARD_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-custom-dashboard.user.css
// @resource     DIALOG_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-settings-dialog.user.css
// @resource     COMMON_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/js/common/wl-wanikani-common-functions.user.js
// @resource     WKOF_DATA_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/js/common/wl-wanikani-wkof-data-manipulator.user.js
// @resource     HTML_GEN_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/js/common/wl-wanikani-html-generators.user.js
// @resource     DASHBOARD_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/js/common/wl-wanikani-custom-dashboard.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(function () {
    /*************************************************
     *  ANCHOR Variable initialisation
     *************************************************/
    // Change this to turn debugging on
    const isDebug = false;

    // WKOF modules required
    const wkofSettingsModules = 'Menu, Settings';
    const wkofDataModules = 'Apiv2, ItemData';


    /*************************************************
     *  ANCHOR Actual script execution code
     *************************************************/
    wkofInstallCheck();
    addStylesAndFunctions();
    dashboardLoader();
    generateDashboardWrapperHTML();

    wkof.include(wkofSettingsModules);
    wkof.ready(wkofSettingsModules)
        .then(loadWkofMenu)
        .then(loadWkofSettings);
    
    wkof.include(wkofDataModules);
    wkof.ready(wkofDataModules)
        .then(getWkofDataObject)
        .then(function(data) {
            wkofItemsData.AllData = data;
            setWlWanikaniDebugMode(isDebug);
            appendDashboardContentHTML(wkofItemsData.AllData);
            autoRefreshOnNextReviewHour(wkofItemsData.AllData.SummaryData);
            updateShortcutNavigation('lessons');
            updateShortcutNavigation('reviews');
            navShortcutReviewAndLessonButtonPulseEffect();
            dashboardLoader(true);
        });


    /*************************************************
     *   ANCHOR Retrieves CSS and JS code through GM and adds to page
     *************************************************/
    function addResources(resourceName) {
        // Get resource file contents
        const styleCss = GM_getResourceText(resourceName + "_CSS");
        const functionJs = GM_getResourceText(resourceName + "_JS");

        // Set JS script element
        let script = document.createElement('script');
        script.innerHTML = functionJs;
        script.type = 'text/javascript';
        script.className = 'custom-js';

        // Append resources to page
        document.body.appendChild(script);
        GM_addStyle(styleCss);
    }
    function addStyles(cssFileName) {
        const styleCss = GM_getResourceText(cssFileName);
        GM_addStyle(styleCss);
    };

    function addFunctions(jsFileName) {
        const functionJs = GM_getResourceText(jsFileName);

        let script = document.createElement('script');

        script.innerHTML = functionJs;
        script.type = 'text/javascript';
        script.className = 'custom-js';

        document.body.appendChild(script);
    };


    /*************************************************
     *  ANCHOR Execution function for adding CSS and JS code to page
     *  Done for simplicity since it's a simple function call
     *************************************************/
    function addStylesAndFunctions() {
        console.log('Running Add CSS and JS functions.');
        // Add styles
        addStyles("COMMON_CSS");
        addStyles("ITEMS_CSS");
        addStyles("DASHBOARD_CSS");

        // Add functions
        addFunctions("COMMON_JS");
        addFunctions("WKOF_DATA_JS");
        addFunctions("HTML_GEN_JS");
        addFunctions("DASHBOARD_JS");
        
        // Get CSS for dialog styles
        wcdDialogCss = GM_getResourceText("DIALOG_CSS");

        console.log('All Add CSS and JS functions have loaded.');
    };
})();