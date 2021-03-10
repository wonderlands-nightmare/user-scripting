/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseMainSummaryComponent() {
    let lessonSummaryData = getSubjectData(wkofItemsData.AllData, 'lesson');
    let reviewSummaryData = getSubjectData(wkofItemsData.AllData, 'review');

    let totalSummaryData = getSubjectData(wkofItemsData.AllData, 'total');

    let nextReviewData = getNextReviewTime(wkofItemsData.AllData);
    let nextReviewsHTML = generateFutureReviewsHTML(wkofItemsData.AllData, nextReviewData);

    let mainSummaryHTML = `
        ${ generateSummaryHTML(lessonSummaryData, 'custom-lessons-and-reviews-summary lessons-summary', '授業（' + lessonSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button lessons-button', '授業を開始') }
        ${ generateSummaryHTML(reviewSummaryData, 'custom-lessons-and-reviews-summary reviews-summary', '復習（' + reviewSummaryData.totalCount + '）', true, 'custom-lessons-and-reviews-button reviews-button', '復習を開始') }
        ${ generateSummaryHTML(totalSummaryData, 'custom-lessons-and-reviews-summary totals-summary', '漢字と部首と単語が合計') }
        ${ nextReviewsHTML.nextReviewHTML }
        ${ nextReviewsHTML.futureReviewsHTML }
    `;

    wlWanikaniDebug('html', '==Main Summary: initialiseMainSummaryComponent== Generated the following Main Summary HTML:', { main_html: mainSummaryHTML });
    $('.dashboard .custom-section.custom-lessons-and-reviews').append(mainSummaryHTML);

    addReviewAndLessonButtonPulseEffect('.dashboard .custom-lessons-and-reviews-button.lessons-button', lessonSummaryData.totalCount, '/lesson/session', 'has-lessons');
    addReviewAndLessonButtonPulseEffect('.dashboard .custom-lessons-and-reviews-button.reviews-button', reviewSummaryData.totalCount, '/review/start', 'has-reviews');
    setFutureReviewsTooltip();
};


/*************************************************
 *  ANCHOR Next reviews summary HTML generator
 *************************************************/
function generateFutureReviewsHTML(data, nextReviewData) {
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

    wlWanikaniDebug('html', '==Main Summary: generateFutureReviewsHTML== Generated the following future reviews HTML:', { main_html: returnHTML });
    return returnHTML;
};


/*************************************************
 *  ANCHOR Add hover effect for Next Review summary to show reviews
 *  over the next 24hrs
 *************************************************/
function setFutureReviewsTooltip() {
    $('.dashboard .custom-lessons-and-reviews .custom-summary.custom-lessons-and-reviews-summary.next-review-summary').hover(
        function(){
            $('.dashboard .custom-lessons-and-reviews-summary-tooltip.future-reviews').show();
        },
        function(){
            $('.dashboard .custom-lessons-and-reviews-summary-tooltip.future-reviews').hide();
        }
    );
}


/*************************************************
 *  ANCHOR Generate next review data object
 *************************************************/
function getNextReviewTime(data) {
    wlWanikaniDebug('data', '==Main Summary: getNextReviewTime== Getting next review data.');

    let nextReviewData = [];
    let summaryReviewsData = data.SummaryData.data.reviews;

    $.each(summaryReviewsData, function(index, nextReviewItem) {
        if (index != 0) {
            if (nextReviewItem.subject_ids.length > 0) {
                let nextReviewDataItem = {};
                let refreshValue = new Date(nextReviewItem.available_at).toLocaleTimeString([], { hour: '2-digit' });
                refreshValue = refreshValue.toLocaleLowerCase();

                // Double ternary to cater for browsers using 24 hour time
                nextReviewDataItem.text = refreshValue.includes('am')
                                        ? '午前' + refreshValue.replace(' am', '時')
                                        : (refreshValue.includes('pm')
                                          ? '午後' + refreshValue.replace(' pm', '時')
                                          : refreshValue + '時'
                                        );
                nextReviewDataItem.count = nextReviewItem.subject_ids.length;
                nextReviewDataItem.subjectIds = nextReviewItem.subject_ids;

                nextReviewData.push(nextReviewDataItem);
            }
        }
        else {
            if (nextReviewItem.subject_ids.length > 0) {
                wkofItemsData.NextRevewItems.push(nextReviewItem.subject_ids);
            }
        }
    });

    if (nextReviewData[0].subjectIds.length > 0) {
        wkofItemsData.NextRevewItems.push(nextReviewData[0].subjectIds);
    }

    wlWanikaniDebug('data', '==Main Summary: getNextReviewTime== Got the following next review data:', nextReviewData);
    return nextReviewData;
};