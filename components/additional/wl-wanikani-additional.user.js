/*************************************************
 *  ANCHOR Skip review/lesson summary after session
 *************************************************/
function skipReviewLessonSummary() {
    const skipSetting = wkof.settings[scriptId].skip_session_summary;
    skipAfterLessonSession(skipSetting);
    skipAfterReviewSession(skipSetting);
    skipSummaryOnHomeButtonClick(skipSetting);
};

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

function skipAfterReviewSession(skip) {
    let reviewInputButton = $('#reviews #question #answer-form fieldset > button');
    if (reviewInputButton.length > 0) {
        if (skip) {
            reviewInputButton.attr('href', '/dashboard');
        }
        else {
            reviewInputButton.removeAttr('href');
        }
    }
};

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