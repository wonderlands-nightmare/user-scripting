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
        ${ generateSummaryHTML(lessonSummaryData
                             , 'custom-lessons-and-reviews-summary lessons-summary'
                             , translationText.words.lesson.jp_kanji + '（' + lessonSummaryData.totalCount + '）'
                             , [translationText.words.lesson, '（' + lessonSummaryData.totalCount + '）']
                             , true
                             , 'custom-lessons-and-reviews-button lessons-button'
                             , translationText.phrases.lesson_review_start.jp_kanji.replace('__', translationText.words.lesson.jp_kanji)
                             , [translationText.phrases.lesson_review_start, '', true, translationText.words.lesson]
        ) }
        ${ generateSummaryHTML(reviewSummaryData
                             , 'custom-lessons-and-reviews-summary reviews-summary'
                             , translationText.words.review.jp_kanji + '（' + reviewSummaryData.totalCount + '）'
                             , [translationText.words.review, '（' + reviewSummaryData.totalCount + '）']
                             , true
                             , 'custom-lessons-and-reviews-button reviews-button'
                             , translationText.phrases.lesson_review_start.jp_kanji.replace('__', translationText.words.review.jp_kanji)
                             , [translationText.phrases.lesson_review_start, '', true, translationText.words.review]
        ) }
        ${ generateSummaryHTML(totalSummaryData
                             , 'custom-lessons-and-reviews-summary totals-summary'
                             , translationText.phrases.totals_summary.jp_kanji
                             , [translationText.phrases.totals_summary]
        ) }
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
            let nextReviewDataHeader = dataItem.text == ''
                                     ? translationText.phrases.no_next_review.jp_kanji
                                     : translationText.phrases.next_review.jp_kanji.replace('__', dataItem.text)  + '（' + nextReviewTotalCount + '）';
            let nextReviewDataHeaderHoverText = dataItem.text == ''
                                              ? [translationText.phrases.no_next_review]
                                              : [translationText.phrases.next_review, '（' + nextReviewTotalCount + '）', true, dataItem.hoverText];
            nextReviewHTMLData.push(generateSummaryHTML(nextReviewSummaryData
                                                      , 'custom-lessons-and-reviews-summary ' + nextReviewCustomClass
                                                      , nextReviewDataHeader
                                                      , nextReviewDataHeaderHoverText
                                    ));
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
                let nextReviewDataItem = {
                    timePrefix: '',
                    timeValue: '',
                    text: '',
                    hoverText: {
                        en_meaning: '',
                        jp_reading: ''
                    },
                    count = '',
                    subjectIds = new Array()
                };
                let refreshValue = new Date(nextReviewItem.available_at).toLocaleTimeString([], { hour: '2-digit' });
                refreshValue = refreshValue.toLocaleLowerCase();

                // Double ternary to cater for browsers using 24 hour time
                nextReviewDataItem.timePrefix = refreshValue.includes('am')
                                              ? translationText.words.am
                                              : (refreshValue.includes('pm')
                                                ? translationText.words.pm
                                                : ''
                                              );
                nextReviewDataItem.timeValue = refreshValue.includes('am')
                                             ? refreshValue.replace(' am', '')
                                             : (refreshValue.includes('pm')
                                               ? refreshValue.replace(' pm', '')
                                               : refreshValue
                                             );
                nextReviewDataItem.text = nextReviewDataItem.timePrefix == ''
                                        ? nextReviewDataItem.timeValue
                                        : nextReviewDataItem.timePrefix.jp_kanji.replace('__', nextReviewDataItem.timeValue);
                nextReviewDataItem.hoverText.en_meaning = nextReviewDataItem.timePrefix.en_meaning.replace('__', nextReviewDataItem.timeValue);
                nextReviewDataItem.hoverText.jp_reading = nextReviewDataItem.timePrefix.jp_reading.replace('__', nextReviewDataItem.timeValue);
                nextReviewDataItem.count = nextReviewItem.subject_ids.length;
                nextReviewDataItem.subjectIds = nextReviewItem.subject_ids;

                nextReviewData.push(nextReviewDataItem);
            }
        }
        else {
            if (nextReviewItem.subject_ids.length > 0) {
                wkofItemsData.NextRevewItems = wkofItemsData.NextRevewItems.concat(nextReviewItem.subject_ids);
            }
        }
    });

    if (nextReviewData[0].subjectIds.length > 0) {
        wkofItemsData.NextRevewItems = wkofItemsData.NextRevewItems.concat(nextReviewData[0].subjectIds);
    }

    wlWanikaniDebug('data', '==Main Summary: getNextReviewTime== Got the following next review data:', nextReviewData);
    return nextReviewData;
};