// ==UserScript==
// @name         WaniKani Custom Dashboard Logic
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
// Add code


/*************************************************
 *  Add Custom Dashboard.
 *************************************************/
function generateDashboardHTML(data) {
    wlWanikaniDebug('Generating custom dashboard HTML with the following data.', data);

    let criticalItemsData = getCriticalItemsData(data);
    let criticalItemsHTML = generateCustomItemsHTML(criticalItemsData.CustomItems, 'critical');
    let criticalItemsTableHTML = generateCustomItemsTableHTML(criticalItemsData, 'custom-dashboard-critical-items', 'critical', criticalItemsHTML);

    let levelProgressData = getLevelProgress(data);
    let levelProgressCircleHTML = generateLevelProgressCircleHTML(levelProgressData, 60, 6);
    let levelProgressKanjiInProgressHTML = generateCustomItemsHTML(levelProgressData.Kanji.InProgress);
    let levelProgressRadicalsInProgressHTML = generateCustomItemsHTML(levelProgressData.Radicals.InProgress);
    let levelProgressKanjiPassedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Passed);
    let levelProgressRadicalsPassedHTML = generateCustomItemsHTML(levelProgressData.Radicals.Passed);
    let levelProgressKanjiLockedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Locked);
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
    let levelProgressItemsTableHTML = generateCustomItemsTableHTML(levelProgressData, 'custom-dashboard-progress-items', 'level progress', levelProgressItemsHTML);

    let nextReviewData = getNextReviewTime(data);
    
    let lessonSummaryData = getSubjectData(data, 'lesson');
    let reviewSummaryData = getSubjectData(data, 'review');
    let nextReviewSummaryData = getSubjectData(data, 'next-review', nextReviewData.subjectIds);
    let apprenticeSummaryData = getSubjectData(data, 'apprentice');
    let guruSummaryData = getSubjectData(data, 'guru');
    let masterSummaryData = getSubjectData(data, 'master');
    let enlightenedSummaryData = getSubjectData(data, 'enlightened');
    let burnedSummaryData = getSubjectData(data, 'burned');
    

    let dashboardHTML = `
        <div class="custom-dashboard">
            <div class="container">
                <div class="row">
                    <div class="span12">
                        <section class="custom-section custom-lessons-and-reviews">
                            ${ generateSummaryHTML(lessonSummaryData, 'custom-lessons-and-reviews-summary lessons-summary', '授業（' + lessonSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button lessons-button', '授業を開始') }
                            ${ generateSummaryHTML(reviewSummaryData, 'custom-lessons-and-reviews-summary reviews-summary', '復習（' + reviewSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button reviews-button', '復習を開始') }
                            ${ generateSummaryHTML(nextReviewSummaryData, 'custom-lessons-and-reviews-summary next-review-summary', nextReviewData.text +'の次の復習（' + nextReviewSummaryData.totalCount + '）') }
                        </section>
                        ${ levelProgressItemsTableHTML }
                        <section class="custom-section custom-dashboard-progress">
                            ${ generateSummaryHTML(apprenticeSummaryData, 'custom-dashboard-progress-summary apprentice-summary', '見習（' + apprenticeSummaryData.totalCount + '）') }
                            ${ generateSummaryHTML(guruSummaryData, 'custom-dashboard-progress-summary guru-summary', '達人（' + guruSummaryData.totalCount + '）') }
                            ${ generateSummaryHTML(masterSummaryData, 'custom-dashboard-progress-summary master-summary', '主人（' + masterSummaryData.totalCount + '）') }
                            ${ generateSummaryHTML(enlightenedSummaryData, 'custom-dashboard-progress-summary enlightened-summary', '悟りを開いた（' + enlightenedSummaryData.totalCount + '）') }
                            ${ generateSummaryHTML(burnedSummaryData, 'custom-dashboard-progress-summary burned-summary', '焼け（' + burnedSummaryData.totalCount + '）') }
                        </section>
                        ${ criticalItemsTableHTML }
                    </div>
                </div>
            </div>
        </div>
    `;

    if ($('.custom-dashboard').length > 0) {
        $('.custom-dashboard').remove();
    }

    $(dashboardHTML).insertAfter('.footer-adjustment .custom-dashboard-loader');

    setLevelProgressCircle((levelProgressData.Kanji.Passed.length / levelProgressData.KanjiToPass) * 100);
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.lessons-button', lessonSummaryData.totalCount, '/lesson/session', 'has-lessons');
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.reviews-button', reviewSummaryData.totalCount, '/review/start', 'has-reviews');
    
    wlWanikaniDebug('Generated the following custom dashboard HTML.', dashboardHTML);
};

function dashboardLoader(loaded = false) {
    const loaderClass = 'custom-dashboard-loader'
    if (loaded) {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }

        if ($('.dashboard').length > 0) {
            $('.dashboard').remove();
        }
    }
    else {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }

        $('<div class="' + loaderClass + '"></div>').insertAfter('.footer-adjustment #search');
    }
}