/*************************************************
 *  ANCHOR Variable initilisation
 *************************************************/
let lessonSkipButtonCss = '';

/*************************************************
 *  ANCHOR Skip review/lesson summary after session functions
 *************************************************/
// NOTE Skip summary initialiser
 function skipReviewLessonSummary() {
    const skipSetting = wkof.settings[scriptId].skip_session_summary;
    addAdditionalStyles(skipSetting, 'skip-summary', lessonSkipButtonCss);
    skipAfterLessonSession(skipSetting);
    skipAfterReviewSession(skipSetting);
    skipSummaryOnHomeButtonClick(skipSetting);
};


function addAdditionalStyles(skip, type, cssText) {
    if ($('.custom-' + type + '-css').length > 0) {
        $('.custom-' + type + '-css').remove();
    }

    if (skip){
        if ($('.custom-' + type + '-css').length == 0) {
            let style = document.createElement('style');
    
            style.innerHTML = cssText;
            style.className = 'custom-' + type + '-css';
    
            document.head.appendChild(style);
        }
    }
}


// NOTE Add button to use after lesson session
function skipAfterLessonSession(skip) {
    let lessonQuizButton = $('#screen-quiz-ready .btn-set #quiz-ready-read-lessons');
    let lessonQuizButtonOriginalContent = `
        <i class="icon-arrow-left"></i>
        Need more time
    `;
    let lessonDoneForNowButton = $('#screen-lesson-ready .btn-set #lesson-ready-done');
    let lessonDoneForNowButtonOriginalContent = `
        <i class="icon-arrow-left"></i>
        I'm done for now
    `;
    let lessonDoneEndButton = $('#screen-lesson-done .btn-set #lesson-ready-end');
    let lessonDoneButtonOriginalContent = `
        <i class="icon-arrow-left dominant"></i>
        View summary
    `
    let newButtonContent = `
        <a class="lesson-skip-to-homepage" href="https://www.wanikani.com/dashboard">
            <i class="icon-arrow-left dominant"></i>
            Go to homepage
        </a>
    `;
    
    if (lessonQuizButton.length > 0) {
        if (skip) {
            lessonQuizButton.html(newButtonContent);
        }
        else {
            if (lessonQuizButton.find('.lesson-skip-to-homepage').length > 0) {
                lessonQuizButton.html(lessonQuizButtonOriginalContent);
            }
        }
    }

    if (lessonDoneForNowButton.length > 0) {
        if (skip) {
            lessonDoneForNowButton.html(newButtonContent);
        }
        else {
            if (lessonDoneForNowButton.find('.lesson-skip-to-homepage').length > 0) {
                lessonDoneForNowButton.html(lessonDoneForNowButtonOriginalContent);
            }
        }
    }

    if (lessonDoneEndButton.length > 0) {
        if (skip) {
            lessonDoneEndButton.html(newButtonContent);
        }
        else {
            if (lessonDoneEndButton.find('.lesson-skip-to-homepage').length > 0) {
                lessonDoneEndButton.html(lessonDoneButtonOriginalContent);
            }
        }
    }
};


// NOTE Force URL redirect on button click once reviews are complete
function skipAfterReviewSession(skip) {
    if (skip) {
        $('#reviews #question #answer-form button').on('click.skipToHomepage', () => {
            setTimeout(() => {
                if ($('#reviews #question #stats #available-count').text() == 0) {
                    window.location = 'https://www.wanikani.com';
                }
            }, 500);
        });
    }
    else {
        $('#reviews #question #answer-form button').off('click.skipToHomepage');
    }
};


// NOTE Change HREF on both session sets
function skipSummaryOnHomeButtonClick(skip) {
    let reviewSessionHomeButton = $('#question #summary-button > a');
    let lessonSessionHomeButton = $('#header-buttons a#summary-button');
    let newHref = '';
    let newTitle = '';
    
    if (skip) {
        newHref = '/dashboard';
        newTitle = 'Go to homepage';
    }
    else {
        newTitle = 'Go to summary page';
        if (window.location.href.includes('review')) {
            newHref = '/review';
        }
        if (window.location.href.includes('lesson')) {
            newHref = '/lesson';
        }
    }
    
    if (reviewSessionHomeButton.length > 0) {
        reviewSessionHomeButton.attr('href', newHref).attr('title', newTitle);
    }
    if (lessonSessionHomeButton.length > 0) {
        lessonSessionHomeButton.attr('href', newHref).attr('title', newTitle);
    }
};