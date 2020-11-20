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