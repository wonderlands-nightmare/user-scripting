// ==UserScript==
// @name         WaniKani Custom Dashboard WKOF Data Manipulators
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
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
 *  Add Critical Items component to dashboard.
 *************************************************/
function getSubjectData(data, type, subjectIds = []) {
    let returnData = {kanji: new Array(), radical: new Array(), vocabulary: new Array()};
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
                if (Object.values(wanikaniSrsStages[type]).includes(dataItem.assignments.srs_stage)) {
                    returnData[dataItem.object].push(dataItem);
                    counter++;
                }
            }
        }
    })

    returnData.totalCount = counter;
    console.log('returning data of '+type);
    console.log(returnData);

    return returnData;
}

function getNextReviewTime(data) {
    let nextRefreshData = [];
    let objHasReviewsIterator = 1;
    let objHasReviews = false;

    while (!objHasReviews) {
        if (data.SummaryData.data.reviews[objHasReviewsIterator].subject_ids.length > 0) {
            let refreshValue = new Date(data.SummaryData.data.reviews[objHasReviewsIterator].available_at).toLocaleTimeString("en-AU", { timeZone: "Australia/Melbourne", hour: '2-digit' });
            nextRefreshData.text = refreshValue.includes('am') ? '午前'+refreshValue.replace(' am', '時') : '午後'+refreshValue.replace(' pm', '時');
            nextRefreshData.count = data.SummaryData.data.reviews[objHasReviewsIterator].subject_ids.length;
            nextRefreshData.subjectIds = data.SummaryData.data.reviews[objHasReviewsIterator].subject_ids;
            objHasReviews = true;
        }
        else {
            objHasReviewsIterator++;
        }
    };
    
    console.log('next refresh data');
    console.log(nextRefreshData);

    return nextRefreshData;
};

function progresschecker(data) {
    console.log(data);
    //===
    let progressData = [];
    let arr = {};
    let newindex = 0;
    $.each(data.ItemsData, function(index, item) {
        if (item.object == 'kanji' && item.data.level == data.UsersData.data.level) {
            arr[newindex] = item;
            newindex++;
        }
    });
    console.log(arr);
    //===
    progressData.lessnum = data.SummaryData.data.lessons[0].subject_ids.length;
    progressData.revnum = data.SummaryData.data.reviews[0].subject_ids.length;
    progressData.passat = Math.ceil(Object.keys(arr).length * 0.9);
    //$.each(data.SummaryData.data.reviews, function(index, item) {
    //    if (item.available_at == data.SummaryData.data.next_reviews_at) {
    //        revnum = item.subject_ids.length;

    //    }
    //});
    //===
    console.log('=== Pass at ' + progressData.passat);
    console.log('=== Lessons ' + progressData.lessnum);
    console.log('=== Reviews ' + progressData.revnum);
    return progressData;
};