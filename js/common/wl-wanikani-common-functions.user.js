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
        console.log(debugMessage, debugItem);
    }
};

/*************************************************
 *  Add pulse effect for lesson and review buttons.
 *************************************************/
function addReviewAndLessonButtonPulseEffect(buttonSelector, buttonCount, buttonHref, buttonClass) {
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
        if (objHasReviewsIterator < summaryData.data.reviews.length) {
            if (summaryData.data.reviews[objHasReviewsIterator].subject_ids.length > 0) {
                nextRefreshValue = summaryData.data.reviews[objHasReviewsIterator].available_at;
                timeoutValue = new Date(nextRefreshValue) - new Date();
                objHasReviews = true;
            }
            else {
                objHasReviewsIterator++;
            }
        }
        else {
            nextRefreshValue = new Date().setHours(new Date().getHours() + 6);
            timeoutValue = nextRefreshValue - new Date();
            objHasReviews = true;
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
    let circle = $('.level-progress-indicator .progress-ring circle.progress-ring-circle');
    let circleObj = circle[0];
    let radius = circleObj.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    circleObj.style.strokeDasharray = `${circumference} ${circumference}`;
    circleObj.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - percent / 100 * circumference;
    circleObj.style.strokeDashoffset = offset;
    wlWanikaniDebug('Circle object.', circleObj);
}

function dashboardLoader(loaded = false) {
    const loaderClass = 'custom-dashboard-loader'

    if (loaded) {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }
    }
    else {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }

        if ($('.dashboard').length > 0) {
            $('.dashboard').remove();
        }

        $('<div class="' + loaderClass + '"></div>').insertAfter('.footer-adjustment #search');
    }
}

function updateShortcutNavigation(item) {
    let navItem = $('.navigation-shortcut.navigation-shortcut--' + item + ' a');
    let navItemCount = $(navItem).find('span').text();
    let newItemText = item == 'lessons' ? '授業' : '復習';
    navItem.text('').append('<span>' + navItemCount + '</span>' + newItemText);
    $('.navigation-shortcuts').addClass('hidden');

    $(window).scroll(function() {
        if ($(window).scrollTop() >= 150) {
            $('.navigation-shortcuts').removeClass('hidden');
        }
        else {
            $('.navigation-shortcuts').addClass('hidden');
        }
    });
};

function setProgressSummaryButtonEffects() {
    $('.custom-dashboard .custom-section.custom-dashboard-progress').find('.custom-progress-summary-button').each(function (index, item) {
        let currentProgressType = $(this).attr('class').replace('custom-button custom-progress-summary-button ', '').replace(' selected', '');    
        let progressSummarySection = $('.custom-dashboard .custom-dashboard-summary-items.' + currentProgressType);
        progressSummarySection.slideToggle();
        $(this).on('click', function() {
            wlWanikaniDebug('Clicked class type: ', currentProgressType);
            
            $(this).toggleClass('selected');
            progressSummarySection.slideToggle();
        });
    });
}

function setFutureReviewsTooltip() {
    $('.custom-dashboard .custom-lessons-and-reviews .custom-summary.custom-lessons-and-reviews-summary.next-review-summary').hover(
        function(){
            $('.custom-dashboard .custom-lessons-and-reviews-summary-tooltip.future-reviews').show();
        },
        function(){
            $('.custom-dashboard .custom-lessons-and-reviews-summary-tooltip.future-reviews').hide();
        }
    );
}