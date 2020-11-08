// ==UserScript==
// @name         WaniKani Dashboard Rearranger
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
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
    hideCompleteProgressItems();
    console.log('All ' + scriptNameSpace + ' functions have loaded.');


    /*************************************************
     *  Helper functions.
     *************************************************/
    // Code goes here...


    /*************************************************
     *  Hides the completed progress items.
     *************************************************/
    function hideCompleteProgressItems() {
        $('.progress-and-forecast .dashboard-progress .progress-entries').each(function() {
            let parentClasses = '';
            let progressEntry = $(this).find('.progress-entry');

            parentClasses += $(this).siblings('h2').text().toLowerCase();
            

            $(progressEntry).each(function() {
                if ($(this).find('.progress-entry__pips .bg-gray-300').length == 0) {
                    $(this).addClass('hidden');
                }
            });

            parentClasses += ($(this).find('.progress-entry.hidden').length == $(this).find('.progress-entry').length) ? ' all-done' : '';

            $(this).parent('.rounded').addClass(parentClasses);
        });
    }
})();
