// ==UserScript==
// @name         WaniKani Dashboard Rearranger
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==


/*************************************************
 *  Variable initialisation.
 *************************************************/
// Add variables...


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
};


/*************************************************
 *  Add reload timer for auto-refresh on next review time.
 *************************************************/
function autoRefreshOnNextReviewHour(nextRefresh) {
    let nextRefreshText = new Date(nextRefresh).toLocaleTimeString("en-AU", { timeZone: "Australia/Melbourne", hour: '2-digit' });
    let timeoutValue = new Date(nextRefresh) - new Date();

    let autoRefreshHTML = `
        <span class="auto-refresh-indicator">Next refresh at ${ nextRefreshText }</span>
    `;

    if ($('.auto-refresh-indicator').length > 0) {
        $('.auto-refresh-indicator').remove();
    }
    $(autoRefreshHTML).insertAfter('.forecast > h1');

    if (timeoutValue <= 0) {
        location.reload();
    }
    else {
        setTimeout(autoRefreshOnNextReviewHour, timeoutValue);
        console.log('Auto refresh set for ' + nextRefreshText);
    }
};