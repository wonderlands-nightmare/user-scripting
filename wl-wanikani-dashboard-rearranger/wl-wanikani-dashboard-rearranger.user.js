// ==UserScript==
// @name         WaniKani Dashboard Rearranger
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  Some smaller dashboard helper functions.
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-dashboard-rearranger/wl-wanikani-dashboard-rearranger.user.js
// @grant        none
// ==/UserScript==

(function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    const scriptNameSpace = 'wl-wanikani-dashboard-rearranger';


    /*************************************************
     *  Execute script.
     *************************************************/
    console.log('Running ' + scriptNameSpace + ' functions.');
    addRearrangerStyles();
    console.log('All ' + scriptNameSpace + ' functions have loaded.');


    /*************************************************
     *  Helper functions.
     *************************************************/
    // Code goes here...


    /*************************************************
     *  Adds styling to page.
     *************************************************/
    function addRearrangerStyles() {
        var style = document.createElement('style');
        var cssFile = 'https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/' + scriptNameSpace + '/' + scriptNameSpace + '.user.css';

        $.get(cssFile, function(content) {
            style.innerHTML = content;
        });

        style.className = scriptNameSpace + '-custom-styles';

        document.head.appendChild(style);
    };


    /*************************************************
     *  Hides the completed progress items.
     *************************************************/
    function hideCompleteProgressItems() {
        let progressitems = $('.progress-and-forecast .dashboard-progress .progress-entries .progress-entry__pips');
    
        $.each(progressitems, function(index, progressItem){
            //let progressitem = progressItem.children;
            
            //let hasClass = progressitem.hasClass('.bg-grey-300');
            //console.log(hasClass);
            //console.log(progressitem);
            // if (progressitem.hasClass()) {
            //     console.log(progressitem);
            // }
        });
    }
})();
