/*************************************************
 *  ANCHOR Skip review/lesson summary after session
 *************************************************/
function skipReviewLessonSummary() {
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