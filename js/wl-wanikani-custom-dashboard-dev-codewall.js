// ==UserScript==
// @name         WaniKani Custom Dashboard - DEV
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  Development codewall for WaniKani Custom Dashboard.
// @author       Wonderland-Nightmares
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        GM_addStyle
// ==/UserScript==

// SECTION Javascript code
// SECTION wl-wanikani-code-executor.user.js
(function () {
    /*************************************************
     *  ANCHOR Variable initialisation
     *************************************************/
    // Change this to turn debugging on
    const isDebug = false;

    // WKOF modules required
    const wkofModules = 'Apiv2, ItemData';

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

    wkof.include(wkofModules);

    wkof.ready(wkofModules)
        .then(getWkofDataObject)
        .then(function(data) {
            setWlWanikaniDebugMode(isDebug);
            appendDashboardContentHTML(data);
            autoRefreshOnNextReviewHour(data.SummaryData);
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
    
    function addFunctions(functionJs) {
        let script = document.createElement('script');

        script.innerHTML = functionJs;
        script.type = 'text/javascript';
        script.className = 'custom-js';

        document.body.appendChild(script);
    };


    /*************************************************
     *  ANCHOR Check if WKOF is installed
     *************************************************/
    function wkofInstallCheck() {
        if (!wkof) {
            const script_name = 'Wanikani Custom Dashboard';
            let response = confirm(script_name + ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
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

// SECTION wl-wanikani-common-functions.user.js
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
 *  ANCHOR Critical item filter
 *************************************************/
function isCritical(item) {
    wlWanikaniDebug('Check if critical.');
    // 1 - appr1, 2 - appr2, 3 - appr3, 4 - appr4, 5 - guru1, 6 - guru2, 7 - mast, 8 - enli
    if ("assignments" in item) {
        const isLowerLevel = item.data.level <= wkofItemsData.SafeLevel ? true : false;
        const isApprentice = Object.values(wanikaniSrsStages.apprentice).includes(item.assignments.srs_stage);
        const itemCritical = isLowerLevel && isApprentice;

        if (itemCritical) {
            item.critical_level = (wkofItemsData.SafeLevel - item.data.level)/item.assignments.srs_stage;

            return item;
        }
    }
};


/*************************************************
 *  ANCHOR Sorting functions
 *************************************************/
// NOTE Sorts items based on critical level
function criticalSort(itemsToSort) {
    return itemsToSort.sort(function(a, b) {
               return (a.critical_level == b.critical_level)
                   ? a.assignments.srs_stage - b.assignments.srs_stage
                   : b.critical_level - a.critical_level;
           });
}

// NOTE Sorts items based on level
function levelSort(itemsToSort) {
    return itemsToSort.sort(function(a, b) {
               return (a.data.level == b.data.level)
                   ? a.assignments.srs_stage - b.assignments.srs_stage
                   : a.data.level - b.data.level;
           });
}


/*************************************************
 *  ANCHOR Generate critical items data object
 *  TODO Refactor or remove
 *************************************************/
function getCriticalItemsData(items) {
    wlWanikaniDebug('Getting critical items.', items);
    
    wkofItemsData.SafeLevel = items.UsersData.data.level - 3;
    wkofItemsData.CustomItems = items.ItemsData.filter(isCritical);
    wkofItemsData.CustomItems = criticalSort(wkofItemsData.CustomItems);

    wlWanikaniDebug('Got critical items, show data.', wkofItemsData);
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
                        ? 'ごめんなさい, 君は' + headerMessageType + 'ありません.'
                        : '君は' + headerMessageType + '項目あります!' + headerMessageCount;

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
            let itemAddedStyle = '';
            let itemSrsLevel = '';
            let itemType = item.object;
            let customItemTooltipHTML = generateItemTooltipHTML(item);

            if (type == 'critical') {
                if (item.critical_level > 0) {
                    itemAddedStyle = 'style="box-shadow: inset 0 0 ' + (item.critical_level * 25) + 'px black"';
                }
            }

            if ('assignments' in item) {
                itemSrsLevel = '<span class="progress-item-srs-level srs-level-' + item.assignments.srs_stage + '">' + item.assignments.srs_stage + '</span>';
            }

            customItemsHTML += `
                    <div class="custom-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ customItemTooltipHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon ${ type == 'locked' ? type : '' }" lang="ja" ${ itemAddedStyle }>
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

    // NOTE Get critical items data and generate HTML for section
    let criticalItemsData = getCriticalItemsData(data);
    let criticalItemsHTML = generateCustomItemsHTML(criticalItemsData.CustomItems, 'critical');
    let criticalItemsTableHTML = generateCustomItemsTableHTML(criticalItemsData.CustomItems, 'custom-dashboard-critical-items', 'クリティカル', criticalItemsHTML, true);

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
            ${ levelProgressKanjiInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-in-progress ${ levelProgressRadicalsInProgressHTML == '' ? 'all-done' : '' }">
            ${ levelProgressRadicalsInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom kanji-passed ${ levelProgressKanjiPassedHTML == '' ? 'all-done' : '' }">
            ${ levelProgressKanjiPassedHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-passed ${ levelProgressRadicalsPassedHTML == '' ? 'all-done' : '' }">
            ${ levelProgressRadicalsPassedHTML }
        </div>
        <div class="progress-entries custom-div kanji-locked ${ levelProgressKanjiLockedHTML == '' ? 'all-done' : '' }">
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
    $(criticalItemsTableHTML).insertAfter(customDashboardProgressWrapperElement);

    // NOTE Apply level progress circle, lesson/review and srs progress summary button effects, and next review tooltip hover
    setLevelProgressCircle((levelProgressData.Kanji.Passed.length / levelProgressData.KanjiToPass) * 100);
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.lessons-button', lessonSummaryData.totalCount, '/lesson/session', 'has-lessons');
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.reviews-button', reviewSummaryData.totalCount, '/review/start', 'has-reviews');
    setProgressSummaryButtonEffects();
    setFutureReviewsTooltip();
    
    wlWanikaniDebug('Generated all content HTML and appended to custom dashboard.');
};
// !SECTION wl-wanikani-custom-dashboard.user.js
// !SECTION Javascript code

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
    padding-top: 10px;
}

.level-progress-indicator > span {
    position: absolute;
    margin-top: 20px;
    margin-left: 15px;
    font-size: 10px;
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
    padding: 20px 10px;
}

.custom-div.border-bottom {
    border-bottom: var(--dark-grey) 1px solid;
}

.custom-div.kanji-in-progress .progress-entry:first-child {
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

// !SECTION CSS code