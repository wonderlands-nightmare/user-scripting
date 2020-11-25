// ==UserScript==
// @name         WaniKani Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @match        https://www.wanikani.com/*
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-code-executor.user.js
// @resource     COMMON_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-common-styles.user.css
// @resource     COMMON_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-common-functions.user.js
// @resource     HELPERS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-helpers/wl-wanikani-helpers.user.css
// @resource     HELPERS_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-helpers/wl-wanikani-helpers.user.js
// @resource     REARRANGER_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-dashboard-rearranger/wl-wanikani-dashboard-rearranger.user.css
// @resource     REARRANGER_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-dashboard-rearranger/wl-wanikani-dashboard-rearranger.user.js
// @resource     CRITICAL_ITEMS_CSS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-critical-items/wl-wanikani-critical-items.user.css
// @resource     CRITICAL_ITEMS_JS https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-critical-items/wl-wanikani-critical-items.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

(async function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    let wkofItems = {};
    const wkofModules = 'Apiv2, ItemData';

    const urlToExecuteOn = {
        dashboard: {
            one: 'https://www.wanikani.com',
            two: 'https://www.wanikani.com/dashboard'
        }
    };

    const itemDataConfig = {
        wk_items: {
            options: {
                assignments: true,
                review_statistics: true
            },
            filters: {
                level: '1..+0',
                srs: {
                    value: 'burn',
                    invert: true
                }
            }
        }
    };


    /*************************************************
     *  Execute script.
     *************************************************/
    await addStylesAndFunctions();
    executeHelpersCode();

    if (Object.values(urlToExecuteOn.dashboard).includes(window.location.href)) {
        await intialiseWkofData();
    }


    /*************************************************
     *  Helper functions.
     *************************************************/
    function intialiseWkofData() {
        console.log('Running WKOF initialisation.');
        wkof.include(wkofModules);

        wkof.ready(wkofModules)
            .then(getWkofDataObject)
            .then(executeWkofDependentFunctions);
        console.log('WKOF initialisation complete.');
    };

    function executeWkofDependentFunctions(wkofData) {
        executeRearrangerCode(wkofData);
        executeCriticalItemsCode(wkofData);
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
     *  Get functions.
     *************************************************/
    async function getWkofDataObject() {
        wkofItems.UsersData = await wkof.Apiv2.fetch_endpoint('user');
        wkofItems.SummaryData = await wkof.Apiv2.fetch_endpoint('summary');
        wkofItems.ItemsData = await wkof.ItemData.get_items(itemDataConfig);
        return wkofItems;
    };
    


    /*************************************************
     *  Functions for executing plugins.
     *************************************************/
    function addStylesAndFunctions() {
        console.log('Running Add CSS and JS functions.');
        // Add styles
        addStyles("COMMON_CSS");
        addStyles("HELPERS_CSS");
        addStyles("REARRANGER_CSS");
        addStyles("CRITICAL_ITEMS_CSS");

        // Add functions
        addFunctions("COMMON_JS");
        addFunctions("HELPERS_JS");
        addFunctions("REARRANGER_JS");
        addFunctions("CRITICAL_ITEMS_JS");
        console.log('All Add CSS and JS functions have loaded.');
    };


    function executeHelpersCode() {
        console.log('Running Helpers functions.');
        reviewAndLessonButtonPulseEffect();
        console.log('All Helpers functions have loaded.');
    };


    function executeRearrangerCode(wkofData) {
        console.log('Running Rearranger functions.');
        // TODO: Replace with new rearranger features, passing data given to new functions
        hideCompleteProgressItems();
        autoRefreshOnNextReviewHour(wkofData.SummaryData);
        console.log('All Rearranger functions have loaded.');
    };


    async function executeCriticalItemsCode(wkofData) {
        console.log('Running Critical Items functions.');
        setWlWaniKaniDebugMode(false);
        let getCritItemsData = getCriticalItemsData(wkofData);
        generateCustomItemsTableHTML(getCritItemsData);
        console.log('All Critical Items functions have loaded.');
    };
})();