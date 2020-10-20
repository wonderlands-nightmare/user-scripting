// ==UserScript==
// @name         WaniKani Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.2
// @description  try to take over the world!
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wanikani-main.user.js
// @require      https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wanikani-main-styles.user.js
// @require      https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wanikani-main-reload.user.js
// @require      https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wanikani-main-crit-items.user.js
// @grant        none
// ==/UserScript==

(function() {
    let reviewButton = '.lessons-and-reviews .lessons-and-reviews__reviews-button';
    let lessonButton = '.lessons-and-reviews .lessons-and-reviews__lessons-button';
    
    $(reviewButton).attr('href', '/review/start');
    $('.navigation-shortcut--reviews > a').attr('href', '/review/start');

    let reviewCount = $(reviewButton + ' > span').text();
    let lessonCount = $(lessonButton + ' > span').text();

    if (reviewCount > 0) {
        $(reviewButton).addClass('has-reviews');
    }
    else {
        $(reviewButton).removeClass('has-lessons');
    }

    if (lessonCount > 0) {
        $(lessonButton).addClass('has-lessons');
    }
    else {
        $(lessonButton).removeClass('has-lessons');
    }
})();
