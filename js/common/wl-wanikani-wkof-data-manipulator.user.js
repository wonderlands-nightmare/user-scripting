// ==UserScript==
// @name         WaniKani Custom Dashboard WKOF Data Manipulators
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
let wkofItemsData = {};

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
 *  Helper functions.
 *************************************************/
// Add code


/*************************************************
 *  Filter functions.
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

function criticalSort(itemsToSort) {
    return itemsToSort.sort(function(a, b) {
               return (a.critical_level == b.critical_level)
                   ? a.assignments.srs_stage - b.assignments.srs_stage
                   : b.critical_level - a.critical_level;
           });
}

function levelSort(itemsToSort) {
    return itemsToSort.sort(function(a, b) {
               return (a.data.level == b.data.level)
                   ? a.assignments.srs_stage - b.assignments.srs_stage
                   : a.data.level - b.data.level;
           });
}


/*************************************************
 *  Add Critical Items component to dashboard.
 *************************************************/
function getCriticalItemsData(items) {
    wlWanikaniDebug('Getting critical items.', items);
    
    wkofItemsData.SafeLevel = items.UsersData.data.level - 3;
    wkofItemsData.CustomItems = items.ItemsData.filter(isCritical);
    wkofItemsData.CustomItems = criticalSort(wkofItemsData.CustomItems);

    wlWanikaniDebug('Got critical items, show data.', wkofItemsData);
    return wkofItemsData;
}; 

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

function getNextReviewTime(data) {
    wlWanikaniDebug('Getting next review data.', data);

    let nextReviewData = [];
    let summaryReviewsData = data.SummaryData.data.reviews;

    $.each(summaryReviewsData, function(index, nextReviewItem) {
        if (index != 0) {
            if (nextReviewItem.subject_ids.length > 0) {
                let nextReviewDataItem = {};
                let refreshValue = new Date(nextReviewItem.available_at).toLocaleTimeString("en-AU", { timeZone: "Australia/Melbourne", hour: '2-digit' });
                nextReviewDataItem.text = refreshValue.includes('am') ? '午前' + refreshValue.replace(' am', '時') : '午後' + refreshValue.replace(' pm', '時');
                nextReviewDataItem.count = nextReviewItem.subject_ids.length;
                nextReviewDataItem.subjectIds = nextReviewItem.subject_ids;
                nextReviewData.push(nextReviewDataItem);
            }
        }
    });
    
    wlWanikaniDebug('Next review data.', nextReviewData);
    return nextReviewData;
};

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
                    else if (item.assignments.unlocked_at == null) {
                        progressData.Kanji.Locked.push(item);
                    }
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
    
    progressData.KanjiToPass = Math.ceil(
        (progressData.Kanji.InProgress.length + progressData.Kanji.Passed.length + progressData.Kanji.Locked.length)
        * 0.9);
    
    wlWanikaniDebug('Level progress data.', progressData);
    return progressData;
};