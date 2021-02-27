/*************************************************
 *  ANCHOR Skip review/lesson summary after session
 *************************************************/
function skipReviewLessonSummary() {
    if (wkof.settings[scriptId].skip_session_summary) {
        skipAfterLessonSession();
        skipAfterReviewSession();
        skipSummaryOnHomeButtonClick();
    }
};

function skipAfterLessonSession() {
    if ($('#screen-lesson-done .btn-set').length > 0) {
        let skipLessonSummaryButton = `
            <li id="lesson-skip-to-homepage">
                <a href="https://www.wanikani.com/dashboard">
                    <i class="icon-arrow-left dominant"></i>
                    Go to homepage
            </li>
        `;

        $('#screen-lesson-done .btn-set').append(skipLessonSummaryButton);
    }
};

function skipAfterReviewSession() {
    let reviewInputButton = $('#reviews #question #answer-form fieldset > button');
    if (reviewInputButton.length > 0) {
        reviewInputButton.attr('href', '/dashboard');
    }
};

function skipSummaryOnHomeButtonClick() {
    let sessionHomeButton = $('#question #summary-button > a');
    if (sessionHomeButton.length > 0) {
        sessionHomeButton.attr('href', '/dashboard');
    }
};