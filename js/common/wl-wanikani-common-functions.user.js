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

// For dialog CSS since this file can't use GM
let wcdDialogCss = '';


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
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見習</br>みならい</br>Apprentice</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">達人</br>たつじん</br>Guru</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">主人</br>しゅじん</br>Master</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">悟りを開いた</br>さとりをひらいた</br>Enlightened</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">焼け</br>やけ</br>Burned</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見せて</br>みせて</br>Look at</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">音読み</br>おんよみ</br>Onyomi</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">訓読み</br>くんよみ</br>Kunyomi</div>'
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
        let style = document.createElement('style');

        style.innerHTML = wcdDialogCss;
        style.className = 'custom-dialog-css';

        document.head.appendChild(style);
    }

    $.each(elementsToRemoveInlineStylesFrom, function (index) {
        $(elementsToRemoveInlineStylesFrom[index]).removeAttr('style');
    });
}