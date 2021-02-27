/*************************************************
 *  ANCHOR Skip review/lesson summary after session functions
 *************************************************/
// NOTE Skip summary initialiser
 function skipReviewLessonSummary() {
    const skipSetting = wkof.settings[scriptId].skip_session_summary;
    skipAfterLessonSession(skipSetting);
    skipAfterReviewSession(skipSetting);
    skipSummaryOnHomeButtonClick(skipSetting);
};


// NOTE Add button to use after lesson session
function skipAfterLessonSession(skip) {
    let lessonButtonSet = $('#screen-lesson-done .btn-set');
    if (lessonButtonSet.length > 0) {
        if (lessonButtonSet.find('#lesson-skip-to-homepage') > 0) {
            lessonButtonSet.find('#lesson-skip-to-homepage').remove();
        }

        if (skip) {
            let skipLessonSummaryButton = `
                <li id="lesson-skip-to-homepage">
                    <a href="https://www.wanikani.com/dashboard">
                        <i class="icon-arrow-left dominant"></i>
                        Go to homepage
                </li>
            `;

            lessonButtonSet.append(skipLessonSummaryButton);
        }
    }
};


// NOTE Force URL redirect on button click once reviews are complete
function skipAfterReviewSession(skip) {
    if (skip) {
        $('#reviews #question #answer-form button').on('click.skipToHomepage', function() {
            if ($('#reviews #question #stats #available-count').text() == 0) {
                window.location = 'https://www.wanikani.com';
            }
        });
    }
    else {
        $('#reviews #question #answer-form button').off('click.skipToHomepage');
    }
};


// NOTE Change HREF on both session sets
function skipSummaryOnHomeButtonClick(skip) {
    let sessionHomeButton = $('#question #summary-button > a');
    if (sessionHomeButton.length > 0) {
        if (skip) {
            sessionHomeButton.attr('href', '/dashboard');
        }
        else {
            if (window.location.href.includes('review')) {
                sessionHomeButton.attr('href', '/review');
            }
            if (window.location.href.includes('lesson')) {
                sessionHomeButton.attr('href', '/lesson');
            }
        }
    }
};