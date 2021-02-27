/*************************************************
 *  ANCHOR Skip review/lesson summary after session
 *************************************************/
function skipReviewLessonSummary() {
    if (wkof.settings[scriptId].skip_session_summary) {
        skipAfterLessonSession();
        skipSummaryOnHomeButtonClick();
    }
};

function skipAfterSession() {
    if ($('#screen-lesson-done .btn-set').length > 0) {
        console.log('adding skip button');
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

function skipSummaryOnHomeButtonClick() {
    let sessionHomeButton = $('#question #summary-button > a');
    if (sessionHomeButton.length > 0) {
        sessionHomeButton.attr('href', '/dashboard');
    }
};