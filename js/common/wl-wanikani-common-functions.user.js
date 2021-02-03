// ==UserScript==
// @name         WaniKani Custom Dashboard Common Functions
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
const scriptName = 'Wanikani Custom Dashboard';
const scriptId = 'wanikani_custom_dashboard';


/*************************************************
 *  ANCHOR Common debugger function
 *************************************************/
// Actual debug function
function wlWanikaniDebug(debugMessage, debugItem = '') {
    if (wkof.settings[scriptId].debug) {
        console.log(debugMessage, debugItem);
    }
};

/*************************************************
 *  ANCHOR Add pulse effect for lesson and review buttons
 *************************************************/
function addReviewAndLessonButtonPulseEffect(buttonSelector, buttonCount, buttonHref, buttonClass) {
    if (buttonCount > 0) {
        $(buttonSelector).addClass(buttonClass).attr('href', buttonHref);
    }
    else {
        $(buttonSelector).removeClass(buttonClass);
    }
};

/*************************************************
 *  ANCHOR Add reload timer for auto-refresh on next review time
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


/*************************************************
 *  ANCHOR Set level progress indicator fill
 *************************************************/
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


/*************************************************
 *  ANCHOR Add a loading animation to the page while the dashboard HTML
 *  is generated
 *************************************************/
function dashboardLoader(loaded = false) {
    const loaderClass = 'custom-dashboard-loader';

    if (loaded) {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }
    }
    else {
        // Yes this doubles up but is just in case a cache/reload issue happens and the loader exists on the page
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }

        if ($('.dashboard').length > 0) {
            $('.dashboard').remove();
        }

        $('<div class="' + loaderClass + '"></div>').insertAfter('.footer-adjustment #search');
    }
}


/*************************************************
 *  ANCHOR Alter the Lesson and Review shortcut navigations to be in
 *  Japanese
 *************************************************/
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


/*************************************************
 *  ANCHOR Add slide toggle effects to the SRS Progress Summary 'show'
 *  buttons to show SRS Progress Summary information
 *************************************************/
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


/*************************************************
 *  ANCHOR Add hover effect for Next Review summary to show reviews
 *  over the next 24hrs
 *************************************************/
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

/*************************************************
 *  ANCHOR Loads WKOF settings
 *************************************************/
function loadWkofSettings() {
    let defaults = {
        show_difficult_items: false,
        safe_level: 3,
        srs_stage: 4,
        debug: false
    };
    wkof.Settings.load(scriptId, defaults);
}

/*************************************************
 *  ANCHOR Loads WKOF menu
 *************************************************/
function loadWkofMenu() {
    let config = {
        name: scriptId,
        submenu: 'Settings',
        title: scriptName,
        on_click: openSettings
    };

    wkof.Menu.insert_script_link(config);
}

/*************************************************
 *  ANCHOR Initiates WKOF settings on open
 *************************************************/
function openSettings(items) {
    var config = {
        script_id: scriptId,
        title: scriptName,
        content: {
            show_difficult_items: {
                type: 'checkbox',
                label: 'Show Difficult Items section',
                hover_tip: 'Check if you want to see the Difficult Items section. Defaults to not show.',
                default: false
            },
            safe_level: {
                type: 'number',
                label: '"Safe Level" difference',
                hover_tip: 'This is a number that is subtracted from your current level, and defines what the maximum level of the Difficult Items is to show. Defaults to 3.',
                multi: false,
                min: 0,
                max: 59,
                default: 3
            },
            srs_stage: {
                type: 'dropdown',
                label: 'SRS Stage cap',
                hover_tip: 'The maximum SRS stage that a Difficult Item can be shown with. Default is Apprentice 4.',
                content: {
                    1: 'Apprentice 1',
                    2: 'Apprentice 2',
                    3: 'Apprentice 3',
                    4: 'Apprentice 4',
                    5: 'Guru 1',
                    6: 'Guru 2',
                    7: 'Master',
                    8: 'Enlightened',
                    9: 'Burned'
                },
                default: 4
            },
            debug: {
                type: 'checkbox',
                label: 'Turn on consol debug',
                hover_tip: 'Useful for reporting bugs and providing or viewing loaded data.',
                default: false
            }
        },
        on_save: (()=>{
            generateDifficultItemsSection(wkofItemsData.AllData);
        })
    };
    let dialog = new wkof.Settings(config);
    dialog.open();
};