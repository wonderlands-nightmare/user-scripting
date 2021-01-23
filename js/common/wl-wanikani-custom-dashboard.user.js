// ==UserScript==
// @name         WaniKani Custom Dashboard Logic
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Generate custom dashboard wrapper
 *************************************************/
function generateDashboardWrapperHTML() {
    wlWanikaniDebug('Generating custom dashboard wrapper HTML.');

    // Generate custom dashboard wrapper HTML, empty div with 'row' class is for other script compatibility
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

    // Remove any existing custom dashboard just in case
    if ($('.custom-dashboard').length > 0) {
        $('.custom-dashboard').remove();
    }

    // Add custom dashboard wrapper to page
    $(dashboardWrapperHTML).insertAfter('.footer-adjustment .custom-dashboard-loader');
    
    wlWanikaniDebug('Generated the following custom dashboard wrapper HTML.', dashboardWrapperHTML);
};


/*************************************************
 *  Append custom dashboard content to wrapper
 *************************************************/
function appendDashboardContentHTML(data) {
    wlWanikaniDebug('Generating custom dashboard content HTML with the following data.', data);

    // Get critical items data and generate HTML for section
    let criticalItemsData = getCriticalItemsData(data);
    let criticalItemsHTML = generateCustomItemsHTML(criticalItemsData.CustomItems, 'critical');
    let criticalItemsTableHTML = generateCustomItemsTableHTML(criticalItemsData.CustomItems, 'custom-dashboard-critical-items', 'クリティカル', criticalItemsHTML, true);

    // Get level progress data and generate HTML for section
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

    // Get next review data and generate HTML for summary
    let nextReviewData = getNextReviewTime(data);
    let nextReviewsHTML = generateFutureReviewsHTML(data, nextReviewData);

    // Get lesson, review, and srs level data
    let lessonSummaryData = getSubjectData(data, 'lesson');
    let reviewSummaryData = getSubjectData(data, 'review');
    let apprenticeSummaryData = getSubjectData(data, 'apprentice');
    let guruSummaryData = getSubjectData(data, 'guru');
    let masterSummaryData = getSubjectData(data, 'master');
    let enlightenedSummaryData = getSubjectData(data, 'enlightened');
    let burnedSummaryData = getSubjectData(data, 'burned');

    // Get total kanji/radical/vocabulary data
    let totalSummaryData = getSubjectData(data, 'total');

    // Generate the custom items HTML for srs level summary and section
    let apprenticeSummaryItemsHTML = `${ generateCustomItemsHTML(apprenticeSummaryData.kanji) }${ generateCustomItemsHTML(apprenticeSummaryData.radical) }${ generateCustomItemsHTML(apprenticeSummaryData.vocabulary) }`;
    let guruSummaryItemsHTML = `${ generateCustomItemsHTML(guruSummaryData.kanji) }${ generateCustomItemsHTML(guruSummaryData.radical) }${ generateCustomItemsHTML(guruSummaryData.vocabulary) }`;
    let masterSummaryItemsHTML = `${ generateCustomItemsHTML(masterSummaryData.kanji) }${ generateCustomItemsHTML(masterSummaryData.radical) }${ generateCustomItemsHTML(masterSummaryData.vocabulary) }`;
    let enlightenedSummaryItemsHTML = `${ generateCustomItemsHTML(enlightenedSummaryData.kanji) }${ generateCustomItemsHTML(enlightenedSummaryData.radical) }${ generateCustomItemsHTML(enlightenedSummaryData.vocabulary) }`;
    let burnedSummaryItemsHTML = `${ generateCustomItemsHTML(burnedSummaryData.kanji) }${ generateCustomItemsHTML(burnedSummaryData.radical) }${ generateCustomItemsHTML(burnedSummaryData.vocabulary) }`;

    // Generate HTML for srs level section
    let apprenticeSummaryItemsTableHTML = generateCustomItemsTableHTML(apprenticeSummaryData, 'custom-dashboard-summary-items apprentice', '見習', apprenticeSummaryItemsHTML);
    let guruSummaryItemsTableHTML = generateCustomItemsTableHTML(guruSummaryData, 'custom-dashboard-summary-items guru', '達人', guruSummaryItemsHTML);
    let masterSummaryItemsTableHTML = generateCustomItemsTableHTML(masterSummaryData, 'custom-dashboard-summary-items master', '主人', masterSummaryItemsHTML);
    let enlightenedSummaryItemsTableHTML = generateCustomItemsTableHTML(enlightenedSummaryData, 'custom-dashboard-summary-items enlightened', '悟りを開いた', enlightenedSummaryItemsHTML);
    let burnedSummaryItemsTableHTML = generateCustomItemsTableHTML(burnedSummaryData, 'custom-dashboard-summary-items burned', '焼け', burnedSummaryItemsHTML);
    
    // Generate custom dashboard content HTML
    let customLessonsAndReviewsContent = `
        ${ generateSummaryHTML(lessonSummaryData, 'custom-lessons-and-reviews-summary lessons-summary', '授業（' + lessonSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button lessons-button', '授業を開始') }
        ${ generateSummaryHTML(reviewSummaryData, 'custom-lessons-and-reviews-summary reviews-summary', '復習（' + reviewSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button reviews-button', '復習を開始') }
        ${ generateSummaryHTML(totalSummaryData, 'custom-lessons-and-reviews-summary totals-summary', '漢字と部首と単語が合計') }
        ${ nextReviewsHTML.nextReviewHTML }
    `;
    let customLessonsAndReviewsAfterContent = `
        ${ nextReviewsHTML.futureReviewsHTML }
        ${ levelProgressItemsTableHTML }
    `;
    let customDashboardProgressContent = `
        ${ generateSummaryHTML(apprenticeSummaryData, 'custom-dashboard-progress-summary apprentice-summary', '見習（' + apprenticeSummaryData.totalCount + '）', true, 'custom-progress-summary-button apprentice', '見せて') }
        ${ generateSummaryHTML(guruSummaryData, 'custom-dashboard-progress-summary guru-summary', '達人（' + guruSummaryData.totalCount + '）', true, 'custom-progress-summary-button guru', '見せて') }
        ${ generateSummaryHTML(masterSummaryData, 'custom-dashboard-progress-summary master-summary', '主人（' + masterSummaryData.totalCount + '）', true, 'custom-progress-summary-button master', '見せて') }
        ${ generateSummaryHTML(enlightenedSummaryData, 'custom-dashboard-progress-summary enlightened-summary', '悟りを開いた（' + enlightenedSummaryData.totalCount + '）', true, 'custom-progress-summary-button enlightened', '見せて') }
        ${ generateSummaryHTML(burnedSummaryData, 'custom-dashboard-progress-summary burned-summary', '焼け（' + burnedSummaryData.totalCount + '）', true, 'custom-progress-summary-button burned', '見せて') }
    `;
    let customDashboardProgressAfterContent = `
        ${ apprenticeSummaryItemsTableHTML }
        ${ guruSummaryItemsTableHTML }
        ${ masterSummaryItemsTableHTML }
        ${ enlightenedSummaryItemsTableHTML }
        ${ burnedSummaryItemsTableHTML }
        ${ criticalItemsTableHTML }
    `;

    // Append custom dashboard content HTML to custom dashboard
    let customLessonsAndReviewsElement = $('.custom-dashboard .custom-section.custom-lessons-and-reviews');
    let customDashboardProgressWrapperElement = $('.custom-dashboard .custom-dashboard-progress-wrapper');
    let customDashboardProgressElement = $('.custom-dashboard .custom-dashboard-progress-wrapper .custom-section.custom-dashboard-progress');

    customLessonsAndReviewsElement.append(customLessonsAndReviewsContent);
    $(customLessonsAndReviewsAfterContent).insertAfter(customLessonsAndReviewsElement);
    customDashboardProgressElement.append(customDashboardProgressContent);
    customDashboardProgressWrapperElement.append(customDashboardProgressAfterContent);

    // Apply level progress circle, lesson/review and srs progress summary button effects, and next review tooltip hover
    setLevelProgressCircle((levelProgressData.Kanji.Passed.length / levelProgressData.KanjiToPass) * 100);
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.lessons-button', lessonSummaryData.totalCount, '/lesson/session', 'has-lessons');
    addReviewAndLessonButtonPulseEffect('.custom-dashboard .custom-lessons-and-reviews-button.reviews-button', reviewSummaryData.totalCount, '/review/start', 'has-reviews');
    setProgressSummaryButtonEffects();
    setFutureReviewsTooltip();
    
    wlWanikaniDebug('Generated all content HTML and appended to custom dashboard.');
};