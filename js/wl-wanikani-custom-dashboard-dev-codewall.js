// ==UserScript==
// @name         WaniKani Custom Dashboard - DEV
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  Development codewall for WaniKani Custom Dashboard.
// @author       Wonderland-Nightmares
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        GM_addStyle
// ==/UserScript==

// SECTION CSS code
// ANCHOR wl-wanikani-common-styles.user.css
const wlWanikaniCommonStylesCss = `
/********************************
 *  Global colours
 ********************************/
:root {
    /* WaniKani colours */
    --lesson-colour:             #ff00aa;
    --lesson-colour-darker:      #bd007e;
    --lesson-colour-lighter:     #fa7acf;
    --review-colour:             #00aaff;
    --review-colour-darker:      #0279b5;
    --review-colour-lighter:     #80d4ff;
    --transparent-lesson-colour: rgb(255, 0, 170, 0.2);
    --transparent-review-colour: rgb(0, 170, 255, 0.2);

    /* Common colours */
    --dark-blue:                 #294ddb;
    --dark-green:                #006400;
    --gold:                      #ffd700;
    --gold-darker:               #b5b014;
    --green:                     #218139;
    --light-blue:                #0093dd;
    --maroon:                    #800000;
    --pink:                      #dd0093;
    --purple:                    #882d9e;

    /* Shades */
    --black:                     #000000;
    --dark-grey:                 #6b6b6b;
    --grey:                      #d5d5d5;
    --light-grey:                #f4f4f4;
    --white:                     #ffffff;

    /* Odd colours */
    --transparent-black:         rgba(0, 0, 0, 0.75);
    --transparent-dark-blue:     rgb(41, 77, 219, 0.2);
    --transparent-dark-green:    rgb(0, 100, 0, 0.2);
    --transparent-gold:          rgb(255, 215, 0, 0.2);
    --transparent-light-blue:    rgb(0, 147, 221, 0.2);
    --transparent-maroon:        rgb(128, 0, 0, 0.2);
    --transparent-pink:          rgb(221, 0, 147, 0.2);
    --transparent-purple:        rgb(136, 45, 158, 0.2);
}


/********************************
 *  Lesson/Review navigation styles
 ********************************/
/* Initialise navigation styles */
.custom-lessons-and-reviews-button:not(.has-reviews):not(.has-lessons),
.navigation-shortcuts .navigation-shortcut--reviews > a:not(.has-reviews) > span,
.navigation-shortcuts .navigation-shortcut--lessons > a:not(.has-lessons) > span {
    background: var(--dark-grey);
}

/* Add animations and styles to main and shortcut buttons */
.custom-dashboard .custom-lessons-and-reviews-button.reviews-button.has-reviews,
.navigation-shortcuts .navigation-shortcut--reviews > a.has-reviews > span {
    background: var(--review-colour);
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.custom-dashboard .custom-lessons-and-reviews-button.lessons-button.has-lessons,
.navigation-shortcuts .navigation-shortcut--lessons > a.has-lessons > span {
    background: var(--lesson-colour);
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.custom-dashboard .custom-lessons-and-reviews-button.reviews-button.has-reviews,
.navigation-shortcuts .navigation-shortcut--reviews > a.has-reviews {
    --start-pulse: var(--review-colour-darker);
    --end-pulse: var(--review-colour-lighter);
    animation: buttonPulse 2s infinite;
}

.custom-dashboard .custom-lessons-and-reviews-button.lessons-button.has-lessons,
.navigation-shortcuts .navigation-shortcut--lessons > a.has-lessons {
    --start-pulse: var(--lesson-colour-darker);
    --end-pulse: var(--lesson-colour-lighter);
    animation: buttonPulse 2s infinite;
}

/********************************
 *  Animations
 ********************************/
@keyframes buttonPulse {
    0% {
        box-shadow: 0 0 0 0 var(--start-pulse);
    }
    70% {
        box-shadow: 0 0 0 7px var(--white);
    }
    100% {
        box-shadow: 0 0 0 0 var(--end-pulse);
    }
}
`;

// ANCHOR wl-wanikani-custom-items.user.css
const wlWanikaniCustomItemsCss = `
/********************************
 *  Items section and progress entry styles
 ********************************/
/* Main wrapper styles */
 .custom-items {
    padding: 12px 24px;
    margin-bottom: 30px;
    background: var(--light-grey);
}

.custom-items section {
    margin-bottom: 0;
}

/* Progress entry styles */
.custom-items section .progress-entries {
    grid-template-columns: none;
    display: flex;
}

.custom-items section .progress-entries .progress-entry-header {
    width: 100%;
}

.custom-items section .progress-entries .progress-entry {
    height: 40px;
}

.custom-items section .progress-entries .progress-entry.radical,
.custom-items section .progress-entries .progress-entry.kanji {
    width: 40px;
}

.custom-items section .progress-entries .progress-entry.kanji a.kanji-icon.locked {
    background: var(--dark-grey);
}

.custom-items section .progress-entries .progress-entry.vocabulary .vocabulary-icon {
    height: 40px;
    font-size: 21px;
}

.custom-items section .progress-entries .progress-entry.vocabulary .vocabulary-icon:hover {
    text-decoration: none;
}

/********************************
 *  Item level and SRS level indicator styles
 ********************************/
/* Level and SRS level indicator wrapper styles */
.custom-items section .progress-entries .progress-entry a .progress-item-level,
.custom-items section .progress-entries .progress-entry a .progress-item-srs-level {
    position: absolute;
    width: 15px;
    border: 0.5px solid var(--white);
    border-radius: 50%;
    font-size: 9px;
    font-weight: bold;
    line-height: 14px;
}

/* Item level styles */
.custom-items section .progress-entries .progress-entry a .progress-item-level {
    background: var(--dark-green);
    bottom: -5px;
    right: -5px;
}

/* Item SRS level styles */
.custom-items section .progress-entries .progress-entry a .progress-item-srs-level {
    top: -5px;
    right: -5px;
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-0 {
    background: var(--dark-green);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-1 {
    background: var(--black);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-2 {
    background: var(--dark-grey);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-3 {
    background: var(--lesson-colour-lighter);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-4 {
    background: var(--lesson-colour-darker);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-5 {
    background: var(--purple);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-6 {
    background: var(--dark-blue);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-7 {
    background: var(--review-colour-darker);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-8 {
    background: var(--gold-darker);
}

.custom-items section .progress-entries .progress-entry a .progress-item-srs-level.srs-level-9 {
    background: var(--maroon);
}

/********************************
 *  Tooltip styles
 ********************************/
/* Item tooltip wrapper styles */
.custom-item-tooltip .custom-item-tooltip-text {
    visibility: hidden;
    width: 200px;
    background-color: var(--transparent-black);
    color: var(--white);
    text-align: center;
    border-radius: 5px;
    padding: 10px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -110px;
    opacity: 0;
    transition: opacity 0.3s;
}

/* Item tooltip content styles */
.custom-item-tooltip .custom-item-tooltip-text .custom-item-tooltip-text-entries {
    border-radius: 5px;
    padding: 5px 10px;
    margin-bottom: 10px;
}

.custom-item-tooltip .custom-item-tooltip-text .custom-item-tooltip-text-accepted-entries .custom-item-tooltip-text-entries.item-readings {
    background: var(--dark-green);
}

.custom-item-tooltip .custom-item-tooltip-text .custom-item-tooltip-text-accepted-entries .custom-item-tooltip-text-entries.item-meanings {
    background: var(--dark-grey);
}

.custom-item-tooltip .custom-item-tooltip-text .custom-item-tooltip-text-not-accepted-entries .custom-item-tooltip-text-entries.item-readings {
    background: var(--maroon);
}

.custom-item-tooltip .custom-item-tooltip-text .custom-item-tooltip-text-not-accepted-entries .custom-item-tooltip-text-entries.item-meanings {
    background: var(--black);
}

.custom-item-tooltip .custom-item-tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--transparent-black) transparent transparent transparent;
}

.custom-item-tooltip:hover .custom-item-tooltip-text {
    visibility: visible;
    opacity: 1;
}

/* Next review tooltip wrapper styles */
.custom-lessons-and-reviews-summary-tooltip.future-reviews {
    display: none;
    background-color: var(--transparent-black);
    color: var(--white);
    text-align: center;
    border-radius: 5px;
    position: absolute;
    z-index: 1;
    right: 110px;
}

.custom-lessons-and-reviews-summary-tooltip.future-reviews::after {
    content: "";
    position: absolute;
    top: 60px;
    left: 0;
    margin-left: -20px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent var(--transparent-black) transparent transparent;
}

/* Next review tooltip content styles */
.custom-lessons-and-reviews-summary-tooltip.future-reviews .custom-lessons-and-reviews-summary.future-review-summary {
    width: auto;
    background: var(--purple);
    border-radius: 5px;
    border: none;
    margin: 10px;
    padding: 10px;
}

.custom-lessons-and-reviews-summary-tooltip.future-reviews .custom-lessons-and-reviews-summary.future-review-summary > h2 {
    margin: 0 0 5px 0;
    font-size: 20px;
    line-height: 15px;
}

.custom-lessons-and-reviews-summary-tooltip.future-reviews .custom-lessons-and-reviews-summary.future-review-summary > span {
    margin: 0;
    font-size: 12px;
    line-height: 10px;
}
`;

// ANCHOR wl-wanikani-custom-dashboard.user.css
const wlWanikaniCustomDashboardCss = `
/********************************
 *  Progress summary gradients
 ********************************/
.custom-dashboard-progress .custom-dashboard-progress-summary.apprentice-summary {
    background: linear-gradient(to right, var(--transparent-pink), var(--transparent-purple));
}

.custom-dashboard-progress .custom-dashboard-progress-summary.guru-summary {
    background: linear-gradient(to right, var(--transparent-purple), var(--transparent-dark-blue));
}

.custom-dashboard-progress .custom-dashboard-progress-summary.master-summary {
    background: linear-gradient(to right, var(--transparent-dark-blue), var(--transparent-light-blue));
}

.custom-dashboard-progress .custom-dashboard-progress-summary.enlightened-summary {
    background: linear-gradient(to right, var(--transparent-light-blue), var(--transparent-gold));
}

.custom-dashboard-progress .custom-dashboard-progress-summary.burned-summary {
    background: linear-gradient(to right, var(--transparent-gold), var(--transparent-maroon));
}

.custom-lessons-and-reviews .custom-lessons-and-reviews-summary.lessons-summary {
    background: linear-gradient(to right, var(--transparent-lesson-colour), var(--transparent-review-colour));
}

.custom-lessons-and-reviews .custom-lessons-and-reviews-summary.reviews-summary {
    background: linear-gradient(to right, var(--transparent-review-colour), var(--transparent-dark-green));
}

.custom-lessons-and-reviews .custom-lessons-and-reviews-summary.totals-summary {
    background: linear-gradient(to right, var(--transparent-dark-green), var(--transparent-purple));
}

.custom-lessons-and-reviews .custom-lessons-and-reviews-summary.next-review-summary {
    background: linear-gradient(to right, var(--transparent-purple), var(--transparent-maroon));
}

/********************************
 *  Custom section and summary styles
 ********************************/
/* Green circle for completed/empty sections */
.all-done .progress-entries:after,
.all-done.custom-div:after {
    content: '';
    position: relative;
    left: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid var(--green);
    border-radius: 50%;
}

/* Main custom section styles */
.custom-section {
    display: flex;
    background: var(--grey);
    border: var(--dark-grey) 1px solid;
    border-radius: 5px;
    box-shadow: inset 0 0 10px var(--dark-grey);
}

/* Custom summary styles */
.custom-summary {
    position: relative;
    padding: 15px;
    width: calc(100%/3);
}

.custom-summary:not(:last-child) {
    border-right: var(--dark-grey) 1px solid;
}

.custom-summary > h2 {
    font-size: 20px;
    font-weight: normal;
    line-height: 20px;
}

.custom-summary > span {
    display: inline-block;
    font-size: 15px;
    line-height: 25px;
    margin-bottom: 3px;
}

.custom-summary > span.custom-summary-vocabulary {
    margin-bottom: 50px;
}

/* Custom summary button styles */
.custom-summary > .custom-button {
    display: block;
    position: absolute;
    width: calc(100% - 50px);
    bottom: 15px;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    font-size: 15px;
    color: var(--white);
}

.custom-summary > .custom-button:hover {
    color: var(--white);
    text-decoration: none;
}

.custom-summary.custom-dashboard-progress-summary > h2 {
    font-size: 19px;
}

.custom-summary > .custom-button.custom-progress-summary-button {
    background: var(--dark-grey);
    border: 1px solid var(--dark-grey);
}

.custom-summary > .custom-button.custom-progress-summary-button.selected {
    background: var(--green);
    border: 1px solid var(--black);
}

.custom-summary > .custom-button.custom-progress-summary-button:hover,
.custom-summary > .custom-button.custom-progress-summary-button.selected:hover {
    background: var(--dark-green);
    transition: 0.5s;
    cursor: pointer;
}

/********************************
 *  Level progress styles
 ********************************/
/* Level progress indictor ring styles */
.level-progress-indicator {
    position: absolute;
    margin-top: 35px;
}

.level-progress-indicator > span {
    position: absolute;
    width: 31px;
    margin-top: 20px;
    margin-left: 15px;
    font-size: 10px;
    text-align: center;
}

.level-progress-indicator .progress-ring .progress-ring-circle {
    transition: 0.35s stroke-dashoffset;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke: var(--lesson-colour);
}

.level-progress-indicator .progress-ring .progress-ring-circle-track {
    stroke: var(--grey);
}

/* Level progress entry and div styles */
.custom-div.progress-entries {
    width: 100%;
    padding: 0 10px 20px 10px;
}

.custom-div.border-bottom {
    border-bottom: var(--dark-grey) 1px solid;
}

.custom-div.kanji-in-progress .progress-entry:first-of-type {
    margin-left: 65px;
}

/* Dashboard loader */
.custom-dashboard-loader {
    color: var(--dark-grey);
    overflow: hidden;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    margin: 72px auto;
    position: relative;
    transform: translateZ(0);
    animation: loaderDots 1.7s infinite ease, loaderSpin 1.7s infinite ease;
    font-size: 90px;
}

/********************************
 *  Animations
 ********************************/
@keyframes loaderDots {
    0% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    5%,
    95% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
    10%,
    59% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.087em -0.825em 0 -0.42em, -0.173em -0.812em 0 -0.44em, -0.256em -0.789em 0 -0.46em, -0.297em -0.775em 0 -0.477em;
    }
    20% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.338em -0.758em 0 -0.42em, -0.555em -0.617em 0 -0.44em, -0.671em -0.488em 0 -0.46em, -0.749em -0.34em 0 -0.477em;
    }
    38% {
        box-shadow: 0 -0.83em 0 -0.4em, -0.377em -0.74em 0 -0.42em, -0.645em -0.522em 0 -0.44em, -0.775em -0.297em 0 -0.46em, -0.82em -0.09em 0 -0.477em;
    }
    100% {
        box-shadow: 0 -0.83em 0 -0.4em, 0 -0.83em 0 -0.42em, 0 -0.83em 0 -0.44em, 0 -0.83em 0 -0.46em, 0 -0.83em 0 -0.477em;
    }
}

@keyframes loaderSpin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
`;

/***************************
 * ANCHOR wl-wanikani-settings-dialog.user.css
 ***************************/
const wlWanikaniSettingsDialogStylesCss = `
/***************************
 * Custom styling for WaniKani Custom Dashboard settings
 ***************************/
#wkof_ds div[role="dialog"] {
    width: 30%;
    height: fit-content;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}

#wkof_ds #wkofs_wanikani_custom_dashboard #wanikani_custom_dashboard_translations_page .wcd-dialog-item {
    padding: 5px;
    background: var(--grey);
    border: 1px solid var(--light-grey);
    border-radius: 5px;
}

#wkof_ds #wkofs_wanikani_custom_dashboard #wanikani_custom_dashboard_translations_page .wcd-dialog-word {
    display: inline-block;
}
`;
// !SECTION CSS code


// SECTION wl-wanikani-common-functions.user.js

/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
const scriptName = 'Wanikani Custom Dashboard';
const scriptId = 'wanikani_custom_dashboard';


/*************************************************
 *  ANCHOR Common debugger function
 *************************************************/
// Only used to initialise variable for code in this file
let debugMode = false;

// Called from main userscript to set debug mode
function setWlWanikaniDebugMode(debugModeBoolean) {
    debugMode = debugModeBoolean;
};

// Actual debug function
function wlWanikaniDebug(debugMessage, debugItem = '') {
    if (debugMode) {
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
        srs_stage: 4
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
    let config = {
        script_id: scriptId,
        title: scriptName,
        content: {
            wanikani_custom_dashabord_tabset: {
                type: 'tabset',
                content: {
                    settings_page: {
                        type: 'page',
                        label: 'Settings',
                        hover_tip: 'Main WaniKani Custom Dashboard settings.',
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
                            }
                        }
                    },
                    translations_page: {
                        type: 'page',
                        label: 'Translations',
                        hover_tip: 'Having trouble with all the Japanese? Here are the translations!',
                        content: {
                            words_phrases_group: {
                                type: 'group',
                                label: 'Words',
                                content: {
                                    words_html: {
                                        type: 'html',
                                        html: '<div class="wcd-dialog-item wcd-dialog-word">授業</br>じゅぎょう</br>Lesson</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">復習</br>ふくしゅう</br>Review</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">漢字</br>かんじ</br>Kanji</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">部首</br>ぶしゅ</br>Radical</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">単語</br>たんご</br>Vocabulary</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見習</br>みんあらい</br>Apprentice</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">達人</br>たつじん</br>Guru</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">主人</br>しゅじん</br>Master</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">悟りを開いた</br>さとりをあいた</br>Enlightened</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">焼け</br>やけ</br>Burned</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見せて</br>みせて</br>Look at</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">音読み</br>おんよみ</br>Onyomi</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">訓読み</br>きんよみ</br>Kunyomi</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">名乗り</br>なのり</br>Nanori</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">苦労</br>くろう</br>Difficult</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">レベルすすむ</br>れべるすすむ</br>Level progress</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">漢字ロック</br>かんじろっく</br>Kanji locked</div>'
                                    }
                                }
                            },
                            sentences_phrases_group: {
                                type: 'group',
                                label: 'Sentences and phrases',
                                content: {
                                    sentences_phrases_html: {
                                        type: 'html',
                                        html: '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">漢字と部首と単語が合計'
                                            + '</br>かんじとぶしゅとたんごがごうけい'
                                            + '</br>Total number of kanji, radicals and vocabulary'
                                            + '</br>A general statement sentence.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">次の復習をなんでもない'
                                            + '</br>つぎのふくしゅをなんでもない'
                                            + '</br>No next review'
                                            + '</br>Highlights when there is no reviews available for the next 24 hours.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">午前__時の次の復習　・　午後__時の次の復習'
                                            + '</br>ごぜん__じのつぎのふくしゅ　・　ごご__じのつぎのふくしゅ'
                                            + '</br>Next review at __ am/pm'
                                            + '</br>These two statements are repeated with the hour that the review is due. 前（ぜん）is AM and 後（ご）is PM.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__を開始'
                                            + '</br>__をかいし'
                                            + '</br>__ start'
                                            + '</br>This phrase is repeated for both Lesson and Review section buttons.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__進行中'
                                            + '</br>__しんこうちゅう'
                                            + '</br>__ in progress'
                                            + '</br>This phrase is repeated for Kanji and Radicals in the current Level Progress section.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__合格'
                                            + '</br>__ごうかく'
                                            + '</br>__ passed'
                                            + '</br>This phrase is repeated for Kanji and Radicals in the current Level Progress section.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">君は__項目をあります!'
                                            + '</br>きみは__こうもくをあります'
                                            + '</br>You have __ items!'
                                            + '</br>This sentence is repeated when there are items to be looked at in all main sections.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">ごめんなさい, 君は__項目をありません.'
                                            + '</br>ごめんなさい、君は__こうもくをありません。'
                                            + "</br>Sorry, you don't have any __ items."
                                            + '</br>This sentence is repeated when there are no items to be looked at in any of the main sections.</div>'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        on_save: (() => {
            generateDifficultItemsSection(wkofItemsData.AllData);
        }),
        on_close: (() => {
            if ($('.custom-dialog-css').length > 0) {
                $('.custom-dialog-css').remove();
            }
        })
    };
    let dialog = new wkof.Settings(config);
    dialog.open();
    removeInlineCssFromSettingsDialog();
};


/*************************************************
 *  ANCHOR Removes inline styles from WaniKani Custom Dashboard dialog
 *************************************************/
function removeInlineCssFromSettingsDialog() {
    let elementsToRemoveInlineStylesFrom = {
        mainDialog: '#wkof_ds div[role="dialog"]',
        mainDialogContent: '#wkof_ds #wkofs_wanikani_custom_dashboard.ui-dialog .ui-dialog-content'
    };

    if ($('.custom-dialog-css').length == 0) {
        // TODO uncomment for release
        // const dialogCss = GM_getResourceText("DIALOG_CSS");
        // TODO for dev only
        const dialogCss = wlWanikaniSettingsDialogStylesCss;

        let style = document.createElement('style');

        style.innerHTML = dialogCss;
        style.className = 'custom-dialog-css';

        document.head.appendChild(style);
    }

    $.each(elementsToRemoveInlineStylesFrom, function (index) {
        $(elementsToRemoveInlineStylesFrom[index]).removeAttr('style');
    });
}
// !SECTION wl-wanikani-common-functions.user.js

// SECTION wl-wanikani-wkof-data-maniplators.user.js
/*************************************************
 *  ANCHOR Variable initialisation
 *************************************************/
// NOTE Global data variable
let wkofItemsData = {};

// NOTE Used for specific filtering configurations
const wanikaniSrsStages = {
    'locked': {'locked': -1 },
    'initiate': { 'initiate': 0 },
    'apprentice': {
        'apprentice1': 1,
        'apprentice2': 2,
        'apprentice3': 3,
        'apprentice4': 4
    },
    'guru': {
        'guru1': 5,
        'guru2': 6
    },
    'master': { 'master': 7 },
    'enlightened': { 'enlightened': 8 },
    'burned': { 'burned': 9 }
};


/*************************************************
 *  ANCHOR Difficult item filter
 *************************************************/
function isDifficult(dataItems) {
    wlWanikaniDebug('Check if difficult.', dataItems);
    
    let returnItems = []
    $.each(dataItems, function (index, dataItem) {
        if ("assignments" in dataItem) {
            if ((dataItem.data.level <= wkofItemsData.SafeLevel) && (dataItem.assignments.srs_stage <= wkof.settings[scriptId].srs_stage)) {
                returnItems.push(dataItem);
            }
        }
    });
    
    return returnItems;
};

// NOTE Sorts items based on level
function levelSort(itemsToSort) {
    return itemsToSort.sort(function(a, b) {
        return (a.data.level == b.data.level)
             ? a.assignments.srs_stage - b.assignments.srs_stage
             : a.data.level - b.data.level;
    });
};


/*************************************************
 *  ANCHOR Generate difficult items data object
 *************************************************/
function getDifficultItemsData(data) {
    wlWanikaniDebug('Getting difficult items.', data);

    wkofItemsData.SafeLevel = data.UsersData.data.level - wkof.settings[scriptId].safe_level;
    wkofItemsData.DifficultItems = isDifficult(data.ItemsData);
    wkofItemsData.DifficultItems = levelSort(wkofItemsData.DifficultItems);

    wlWanikaniDebug('Got difficult items, show data.', wkofItemsData);
    return wkofItemsData;
};


/*************************************************
 *  ANCHOR Generate kanji/radical/vocabulary subject data object
 *************************************************/
function getSubjectData(data, type, subjectIds = []) {
    wlWanikaniDebug('Retrieving ' + type + ' subject data.');

    let returnData = { kanji: new Array(), radical: new Array(), vocabulary: new Array() };
    let isLessonOrReview = false;
    let counter = 0;

    if (type == 'lesson') {
        isLessonOrReview = true;
        subjectIds = data.SummaryData.data.lessons[0].subject_ids;
    }
    else if (type == 'review') {
        isLessonOrReview = true;
        subjectIds = data.SummaryData.data.reviews[0].subject_ids;
    }
    else if (type == 'next-review') {
        isLessonOrReview = true;
    }

    $.each(data.ItemsData, function(index, dataItem) {
        if (isLessonOrReview) {
            if (Object.values(subjectIds).includes(dataItem.id)) {
                returnData[dataItem.object].push(dataItem);
                counter++;
            }
        }
        else {
            if ("assignments" in dataItem) {
                if (type == 'total') {
                    returnData[dataItem.object].push(dataItem);
                    counter++;
                }
                else {
                    if (Object.values(wanikaniSrsStages[type]).includes(dataItem.assignments.srs_stage)) {
                        returnData[dataItem.object].push(dataItem);
                        counter++;
                    }
                }
            }
        }
    })

    returnData.totalCount = counter;
    returnData.length = returnData.kanji.length + returnData.radical.length + returnData.vocabulary.length;
    returnData.kanji = (returnData.kanji.length > 0) ? levelSort(returnData.kanji) : [];
    returnData.radical = (returnData.radical.length > 0) ? levelSort(returnData.radical) : [];
    returnData.vocabulary = (returnData.vocabulary.length > 0) ? levelSort(returnData.vocabulary) : [];

    wlWanikaniDebug('Retrieved ' + type + ' subject data.', returnData);
    return returnData;
};


/*************************************************
 *  ANCHOR Generate next review data object
 *************************************************/
function getNextReviewTime(data) {
    wlWanikaniDebug('Getting next review data.', data);

    let nextReviewData = [];
    let summaryReviewsData = data.SummaryData.data.reviews;

    $.each(summaryReviewsData, function(index, nextReviewItem) {
        if (index != 0) {
            if (nextReviewItem.subject_ids.length > 0) {
                let nextReviewDataItem = {};
                let refreshValue = new Date(nextReviewItem.available_at).toLocaleTimeString([], { hour: '2-digit' });

                nextReviewDataItem.text = refreshValue.toLocaleLowerCase().includes('am')
                                        ? '午前' + refreshValue.toLocaleLowerCase().replace(' am', '時')
                                        : '午後' + refreshValue.toLocaleLowerCase().replace(' pm', '時');
                nextReviewDataItem.count = nextReviewItem.subject_ids.length;
                nextReviewDataItem.subjectIds = nextReviewItem.subject_ids;

                nextReviewData.push(nextReviewDataItem);
            }
        }
    });

    wlWanikaniDebug('Next review data.', nextReviewData);
    return nextReviewData;
};


/*************************************************
 *  ANCHOR Generate level progress data object
 *************************************************/
function getLevelProgress(data) {
    wlWanikaniDebug('Getting level progress data.');

    let progressData = {
        Kanji: {
            InProgress: new Array(),
            Passed: new Array(),
            Locked: new Array()
        },
        Radicals: {
            InProgress: new Array(),
            Passed: new Array()
        }
    };

    $.each(data.ItemsData, function(index, item) {
        if (item.data.level == data.UsersData.data.level) {
            if (item.object == 'kanji') {
                if ("assignments" in item) {
                    if (item.assignments.passed_at == null && item.assignments.unlocked_at != null) {
                        progressData.Kanji.InProgress.push(item);
                    }
                    else if (item.assignments.passed_at != null) {
                        progressData.Kanji.Passed.push(item);
                    }
                }
                else {
                    progressData.Kanji.Locked.push(item);
                }
            }
            else if (item.object == 'radical') {
                if ("assignments" in item) {
                    if (item.assignments.passed_at == null && item.assignments.unlocked_at != null) {
                        progressData.Radicals.InProgress.push(item);
                    }
                    else if (item.assignments.passed_at != null) {
                        progressData.Radicals.Passed.push(item);
                    }
                }
            }
        }
    });

    // NOTE Calculation for how many kanji are needed to pass the level
    progressData.KanjiToPass = Math.ceil(
        (progressData.Kanji.InProgress.length + progressData.Kanji.Passed.length + progressData.Kanji.Locked.length)
        * 0.9);

    wlWanikaniDebug('Level progress data.', progressData);
    return progressData;
};
// !SECTION wl-wanikani-wkof-data-maniplators.user.js

// SECTION wl-wanikani-html-generators.user.js
/*************************************************
 *  ANCHOR Get appropriate image or slug for a kanji/radical/vocabulary
 *  item provided
 *************************************************/
function itemsCharacterCallback (item){
    let itemsData = item.data;

    if (itemsData.characters != null) {
        return itemsData.characters;
    }
    else if (itemsData.character_images != null){
        return '<img class="radical-image" alt="' + itemsData.slug + '" src="https://cdn.wanikani.com/subjects/images/' + item.id + '-' + itemsData.slug + '-original.png"/>';
    }
    else {
        return itemsData.slug;
    }
};


/*************************************************
 *  ANCHOR Kanji/radical/vocabulary item meaning or reading filters
 *************************************************/
function isAccepted(item) {
    return item.accepted_answer == true;
};

function isNotAccepted(item) {
    return item.accepted_answer == false;
};


/*************************************************
 *  ANCHOR Custom item table HTML generator
 *************************************************/
function generateCustomItemsTableHTML(customItemsData, customClass, headerMessageType, customItemsHTML, headerCount = false) {
    wlWanikaniDebug('Generating custom items table (' + customClass + ') HTML with the following data.', customItemsData);

    let headerMessageCount = headerCount ? '（' + customItemsData.length + '）' : '';
    let headerMessage = (customItemsData.length == 0)
                        ? 'ごめんなさい, 君は' + headerMessageType + '項目をありません.'
                        : '君は' + headerMessageType + '項目をあります!' + headerMessageCount;

    let customTableHTML = `
        <div class="rounded ${ customClass } custom-items ${ customItemsHTML == '' ? 'all-done' : '' }">
            <section class="rounded bg-white p-3 -mx-3">
                <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${ headerMessage }</h2>
                <div class="progress-entries">
                    ${ customItemsHTML }
                </div>
            </section>
        </div>
    `;

    wlWanikaniDebug('Finished generating custom items (' + customClass + ') table.', customTableHTML);
    return customTableHTML;
};


/*************************************************
 *  ANCHOR Custom items HTML generator
 *************************************************/
function generateCustomItemsHTML(items, type = '') {
    wlWanikaniDebug('Generating custom items HTML.');

    let customItemsHTML = '';

    if (items.length > 0) {
        $.each(items, function(index, item) {
            let itemSrsLevel = '';
            let itemType = item.object;
            let customItemTooltipHTML = generateItemTooltipHTML(item);

            if ('assignments' in item) {
                itemSrsLevel = '<span class="progress-item-srs-level srs-level-' + item.assignments.srs_stage + '">' + item.assignments.srs_stage + '</span>';
            }

            customItemsHTML += `
                    <div class="custom-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ customItemTooltipHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon ${ type == 'locked' ? type : '' }" lang="ja">
                            <div>${ itemsCharacterCallback(item) }</div>
                            <span class="progress-item-level">${ item.data.level }</span>
                            ${ itemSrsLevel }
                        </a>
                    </div>
            `;
        });
    }

    wlWanikaniDebug('Generated the following custom items HTML.', customItemsHTML);
    return customItemsHTML;
};


/*************************************************
 *  ANCHOR Custom item tooltip wrapper HTML generator
 *************************************************/
function generateItemTooltipHTML(item) {
    let tooltipTextHTML = '';
    let acceptedItemReadings = item.object != 'radical' ? item.data.readings.filter(isAccepted) : {};
    let acceptedItemMeanings = item.data.meanings.filter(isAccepted);
    let notAcceptedItemReadings = item.object != 'radical' ? item.data.readings.filter(isNotAccepted) : {};
    let notAcceptedItemMeanings = item.data.meanings.filter(isNotAccepted);

    if (acceptedItemReadings.length > 0 || acceptedItemMeanings.length > 0 || notAcceptedItemReadings.length > 0 || notAcceptedItemMeanings.length > 0) {
        tooltipTextHTML += `
            <span class="custom-item-tooltip-text">
        `;

        tooltipTextHTML += generateTooltipMeaningReadingHTML(acceptedItemReadings, acceptedItemMeanings, 'accepted');
        tooltipTextHTML += generateTooltipMeaningReadingHTML(notAcceptedItemReadings, notAcceptedItemMeanings, 'not-accepted');

        tooltipTextHTML += `
            </span>
        `;
    }

    return tooltipTextHTML;
};


/*************************************************
 *  ANCHOR Custom item tooltip content HTML generator
 *************************************************/
function generateTooltipMeaningReadingHTML(itemReadings, itemMeanings, customClass) {
    let returnTooltipTextHTML = '';
    let itemReadingOnyomiTooltipItems = '';
    let itemReadingKunyomiTooltipItems = '';
    let itemReadingNanoriTooltipItems = '';
    let itemReadingOtherTooltipItems = '';
    let itemMeaningTooltipItems = '';

    if (itemReadings.length > 0 || itemMeanings.length > 0) {
        returnTooltipTextHTML += `
            <div class="custom-item-tooltip-text-${ customClass }-entries">
        `;

        if (itemReadings.length > 0) {
            let onyomiReadings = itemReadings.filter(function (item) { return item.type == 'onyomi'; });
            let kunyomiReadings = itemReadings.filter(function (item) { return item.type == 'kunyomi'; });
            let nanoriReadings = itemReadings.filter(function (item) { return item.type == 'nanori'; });
            let otherReadings = itemReadings.filter(function (item) { return !('type' in item); });

            $.each(onyomiReadings, function(index, reading) {
                itemReadingOnyomiTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(kunyomiReadings, function(index, reading) {
                itemReadingKunyomiTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(nanoriReadings, function(index, reading) {
                itemReadingNanoriTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(otherReadings, function(index, reading) {
                itemReadingOtherTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            if (itemReadingOnyomiTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings onyomi">音読み：${ itemReadingOnyomiTooltipItems }</div>
                `;
            }

            if (itemReadingKunyomiTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings kunyomi">訓読み：${ itemReadingKunyomiTooltipItems }</div>
                `;
            }

            if (itemReadingNanoriTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings nanori">名乗り：${ itemReadingNanoriTooltipItems }</div>
                `;
            }

            if (itemReadingOtherTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings vocabulary">単語：${ itemReadingOtherTooltipItems }</div>
                `;
            }
        }

        if (itemMeanings.length > 0) {
            $.each(itemMeanings, function(index, meaning) {
                itemMeaningTooltipItems += (index == 0 ? '' : ', ') + meaning.meaning;
            });

            returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-meanings">${ itemMeaningTooltipItems }</div>
            `;
        }

        returnTooltipTextHTML += `
            </div>
        `;
    }

    return returnTooltipTextHTML;
};


/*************************************************
 *  ANCHOR Custom summary HTML generator
 *************************************************/
function generateSummaryHTML(summaryData, htmlClasses, divHeaderText, hasButton = false, buttonClasses = '', buttonText = '') {
    wlWanikaniDebug('Generating summary HTML.');

    let buttonHTML = hasButton
    ? `
            <a class="custom-button ${ buttonClasses }">
                <span>${ buttonText }</span>
            </a>
    `
    : '';

    let summaryHTML = `
        <div class="custom-summary ${ htmlClasses }">
            <h2>${ divHeaderText }</h2>
            <span class="custom-summary-kanji">漢字（${ summaryData.kanji.length }）</span>
            <span class="custom-summary-radical">部首（${ summaryData.radical.length }）</span>
            <span class="custom-summary-vocabulary">単語（${ summaryData.vocabulary.length }）</span>
            ${ buttonHTML }
        </div>
    `;

    wlWanikaniDebug('Generated the following summary HTML.', summaryHTML);
    return summaryHTML;
};


/*************************************************
 *  ANCHOR Level progress circle HTML generator
 *************************************************/
function generateLevelProgressCircleHTML(data, size, thickness) {
    let levelProgressCircleHTML = `
        <div class="level-progress-indicator">
            <span>${ data.Kanji.Passed.length } / ${ data.KanjiToPass }</span>
            <svg
            class="progress-ring"
            width="${ size }"
            height="${ size }">
                <circle
                    class="progress-ring-circle-track"
                    stroke-width="${ thickness }"
                    fill="transparent"
                    r="${ (size / 2) - thickness }"
                    cx="${ size / 2 }"
                    cy="${ size / 2 }"/>
                <circle
                    class="progress-ring-circle"
                    stroke-width="${ thickness }"
                    fill="transparent"
                    r="${ (size / 2) - thickness }"
                    cx="${ size / 2 }"
                    cy="${ size / 2 }"/>
            </svg>
        </div>
    `;

    return levelProgressCircleHTML;
};


/*************************************************
 *  ANCHOR Next reviews summary HTML generator
 *************************************************/
function generateFutureReviewsHTML(data, nextReviewData) {
    wlWanikaniDebug('Generating future reviews HTML with the following data.', nextReviewData);

    let nextReviewHTMLData = [];
    let futureReviewsHTML = '';
    let returnHTML = [];

    // NOTE Caters for empty nextReviewData array for when there are no more reviews coming up
    if (!nextReviewData.length) {
        nextReviewData = [{ text: '', count: 0, subjectIds: [] }];
    }

    if (nextReviewData.length > 0) {
        $.each(nextReviewData, function(index, dataItem) {
            let nextReviewSummaryData = getSubjectData(data, 'next-review', dataItem.subjectIds);
            let nextReviewCustomClass = index == 0 ? 'next-review-summary' : 'future-review-summary';
            let nextReviewTotalCount = nextReviewSummaryData.totalCount >= 10000 ? '~' + (nextReviewSummaryData.totalCount / 1000).toFixed() + '千' : nextReviewSummaryData.totalCount;
            let nextReviewDataTitle = dataItem.text == ''
                                    ? '次の復習をなんでもない'
                                    : dataItem.text + 'の次の復習（' + nextReviewTotalCount + '）';
            nextReviewHTMLData.push(generateSummaryHTML(nextReviewSummaryData, 'custom-lessons-and-reviews-summary ' + nextReviewCustomClass, nextReviewDataTitle));
        });

        if (nextReviewData.length > 1) {
            futureReviewsHTML += `<span class="custom-lessons-and-reviews-summary-tooltip future-reviews">`;

            $.each(nextReviewHTMLData, function(index, htmlItem) {
                futureReviewsHTML += index > 0 ? htmlItem : '';
            });

            futureReviewsHTML += `</span>`;
        }

        returnHTML.nextReviewHTML = nextReviewHTMLData[0];
        returnHTML.futureReviewsHTML = futureReviewsHTML;
    }

    wlWanikaniDebug('Generated the following future reviews HTML.', returnHTML);
    return returnHTML;
};

/*************************************************
 *  ANCHOR Difficult Items Table HTML generator
 *************************************************/
function generateDifficultItemsSection(data,  insertAfterElement = '.custom-dashboard .custom-dashboard-progress-wrapper') {
    const difficultItemsClass = 'custom-dashboard-difficult-items';

    if ($('.' + difficultItemsClass).length > 0) {
        $('.' + difficultItemsClass).remove();
    }

    if (wkof.settings[scriptId].show_difficult_items) {
        let difficultItemsData = getDifficultItemsData(data);
        let difficultItemsHTML = generateCustomItemsHTML(difficultItemsData.DifficultItems, 'difficult');
        let difficultItemsTableHTML = generateCustomItemsTableHTML(difficultItemsData.DifficultItems, difficultItemsClass, '苦労', difficultItemsHTML, true);

        $(difficultItemsTableHTML).insertAfter(insertAfterElement);
    }
};
// !SECTION wl-wanikani-html-generators.user.js

// SECTION wl-wanikani-custom-dashboard.user.js
/*************************************************
 *  ANCHOR Generate custom dashboard wrapper
 *************************************************/
function generateDashboardWrapperHTML() {
    wlWanikaniDebug('Generating custom dashboard wrapper HTML.');

    // NOTE Generate custom dashboard wrapper HTML, empty div with 'row' class is for other script compatibility
    let dashboardWrapperHTML = `
        <div class="custom-dashboard">
            <div class="container">
                <div class="row">
                    <div class="span12">
                        <section class="custom-section custom-lessons-and-reviews progress-and-forecast"></section>
                        <div class="custom-dashboard-progress-wrapper srs-progress">
                            <section class="custom-section custom-dashboard-progress"></section>
                        </div>
                        <div class="row"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // NOTE Remove any existing custom dashboard just in case
    if ($('.custom-dashboard').length > 0) {
        $('.custom-dashboard').remove();
    }

    // NOTE Add custom dashboard wrapper to page
    $(dashboardWrapperHTML).insertAfter('.footer-adjustment .custom-dashboard-loader');

    wlWanikaniDebug('Generated the following custom dashboard wrapper HTML.', dashboardWrapperHTML);
};


/*************************************************
 *  ANCHOR Append custom dashboard content to wrapper
 *************************************************/
function appendDashboardContentHTML(data) {
    wlWanikaniDebug('Generating custom dashboard content HTML with the following data.', data);

    // NOTE Get level progress data and generate HTML for section
    let levelProgressData = getLevelProgress(data);
    let levelProgressCircleHTML = generateLevelProgressCircleHTML(levelProgressData, 60, 6);
    let levelProgressKanjiInProgressHTML = generateCustomItemsHTML(levelProgressData.Kanji.InProgress);
    let levelProgressRadicalsInProgressHTML = generateCustomItemsHTML(levelProgressData.Radicals.InProgress);
    let levelProgressKanjiPassedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Passed);
    let levelProgressRadicalsPassedHTML = generateCustomItemsHTML(levelProgressData.Radicals.Passed);
    let levelProgressKanjiLockedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Locked, 'locked');
    let levelProgressItemsHTML = `
        ${ levelProgressCircleHTML }
        <div class="progress-entries custom-div border-bottom kanji-in-progress ${ levelProgressKanjiInProgressHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-black text-left leading-none tracking-normal font-bold">漢字進行中</h2>
            ${ levelProgressKanjiInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-in-progress ${ levelProgressRadicalsInProgressHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-black text-left leading-none tracking-normal font-bold">部首進行中</h2>
            ${ levelProgressRadicalsInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom kanji-passed ${ levelProgressKanjiPassedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-black text-left leading-none tracking-normal font-bold">漢字合格</h2>
            ${ levelProgressKanjiPassedHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-passed ${ levelProgressRadicalsPassedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-black text-left leading-none tracking-normal font-bold">部首合格</h2>
            ${ levelProgressRadicalsPassedHTML }
        </div>
        <div class="progress-entries custom-div kanji-locked ${ levelProgressKanjiLockedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-black text-left leading-none tracking-normal font-bold">漢字ロック</h2>
            ${ levelProgressKanjiLockedHTML }
        </div>
    `;
    let levelProgressItemsTableHTML = generateCustomItemsTableHTML(levelProgressData, 'custom-dashboard-progress-items', 'レベルすすむ', levelProgressItemsHTML);

    // NOTE Get next review data and generate HTML for summary
    let nextReviewData = getNextReviewTime(data);
    let nextReviewsHTML = generateFutureReviewsHTML(data, nextReviewData);

    // NOTE Get lesson, review, and srs level data
    let lessonSummaryData = getSubjectData(data, 'lesson');
    let reviewSummaryData = getSubjectData(data, 'review');
    let apprenticeSummaryData = getSubjectData(data, 'apprentice');
    let guruSummaryData = getSubjectData(data, 'guru');
    let masterSummaryData = getSubjectData(data, 'master');
    let enlightenedSummaryData = getSubjectData(data, 'enlightened');
    let burnedSummaryData = getSubjectData(data, 'burned');

    // NOTE Get total kanji/radical/vocabulary data
    let totalSummaryData = getSubjectData(data, 'total');

    // NOTE Generate the custom items HTML for srs level summary and section
    let apprenticeSummaryItemsHTML = `${ generateCustomItemsHTML(apprenticeSummaryData.kanji) }${ generateCustomItemsHTML(apprenticeSummaryData.radical) }${ generateCustomItemsHTML(apprenticeSummaryData.vocabulary) }`;
    let guruSummaryItemsHTML = `${ generateCustomItemsHTML(guruSummaryData.kanji) }${ generateCustomItemsHTML(guruSummaryData.radical) }${ generateCustomItemsHTML(guruSummaryData.vocabulary) }`;
    let masterSummaryItemsHTML = `${ generateCustomItemsHTML(masterSummaryData.kanji) }${ generateCustomItemsHTML(masterSummaryData.radical) }${ generateCustomItemsHTML(masterSummaryData.vocabulary) }`;
    let enlightenedSummaryItemsHTML = `${ generateCustomItemsHTML(enlightenedSummaryData.kanji) }${ generateCustomItemsHTML(enlightenedSummaryData.radical) }${ generateCustomItemsHTML(enlightenedSummaryData.vocabulary) }`;
    let burnedSummaryItemsHTML = `${ generateCustomItemsHTML(burnedSummaryData.kanji) }${ generateCustomItemsHTML(burnedSummaryData.radical) }${ generateCustomItemsHTML(burnedSummaryData.vocabulary) }`;

    // NOTE Generate HTML for srs level section
    let apprenticeSummaryItemsTableHTML = generateCustomItemsTableHTML(apprenticeSummaryData, 'custom-dashboard-summary-items apprentice', '見習', apprenticeSummaryItemsHTML);
    let guruSummaryItemsTableHTML = generateCustomItemsTableHTML(guruSummaryData, 'custom-dashboard-summary-items guru', '達人', guruSummaryItemsHTML);
    let masterSummaryItemsTableHTML = generateCustomItemsTableHTML(masterSummaryData, 'custom-dashboard-summary-items master', '主人', masterSummaryItemsHTML);
    let enlightenedSummaryItemsTableHTML = generateCustomItemsTableHTML(enlightenedSummaryData, 'custom-dashboard-summary-items enlightened', '悟りを開いた', enlightenedSummaryItemsHTML);
    let burnedSummaryItemsTableHTML = generateCustomItemsTableHTML(burnedSummaryData, 'custom-dashboard-summary-items burned', '焼け', burnedSummaryItemsHTML);

    // NOTE Generate custom dashboard content HTML
    let customLessonsAndReviewsContent = `
        ${ generateSummaryHTML(lessonSummaryData, 'custom-lessons-and-reviews-summary lessons-summary', '授業（' + lessonSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button lessons-button', '授業を開始') }
        ${ generateSummaryHTML(reviewSummaryData, 'custom-lessons-and-reviews-summary reviews-summary', '復習（' + reviewSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button reviews-button', '復習を開始') }
        ${ generateSummaryHTML(totalSummaryData, 'custom-lessons-and-reviews-summary totals-summary', '漢字と部首と単語が合計') }
        ${ nextReviewsHTML.nextReviewHTML }
        ${ nextReviewsHTML.futureReviewsHTML }
    `;
    let enlightenedSummaryTotalCount = enlightenedSummaryData.totalCount >= 10000 ? '~' + (enlightenedSummaryData.totalCount / 1000).toFixed() + '千' : enlightenedSummaryData.totalCount;
    let customDashboardProgressContent = `
        ${ generateSummaryHTML(apprenticeSummaryData, 'custom-dashboard-progress-summary apprentice-summary', '見習（' + apprenticeSummaryData.totalCount + '）', true, 'custom-progress-summary-button apprentice', '見せて') }
        ${ generateSummaryHTML(guruSummaryData, 'custom-dashboard-progress-summary guru-summary', '達人（' + guruSummaryData.totalCount + '）', true, 'custom-progress-summary-button guru', '見せて') }
        ${ generateSummaryHTML(masterSummaryData, 'custom-dashboard-progress-summary master-summary', '主人（' + masterSummaryData.totalCount + '）', true, 'custom-progress-summary-button master', '見せて') }
        ${ generateSummaryHTML(enlightenedSummaryData, 'custom-dashboard-progress-summary enlightened-summary', '悟りを開いた（' + enlightenedSummaryTotalCount + '）', true, 'custom-progress-summary-button enlightened', '見せて') }
        ${ generateSummaryHTML(burnedSummaryData, 'custom-dashboard-progress-summary burned-summary', '焼け（' + burnedSummaryData.totalCount + '）', true, 'custom-progress-summary-button burned', '見せて') }
    `;
    let customDashboardProgressAfterContent = `
        ${ apprenticeSummaryItemsTableHTML }
        ${ guruSummaryItemsTableHTML }
        ${ masterSummaryItemsTableHTML }
        ${ enlightenedSummaryItemsTableHTML }
        ${ burnedSummaryItemsTableHTML }
    `;

    // NOTE Append custom dashboard content HTML to custom dashboard
    let customLessonsAndReviewsElement = $('.custom-dashboard .custom-section.custom-lessons-and-reviews');
    let customDashboardProgressWrapperElement = $('.custom-dashboard .custom-dashboard-progress-wrapper');
    let customDashboardProgressElement = $('.custom-dashboard .custom-dashboard-progress-wrapper .custom-section.custom-dashboard-progress');

    customLessonsAndReviewsElement.append(customLessonsAndReviewsContent);
    $(levelProgressItemsTableHTML).insertAfter(customLessonsAndReviewsElement);
    customDashboardProgressElement.append(customDashboardProgressContent);
    customDashboardProgressWrapperElement.append(customDashboardProgressAfterContent);

    // NOTE Load difficult items if enabled
    if (wkof.settings[scriptId].show_difficult_items) {
        generateDifficultItemsSection(data);
    }

    // NOTE Apply level progress circle, lesson/review and srs progress summary button effects, and next review tooltip hover
    setLevelProgressCircle((levelProgressData.Kanji.Passed.length / levelProgressData.KanjiToPass) * 100);
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.lessons-button', lessonSummaryData.totalCount, '/lesson/session', 'has-lessons');
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.reviews-button', reviewSummaryData.totalCount, '/review/start', 'has-reviews');
    setProgressSummaryButtonEffects();
    setFutureReviewsTooltip();

    wlWanikaniDebug('Generated all content HTML and appended to custom dashboard.');
};
// !SECTION wl-wanikani-custom-dashboard.user.js

// SECTION wl-wanikani-code-executor.user.js
(function () {
    /*************************************************
     *  ANCHOR Variable initialisation
     *************************************************/
    // Change this to turn debugging on
    const isDebug = true;

    // WKOF modules required
    const wkofSettingsModules = 'Menu, Settings';
    const wkofDataModules = 'Apiv2, ItemData';

    // General WKOF item data config
    const itemDataConfig = {
        wk_items: {
            options: {
                assignments: true,
                review_statistics: true
            },
            filters: {
                level: '1..+0'
            }
        }
    };


    /*************************************************
     *  ANCHOR Actual script execution code
     *************************************************/
    wkofInstallCheck();
    addStylesAndFunctions();
    dashboardLoader();
    generateDashboardWrapperHTML();

    wkof.include(wkofSettingsModules);
    wkof.ready(wkofSettingsModules)
        .then(loadWkofMenu)
        .then(loadWkofSettings);
    
    wkof.include(wkofDataModules);
    wkof.ready(wkofDataModules)
        .then(getWkofDataObject)
        .then(function(data) {
            wkofItemsData.AllData = data;
            setWlWanikaniDebugMode(isDebug);
            appendDashboardContentHTML(wkofItemsData.AllData);
            autoRefreshOnNextReviewHour(wkofItemsData.AllData.SummaryData);
            updateShortcutNavigation('lessons');
            updateShortcutNavigation('reviews');
            navShortcutReviewAndLessonButtonPulseEffect();
            dashboardLoader(true);
        });


    /*************************************************
     *   ANCHOR Retrieves CSS and JS code through GM and adds to page
     *************************************************/
    // TODO Uncomment for deploy
    // function addStyles(cssFileName) {
    //     const styleCss = GM_getResourceText(cssFileName);
    //     GM_addStyle(styleCss);
    // };

    // function addFunctions(jsFileName) {
    //     const functionJs = GM_getResourceText(jsFileName);

    //     let script = document.createElement('script');

    //     script.innerHTML = functionJs;
    //     script.type = 'text/javascript';
    //     script.className = 'custom-js';

    //     document.body.appendChild(script);
    // };

    // TODO Used only for dev
    function addStyles(styleCss) {
        GM_addStyle(styleCss);
    };


    /*************************************************
     *  ANCHOR Check if WKOF is installed
     *************************************************/
    function wkofInstallCheck() {
        if (!wkof) {
            let response = confirm(scriptName + ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
            if (response) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            };

            return;
        };
    };


    /*************************************************
     *  ANCHOR Get the primary WKOF data for all other functions
     *************************************************/
    async function getWkofDataObject() {
        console.log('Running WKOF data retrieval.');
        let getWkofData = {};

        getWkofData.UsersData = await wkof.Apiv2.fetch_endpoint('user');
        getWkofData.SummaryData = await wkof.Apiv2.fetch_endpoint('summary');
        getWkofData.ItemsData = await wkof.ItemData.get_items(itemDataConfig);

        console.log('WKOF data retrieval complete.');
        return getWkofData;
    };



    /*************************************************
     *  ANCHOR Execution function for adding CSS and JS code to page
     *  Done for simplicity since it's a simple function call
     *************************************************/
    // TODO Uncomment for deploy
    // function addStylesAndFunctions() {
    //     console.log('Running Add CSS and JS functions.');
    //     // Add styles
    //     addStyles("COMMON_CSS");
    //     addStyles("ITEMS_CSS");
    //     addStyles("DASHBOARD_CSS");

    //     // Add functions
    //     addFunctions("COMMON_JS");
    //     addFunctions("WKOF_DATA_JS");
    //     addFunctions("HTML_GEN_JS");
    //     addFunctions("DASHBOARD_JS");
    //     console.log('All Add CSS and JS functions have loaded.');
    // };
    // TODO Used only for dev
    function addStylesAndFunctions() {
        console.log('Running Add CSS and JS functions.');
        // Add styles
        addStyles(wlWanikaniCommonStylesCss);
        addStyles(wlWanikaniCustomItemsCss);
        addStyles(wlWanikaniCustomDashboardCss);

        // Functions don't need importing
        console.log('All Add CSS and JS functions have loaded.');
    };


    /*************************************************
     *  ANCHOR Add pulse effect to the lesson/review navigation shortcuts
     *************************************************/
    function navShortcutReviewAndLessonButtonPulseEffect() {
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--lessons > a', $('.navigation-shortcuts .navigation-shortcut--lessons > a > span').text(), '/lesson/session', 'has-lessons');
        addReviewAndLessonButtonPulseEffect('.navigation-shortcuts .navigation-shortcut--reviews > a', $('.navigation-shortcuts .navigation-shortcut--reviews > a > span').text(), '/review/start', 'has-reviews');
    };
})();
// !SECTION wl-wanikani-code-executor.user.js