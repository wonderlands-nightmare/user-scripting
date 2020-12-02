// ==UserScript==
// @name         WaniKani Custom Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.2
// @description  A collection of custom scripts for editing the wanikani experience.
// @author       Wonderland-Nightmares
// @match        https://www.wanikani.com/*
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
     *  Variable initialisation.
     *************************************************/
    const isDebug = false;

    const wkofModules = 'Apiv2, ItemData';

    const urlToExecuteOn = {
        dashboard: {
            one: 'https://www.wanikani.com/',
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
                level: '1..+0'
            }
        }
    };


    /*************************************************
     *  Execute script.
     *************************************************/
    addStylesAndFunctions();
    // remove original dashboard and add loading display

    
    if (Object.values(urlToExecuteOn.dashboard).includes(window.location.href)) {
        wkof.include(wkofModules);

        wkof.ready(wkofModules)
            .then(getWkofDataObject)
            .then(function(data) {
                console.log(data);
                setWlWanikaniDebugMode(isDebug);
                generateDashboardHTML(data);
                autoRefreshOnNextReviewHour(data.SummaryData);
            });
    }

    reviewAndLessonButtonPulseEffect();


    /*************************************************
     *  Helper functions.
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
     *  Get functions.
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
     *  Functions for executing plugins.
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
    };


    function reviewAndLessonButtonPulseEffect() {
        // Shortcut buttons
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--lessons > a', $('.navigation-shortcuts .navigation-shortcut--lessons > a > span').text(), '/lesson/session', 'has-lessons');
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--reviews > a', $('.navigation-shortcuts .navigation-shortcut--reviews > a > span').text(), '/review/start', 'has-reviews');
    };
})();