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
    const wkofModules = 'Apiv2, ItemData';

    const urlToExecuteOn = {
        dashboard: {
            one: 'https://www.wanikani.com',
            two: 'https://www.wanikani.com/dashboard'
        }
    };

    const critItemDataConfig = {
        wk_items: {
            options: {
                assignments: true,
                review_statistics: true
            },
            filters: {
                level: '1..+0', //only retrieve items from lv 1 up to and including current level
                srs: {
                    value: 'lock, init, burn',
                    invert: true
                } //exlude locked, initial and burned items
            }
        }
    };

    const lockItemDataConfig = {
        wk_items: {
            options: {
                review_statistics: true
            },
            filters: {
                level: '+0', //only retrieve items from lv 1 up to and including current level
                item_type: 'kan, rad',
                srs: {
                    value: 'lock'
                    //invert: true
                } //exlude locked, initial and burned items
            }
        }
    };

    const initItemDataConfig = {
        wk_items: {
            options: {
                assignments: true,
                review_statistics: true
            },
            filters: {
                level: '+0', //only retrieve items from lv 1 up to and including current level
                srs: {
                    value: 'lock, init, burn',
                    invert: true
                } //exlude locked, initial and burned items
            }
        }
    };


    /*************************************************
     *  Execute script.
     *************************************************/
    await addStylesAndFunctions();
    await executeHelpersCode();

    if (Object.value(urlToExecuteOn.dashboard).includes(window.location.href)) {
        let initWkofData = await intialiseWkofData();
        await executeRearrangerCode(initWkofData);
        await executeCriticalItemsCode(initWkofData);
    }


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


    function intialiseWkofData() {
        console.log('Running WKOF initialisation.');
        wkof.include(wkofModules);

        wkof.ready(wkofModules)
            .then(function() {
                wkofItems.UsersData = await wkof.Apiv2.fetch_endpoint('user');
                wkofItems.SummaryData = await wkof.Apiv2.fetch_endpoint('summary');
                wkofItems.CritItemsData = await wkof.ItemData.get_items(critItemDataConfig);
                wkofItems.LockItemsData = await wkof.ItemData.get_items(lockItemDataConfig);
                wkofItems.InitItemsData = await wkof.ItemData.get_items(initItemDataConfig);
                return wkofItems;
            });
        console.log('WKOF initialisation complete.');
    };


    function executeRearrangerCode(wkofData) {
        console.log('Running Rearranger functions.');
        // TODO: Replace with new rearranger features, passing data given to new functions
        hideCompleteProgressItems();
        autoRefreshOnNextReviewHour(wkofData.SummaryData.data.next_reviews_at);
        console.log('All Rearranger functions have loaded.');
    };


    async function executeCriticalItemsCode(wkofData) {
        console.log('Running Critical Items functions.');
        await setCriticalItemsDebugMode(false);
        let getCritItems = await getCriticalItems(wkofData);
        let getCritItemsData = await getCriticalItemsData(getCritItems);
        await updatePageForCriticalItems(getCritItemsData);
        console.log('All Critical Items functions have loaded.');
    };
})();