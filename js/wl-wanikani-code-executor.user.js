// ==UserScript==
// @name         WaniKani Custom Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      1.2
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-code-executor.user.js
// @resource     COMMON_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-common-styles.user.css
// @resource     ITEMS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-custom-items.user.css
// @resource     DASHBOARD_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/css/wl-wanikani-custom-dashboard.user.css
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

    // General WKOF item data config
    const itemDataConfig = {
        wk_items: {
            options: {
                assignments: true,
                review_statistics: true
            },
            filters: {
                level: '1..+0'
            }
        }
    };


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
     *  ANCHOR Check if WKOF is installed
     *************************************************/
    function wkofInstallCheck() {
        if (!wkof) {
            let response = confirm(scriptName + ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
            if (response) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            };

            return;
        };
    };


    /*************************************************
     *  ANCHOR Get the primary WKOF data for all other functions
     *************************************************/
    async function getWkofDataObject() {
        console.log('Running WKOF data retrieval.');
        let getWkofData = {};

        getWkofData.UsersData = await wkof.Apiv2.fetch_endpoint('user');
        getWkofData.SummaryData = await wkof.Apiv2.fetch_endpoint('summary');
        getWkofData.ItemsData = await wkof.ItemData.get_items(itemDataConfig);

        console.log('WKOF data retrieval complete.');
        return getWkofData;
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
        console.log('All Add CSS and JS functions have loaded.');

        console.log('All Add CSS and JS functions have loaded.');
    };


    /*************************************************
     *  ANCHOR Add pulse effect to the lesson/review navigation shortcuts
     *************************************************/
    function navShortcutReviewAndLessonButtonPulseEffect() {
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--lessons > a', $('.navigation-shortcuts .navigation-shortcut--lessons > a > span').text(), '/lesson/session', 'has-lessons');
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--reviews > a', $('.navigation-shortcuts .navigation-shortcut--reviews > a > span').text(), '/review/start', 'has-reviews');
    };
})();