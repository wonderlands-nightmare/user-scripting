// ==UserScript==
// @name         WaniKani Dashboard Helpers
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  Some smaller dashboard helper functions.
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/*
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-helpers/wl-wanikani-helpers.user.js
// @grant        none
// ==/UserScript==

(function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    const scriptNameSpace = 'wl-wanikani-helpers';
    
    // autoRefreshOnNextReviewHour
    let refreshCounter = 0;


    /*************************************************
     *  Execute script.
     *************************************************/
    console.log('Running ' + scriptNameSpace + ' functions.');
    addHelperStyles();
    reviewAndLessonButtonPulseEffect();
    autoRefreshOnNextReviewHour();
    console.log('All ' + scriptNameSpace + ' functions have loaded.');


    /*************************************************
     *  Helper functions.
     *************************************************/
    // Code goes here...


    /*************************************************
     *  Adds styling to page.
     *************************************************/
    function addHelperStyles() {
        var style = document.createElement('style');
        var cssFile = 'https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/' + scriptNameSpace + '/' + scriptNameSpace + '.user.css';

        $.get(cssFile, function(content) {
            style.innerHTML = content;
        });

        style.className = scriptNameSpace + '-custom-styles';

        document.head.appendChild(style);
    };


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
            $(reviewShortcutButton).removeClass('has-reviews');
        }

        if (lessonCount > 0) {
            $(lessonButton).addClass('has-lessons');
            $(lessonShortcutButton).addClass('has-lessons');
        }
        else {
            $(lessonButton).removeClass('has-lessons');
            $(lessonShortcutButton).removeClass('has-lessons');
        }
    };


    /*************************************************
     *  Add reload timer for auto-refresh on next review time.
     *************************************************/
    function autoRefreshOnNextReviewHour() {
        let todayForecastsCount = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour time').length;
        let currentDate = new Date();
        let currentMinutes = (currentDate.getMinutes() > 10) ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
        let current24Hour = currentDate.getHours();
        let current12Hour = current24Hour % 12 || 12;
        let nextReviewText = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour:nth-child(2) time').text();
        let nextReviewHour = nextReviewText.replace(/ am| pm/gi, '');
        let nextRefreshText = '';

        if (nextReviewText == '') {
            let nextRefreshMinutes = currentMinutes + 10;
            let refreshTextHours = (nextRefreshMinutes >= 50) ? ((current24Hour + 1) % 24) : current24Hour;
            let refreshTextMinutes = nextRefreshMinutes % 60;
            nextRefreshText = refreshTextHours + ':' + refreshTextMinutes;
        }
        else {
            nextRefreshText = nextReviewText.replace(' ', ':' + currentMinutes + ' ');
        }

        let autoRefreshHTML = `
            <span class="auto-refresh-indicator">Next refresh at ${ nextRefreshText }</span>
        `;

        if ($('.auto-refresh-indicators').length > 0) {
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
})();
