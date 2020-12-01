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
async function generateDashboardHTML(data) {
    wlWanikaniDebug('Generating custom dashboard HTML with the following data.', data);

    let criticalItemsData = await getCriticalItemsData(data);
    let criticalItemsTableHTML = await generateCustomItemsTableHTML(criticalItemsData, 'custom-dashboard-critical-items');

    let nextReviewData = getNextReviewTime(data);
    
    let progressCheckerData = progresschecker(data);
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

    $(dashboardHTML).insertAfter('.footer-adjustment #search');
    
    wlWanikaniDebug('Generated the following custom dashboard HTML.', dashboardHTML);
};