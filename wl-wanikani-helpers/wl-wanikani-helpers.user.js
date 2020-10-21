// ==UserScript==
// @name         WaniKani Dashboard Helpers
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  Some smaller dashboard helper functions.
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-helpers/wl-wanikani-helpers.user.js
// @grant        none
// ==/UserScript==

$(function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    let refreshCounter = 0


    /*************************************************
     *  Execute script.
     *************************************************/
    console.log('Running wl-wanikani-helpers functions.')
        .then(addStyles)
        .then(reviewAndLessonButtonPulseEffect)
        .then(autoRefreshOnNextReviewHour)
        .then(function(){ console.log('All wl-wanikani-helpers functions have loaded.'); });


    /*************************************************
     *  Helper functions.
     *************************************************/
    // Code goes here...


    /*************************************************
     *  Adds styling to page.
     *************************************************/
    function addStyles() {
        var style = document.createElement('style');
        var cssFile = 'https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/wl-wanikani-helpers/wl-wanikani-helpers.user.css';

        $.get(cssFile, function(content) {
            style.innerHTML = content;
        });

        style.className = 'wl-wanikani-helpers-custom-styles';

        document.head.appendChild(style);
    }


    /*************************************************
     *  Update review button href's and add class for pulse effect.
     *************************************************/
    function reviewAndLessonButtonPulseEffect() {
        let reviewButton = '.lessons-and-reviews .lessons-and-reviews__reviews-button';
        let lessonButton = '.lessons-and-reviews .lessons-and-reviews__lessons-button';
        let reviewShortcutButton = '.navigation-shortcuts .navigation-shortcut--reviews > a';
        let lessonShortcutButton = '.navigation-shortcuts .navigation-shortcut--lessons > a';

        $(reviewButton).attr('href', '/review/start');
        $(reviewShortcutButton).attr('href', '/review/start');

        let reviewCount = $(reviewButton + ' > span').text();
        let lessonCount = $(lessonButton + ' > span').text();

        if (reviewCount > 0) {
            $(reviewButton).addClass('has-reviews');
            $(reviewShortcutButton).addClass('has-reviews');
        }
        else {
            $(reviewButton).removeClass('has-lessons');
            $(reviewShortcutButton).addClass('has-reviews');
        }

        if (lessonCount > 0) {
            $(lessonButton).addClass('has-lessons');
            $(lessonShortcutButton).addClass('has-reviews');
        }
        else {
            $(lessonButton).removeClass('has-lessons');
            $(lessonShortcutButton).addClass('has-reviews');
        }
    }


    /*************************************************
     *  Add reload timer for auto-refresh on next review time.
     *************************************************/
    function autoRefreshOnNextReviewHour() {
        let currentHour = new Date().getHours() % 12 || 12;
        let nextReviewHour = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour:nth-child(2) time').text().replace(/ am| pm/gi, '');

        if (currentHour == nextReviewHour) {
            location.reload();
        }
        else {
            setTimeout(refreshPromise, 600000);
            console.log('Reset timeout: ' + refreshCounter);
            refreshCounter = refreshCounter + 1
        }
    };
})();
