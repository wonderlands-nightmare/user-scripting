// ==UserScript==
// @name         WaniKani Dashboard Helpers
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==


/*************************************************
 *  Variable initialisation.
 *************************************************/
// autoRefreshOnNextReviewHour
let refreshCounter = 0;


/*************************************************
 *  Helper functions.
 *************************************************/
function addLeadingZero(valueToAddTo, isString = false) {
    return isString 
        ? '0' + valueToAddTo 
        : (valueToAddTo < 10) 
            ? '0' + valueToAddTo 
            : valueToAddTo;       
};


function addReviewAndLessonButtonPulseEffect(buttonSelector, buttonHref, buttonClass) {
    let buttonCount = $(buttonSelector + ' > span').text();

    $(buttonSelector).attr('href', buttonHref);
    
    if (buttonCount > 0) {
        $(buttonSelector).addClass(buttonClass);
    }
    else {
        $(buttonSelector).removeClass(buttonClass);
    }
};


/*************************************************
 *  Update review button href's and add class for pulse effect.
 *************************************************/
function reviewAndLessonButtonPulseEffect() {
    // Review dashboard button
    addReviewAndLessonButtonPulseEffect('.lessons-and-reviews .lessons-and-reviews__reviews-button', '/review/start', 'has-reviews');

    // Review shortcut button
    addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--reviews > a', '/review/start', 'has-reviews');

    // Lesson dashboard button
    addReviewAndLessonButtonPulseEffect('.lessons-and-reviews .lessons-and-reviews__lessons-button', '/lesson/session', 'has-lessons');

    // Lesson shortcut button
    addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--lessons > a', '/lesson/session', 'has-lessons');
};


/*************************************************
 *  Add reload timer for auto-refresh on next review time.
 *************************************************/
function autoRefreshOnNextReviewHour() {
    let todayForecastsCount = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour time').length;
    let currentDate = new Date();
    let currentMinutes = currentDate.getMinutes();
    let current24Hour = currentDate.getHours();
    let current12Hour = current24Hour % 12 || 12;
    let nextReviewText = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour:nth-child(2) time').text();
    let nextReviewHour = nextReviewText.replace(/ am| pm/gi, '');
    let nextRefreshText = '';

    if (nextReviewText == '') {
        let nextRefreshMinutes = currentMinutes + 10;
        let refreshTextHours = addLeadingZero((nextRefreshMinutes >= 50) ? ((current24Hour + 1) % 24) : current24Hour);
        let refreshTextMinutes = addLeadingZero(nextRefreshMinutes % 60);
        nextRefreshText = refreshTextHours + ':' + refreshTextMinutes;
    }
    else {
        nextRefreshText = nextReviewText.replace(' ', ':' + addLeadingZero(currentMinutes.toString().slice(1), true) + ' ');
    }

    let autoRefreshHTML = `
        <span class="auto-refresh-indicator">Next refresh at ${ nextRefreshText }</span>
    `;

    if ($('.auto-refresh-indicator').length > 0) {
        $('.auto-refresh-indicator').remove();
    }
    $(autoRefreshHTML).insertAfter('.forecast > h1');

    if (current12Hour == nextReviewHour || (todayForecastsCount == 0 && current24Hour == 0)) {
        location.reload();
    }
    else {
        setTimeout(autoRefreshOnNextReviewHour, 600000);
        console.log('Auto refresh counter: ' + refreshCounter);
        refreshCounter = refreshCounter + 1;
    }
};