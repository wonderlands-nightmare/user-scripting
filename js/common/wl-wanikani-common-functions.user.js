// ==UserScript==
// @name         WaniKani Custom Dashboard Common Functions
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Common debugger function.
 *************************************************/
let debugMode = false;

function setWlWanikaniDebugMode(debugModeBoolean) {
    debugMode = debugModeBoolean;
};

function wlWanikaniDebug(debugMessage, debugItem = '') {
    if (debugMode) {
        console.log(debugMessage);

        if (debugItem != '') {
            console.log(debugItem);
        }
    }
};

/*************************************************
 *  Add pulse effect for lesson and review buttons.
 *************************************************/
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
 *  Add reload timer for auto-refresh on next review time.
 *************************************************/
function autoRefreshOnNextReviewHour(summaryData) {
    let nextRefreshValue = '';
    let objHasReviewsIterator = 1;
    let objHasReviews = false;
    let timeoutValue = 6000;

    while (!objHasReviews) {
        if (summaryData.data.reviews[objHasReviewsIterator].subject_ids.length > 0) {
            nextRefreshValue = summaryData.data.reviews[objHasReviewsIterator].available_at;
            timeoutValue = new Date(nextRefreshValue) - new Date();
            objHasReviews = true;
        }
        else {
            objHasReviewsIterator++;
        }
    };
    
    if (timeoutValue <= 0) {
        location.reload();
    }
    else {
        setTimeout(autoRefreshOnNextReviewHour, timeoutValue, summaryData);
        console.log('Auto refresh set for ' + new Date(nextRefreshValue).toLocaleTimeString("en-AU", { timeZone: "Australia/Melbourne", hour: '2-digit' }));
    }
};



function setLevelProgressCircle(percent) {
    let circle = $('.level-progress-indicator .progress-ring circle');
    let radius = circle[0].r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - percent / 100 * circumference;
    circle.style.strokeDashoffset = offset;
}