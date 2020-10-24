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
    hideCompleteProgressItems();
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
        let progressEntries = $('.progress-and-forecast .dashboard-progress .progress-entries');

        progressEntries.each(function() {
            let parentClasses = '';
            parentClasses += $(this).siblings('h2').text();
            
            let progressEntry = progressEntries.find('.progress-entry');

            parentClasses += (progressEntry.length == 0) ? ' all-done' : '';

            $(this).parent('.rounded').addClass(parentClasses);

            $(progressEntry).each(function() {
                if ($(this).find('.progress-entry__pips .bg-gray-300').length = 0) {
                    $(this).addClass('hidden');
                }
            });
        });
    }
})();
