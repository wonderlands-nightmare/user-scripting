/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseLevelProgressComponent() {
    // NOTE Get level progress data and generate HTML for section
    let levelProgressData = getLevelProgress(wkofItemsData.AllData);
    let levelProgressCircleHTML = generateLevelProgressCircleHTML(levelProgressData, 60, 6);
    let levelProgressKanjiInProgressHTML = generateCustomItemsHTML(levelProgressData.Kanji.InProgress, 'kanji-in-progress');
    let levelProgressRadicalsInProgressHTML = generateCustomItemsHTML(levelProgressData.Radicals.InProgress, 'radicals-in-progress');
    let levelProgressKanjiPassedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Passed, 'kanji-passed');
    let levelProgressRadicalsPassedHTML = generateCustomItemsHTML(levelProgressData.Radicals.Passed, 'radicals-passed');
    let levelProgressKanjiLockedHTML = generateCustomItemsHTML(levelProgressData.Kanji.Locked, 'kanji-locked');
    let levelProgressItemsHTML = `
        ${ levelProgressCircleHTML }
        <div class="progress-entries custom-div border-bottom kanji-in-progress ${ levelProgressKanjiInProgressHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-left leading-none tracking-normal font-bold"${ getHoverTitle(translationText.phrases.items_in_progress.en_meaning.replace('__', translationText.words.kanji.en_meaning)) }>
                ${ translationText.phrases.items_in_progress.jp_kanji.replace('__', translationText.words.kanji.jp_kanji) }
            </h2>
            ${ levelProgressKanjiInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-in-progress ${ levelProgressRadicalsInProgressHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-left leading-none tracking-normal font-bold"${ getHoverTitle(translationText.phrases.items_in_progress.en_meaning.replace('__', translationText.words.radical.en_meaning)) }>
                ${ translationText.phrases.items_in_progress.jp_kanji.replace('__', translationText.words.radical.jp_kanji) }
            </h2>
            ${ levelProgressRadicalsInProgressHTML }
        </div>
        <div class="progress-entries custom-div border-bottom kanji-passed ${ levelProgressKanjiPassedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-left leading-none tracking-normal font-bold"${ getHoverTitle(translationText.phrases.items_passed.en_meaning.replace('__', translationText.words.kanji.en_meaning)) }>
                ${ translationText.phrases.items_passed.jp_kanji.replace('__', translationText.words.kanji.jp_kanji) }
            </h2>
            ${ levelProgressKanjiPassedHTML }
        </div>
        <div class="progress-entries custom-div border-bottom radicals-passed ${ levelProgressRadicalsPassedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-left leading-none tracking-normal font-bold"${ getHoverTitle(translationText.phrases.items_passed.en_meaning.replace('__', translationText.words.radical.en_meaning)) }>
                ${ translationText.phrases.items_passed.jp_kanji.replace('__', translationText.words.radical.jp_kanji) }
            </h2>
            ${ levelProgressRadicalsPassedHTML }
        </div>
        <div class="progress-entries custom-div kanji-locked ${ levelProgressKanjiLockedHTML == '' ? 'all-done' : '' }">
            <h2 class="progress-entry-header text-sm text-left leading-none tracking-normal font-bold"${ getHoverTitle(translationText.words.kanji_locked.en_meaning) }>
                ${ translationText.words.kanji_locked.jp_kanji }
            </h2>
            ${ levelProgressKanjiLockedHTML }
        </div>
    `;
    let levelProgressItemsTableHTML = generateCustomItemsTableHTML(levelProgressData
                                                                 , 'custom-dashboard-progress-items'
                                                                 , translationText.words.level_progress.jp_kanji
                                                                 , translationText.words.level_progress.en_meaning
                                                                 , levelProgressItemsHTML
                                                                 );

    wlWanikaniDebug('html', '==Level Progress: initialiseLevelProgressComponent== Generated the following Level Progress HTML', { main_html: levelProgressItemsTableHTML });
    if ($('.custom-dashboard-progress-items').length > 0) {
        $('.custom-dashboard-progress-items').remove();
    }
    $(levelProgressItemsTableHTML).insertAfter($('.dashboard .custom-section.custom-lessons-and-reviews'));

    setLevelProgressCircle((levelProgressData.Kanji.Passed.length / levelProgressData.KanjiToPass) * 100);
    readyToLevelUp(levelProgressData);
}


/*************************************************
 *  ANCHOR Level progress circle HTML generator
 *************************************************/
function generateLevelProgressCircleHTML(data, size, thickness) {
    let levelProgressCircleHTML = `
        <div class="level-progress-indicator">
            <span>${ data.Kanji.Passed.length } / ${ data.KanjiToPass }</span>
            <svg
            class="progress-ring"
            width="${ size }"
            height="${ size }">
                <circle
                    class="progress-ring-circle-track"
                    stroke-width="${ thickness }"
                    fill="transparent"
                    r="${ (size / 2) - thickness }"
                    cx="${ size / 2 }"
                    cy="${ size / 2 }"/>
                <circle
                    class="progress-ring-circle"
                    stroke-width="${ thickness }"
                    fill="transparent"
                    r="${ (size / 2) - thickness }"
                    cx="${ size / 2 }"
                    cy="${ size / 2 }"/>
            </svg>
        </div>
    `;

    wlWanikaniDebug('html', '==Level Progress: generateLevelProgressCircleHTML== Generated the following Level Progress circle HTML', { main_html: levelProgressCircleHTML });
    return levelProgressCircleHTML;
};


/*************************************************
 *  ANCHOR Set level progress indicator fill
 *************************************************/
function setLevelProgressCircle(percent) {
    let circle = $('.level-progress-indicator .progress-ring circle.progress-ring-circle');
    let circleObj = circle[0];
    let radius = circleObj.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;

    circleObj.style.strokeDasharray = `${circumference} ${circumference}`;
    circleObj.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - percent / 100 * circumference;
    circleObj.style.strokeDashoffset = offset;
    wlWanikaniDebug('data', '==Level Progress: setLevelProgressCircle== Circle object:', circleObj);
};


/*************************************************
 *  ANCHOR Generate level progress data object
 *************************************************/
function getLevelProgress(data) {
    wlWanikaniDebug('data', '==Level Progress: getLevelProgress== Getting level progress data with the following input data:', data);

    let progressData = {
        Kanji: {
            InProgress: new Array(),
            Passed: new Array(),
            Locked: new Array()
        },
        Radicals: {
            InProgress: new Array(),
            Passed: new Array()
        }
    };

    // NOTE Level Progress data assignment
    $.each(data.ItemsData, function(index, item) {
        if (item.data.level == data.UsersData.data.level) {
            if (item.object == 'kanji') {
                if ("assignments" in item) {
                    if (item.assignments.passed_at == null && item.assignments.unlocked_at != null) {
                        progressData.Kanji.InProgress.push(item);
                    }
                    else if (item.assignments.passed_at != null) {
                        progressData.Kanji.Passed.push(item);
                    }
                }
                else {
                    progressData.Kanji.Locked.push(item);
                }
            }
            else if (item.object == 'radical') {
                if ("assignments" in item) {
                    if (item.assignments.passed_at == null && item.assignments.unlocked_at != null) {
                        progressData.Radicals.InProgress.push(item);
                    }
                    else if (item.assignments.passed_at != null) {
                        progressData.Radicals.Passed.push(item);
                    }
                }
            }
        }
    });

    // NOTE Sorting items by SRS level
    progressData.Kanji.InProgress = (progressData.Kanji.InProgress.length > 0) ? itemLevelSort(progressData.Kanji.InProgress) : [];
    progressData.Kanji.Passed = (progressData.Kanji.Passed.length > 0) ? itemLevelSort(progressData.Kanji.Passed) : [];
    progressData.Radicals.InProgress = (progressData.Radicals.InProgress.length > 0) ? itemLevelSort(progressData.Radicals.InProgress) : [];
    progressData.Radicals.Passed = (progressData.Radicals.Passed.length > 0) ? itemLevelSort(progressData.Radicals.Passed) : [];

    // NOTE Calculation for how many kanji are needed to pass the level
    progressData.KanjiToPass = Math.ceil(
        (progressData.Kanji.InProgress.length + progressData.Kanji.Passed.length + progressData.Kanji.Locked.length)
        * 0.9);

    wlWanikaniDebug('data', '==Level Progress: getLevelProgress== Got the level progress data:', progressData);
    return progressData;
};


/*************************************************
 *  ANCHOR Set circle to pulse when ready to level up
 *************************************************/
function readyToLevelUp(levelData) {
    if (wkof.settings[scriptId].identify_level_up) {
        wlWanikaniDebug('data', '==Level Progress: readyToLevelUp== Starting with this data:', levelData);

        let levelCircle = $('.level-progress-indicator .progress-ring');
        let kanjiLeftToPass = levelData.KanjiToPass - levelData.Kanji.Passed.length;
        let kanjiInNextReview = 0;

        $.each(levelData.Kanji.InProgress, function(index, inProgressItem) {
            if (Object.values(wkofItemsData.NextRevewItems).includes(inProgressItem.id) && (inProgressItem.assignments.srs_stage == 4)) {
                kanjiInNextReview++;
            }
        });

        if (kanjiLeftToPass == kanjiInNextReview) {
            $(levelCircle).addClass('level-up');
        }
        else {
            $(levelCircle).removeClass('level-up');
        }

        wlWanikaniDebug('data', '==Level Progress: readyToLevelUp== Got the level up data:', { kanji_left_to_pass: kanjiLeftToPass, kanji_in_next_review: kanjiInNextReview });
    }
 };