// ==UserScript==
// @name         WaniKani Custom Dashboard HTML Generators
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  ANCHOR Get appropriate image or slug for a kanji/radical/vocabulary
 *  item provided
 *************************************************/
function itemsCharacterCallback (item){
    let itemsData = item.data;

    if (itemsData.characters != null) {
        return itemsData.characters;
    }
    else if (itemsData.character_images != null){
        return '<img class="radical-image" alt="' + itemsData.slug + '" src="https://cdn.wanikani.com/subjects/images/' + item.id + '-' + itemsData.slug + '-original.png"/>';
    }
    else {
        return itemsData.slug;
    }
};


/*************************************************
 *  ANCHOR Kanji/radical/vocabulary item meaning or reading filters
 *************************************************/
function isAccepted(item) {
    return item.accepted_answer == true;
};

function isNotAccepted(item) {
    return item.accepted_answer == false;
};


/*************************************************
 *  ANCHOR Custom item table HTML generator
 *************************************************/
function generateCustomItemsTableHTML(customItemsData, customClass, headerMessageType, customItemsHTML, headerCount = false) {
    wlWanikaniDebug('Generating custom items table (' + customClass + ') HTML with the following data.', customItemsData);

    let headerMessageCount = headerCount ? '（' + customItemsData.length + '）' : '';
    let headerMessage = (customItemsData.length == 0)
                        ? 'ごめんなさい, 君は' + headerMessageType + '項目をありません.'
                        : '君は' + headerMessageType + '項目をあります!' + headerMessageCount;

    let customTableHTML = `
        <div class="rounded ${ customClass } custom-items ${ customItemsHTML == '' ? 'all-done' : '' }">
            <section class="rounded bg-white p-3 -mx-3">
                <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${ headerMessage }</h2>
                <div class="progress-entries">
                    ${ customItemsHTML }
                </div>
            </section>
        </div>
    `;

    wlWanikaniDebug('Finished generating custom items (' + customClass + ') table.', customTableHTML);
    return customTableHTML;
};


/*************************************************
 *  ANCHOR Custom items HTML generator
 *************************************************/
function generateCustomItemsHTML(items, type = '') {
    wlWanikaniDebug('Generating custom items HTML.');

    let customItemsHTML = '';

    if (items.length > 0) {
        $.each(items, function(index, item) {
            let itemSrsLevel = '';
            let itemType = item.object;
            let customItemTooltipHTML = generateItemTooltipHTML(item);

            if ('assignments' in item) {
                itemSrsLevel = '<span class="progress-item-srs-level srs-level-' + item.assignments.srs_stage + '">' + item.assignments.srs_stage + '</span>';
            }

            customItemsHTML += `
                    <div class="custom-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ customItemTooltipHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon ${ type == 'locked' ? type : '' }" lang="ja">
                            <div>${ itemsCharacterCallback(item) }</div>
                            <span class="progress-item-level">${ item.data.level }</span>
                            ${ itemSrsLevel }
                        </a>
                    </div>
            `;
        });
    }

    wlWanikaniDebug('Generated the following custom items HTML.', customItemsHTML);
    return customItemsHTML;
};


/*************************************************
 *  ANCHOR Custom item tooltip wrapper HTML generator
 *************************************************/
function generateItemTooltipHTML(item) {
    let tooltipTextHTML = '';
    let acceptedItemReadings = item.object != 'radical' ? item.data.readings.filter(isAccepted) : {};
    let acceptedItemMeanings = item.data.meanings.filter(isAccepted);
    let notAcceptedItemReadings = item.object != 'radical' ? item.data.readings.filter(isNotAccepted) : {};
    let notAcceptedItemMeanings = item.data.meanings.filter(isNotAccepted);

    if (acceptedItemReadings.length > 0 || acceptedItemMeanings.length > 0 || notAcceptedItemReadings.length > 0 || notAcceptedItemMeanings.length > 0) {
        tooltipTextHTML += `
            <span class="custom-item-tooltip-text">
        `;

        tooltipTextHTML += generateTooltipMeaningReadingHTML(acceptedItemReadings, acceptedItemMeanings, 'accepted');
        tooltipTextHTML += generateTooltipMeaningReadingHTML(notAcceptedItemReadings, notAcceptedItemMeanings, 'not-accepted');

        tooltipTextHTML += `
            </span>
        `;
    }

    return tooltipTextHTML;
};


/*************************************************
 *  ANCHOR Custom item tooltip content HTML generator
 *************************************************/
function generateTooltipMeaningReadingHTML(itemReadings, itemMeanings, customClass) {
    let returnTooltipTextHTML = '';
    let itemReadingOnyomiTooltipItems = '';
    let itemReadingKunyomiTooltipItems = '';
    let itemReadingNanoriTooltipItems = '';
    let itemReadingOtherTooltipItems = '';
    let itemMeaningTooltipItems = '';

    if (itemReadings.length > 0 || itemMeanings.length > 0) {
        returnTooltipTextHTML += `
            <div class="custom-item-tooltip-text-${ customClass }-entries">
        `;

        if (itemReadings.length > 0) {
            let onyomiReadings = itemReadings.filter(function (item) { return item.type == 'onyomi'; });
            let kunyomiReadings = itemReadings.filter(function (item) { return item.type == 'kunyomi'; });
            let nanoriReadings = itemReadings.filter(function (item) { return item.type == 'nanori'; });
            let otherReadings = itemReadings.filter(function (item) { return !('type' in item); });

            $.each(onyomiReadings, function(index, reading) {
                itemReadingOnyomiTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(kunyomiReadings, function(index, reading) {
                itemReadingKunyomiTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(nanoriReadings, function(index, reading) {
                itemReadingNanoriTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            $.each(otherReadings, function(index, reading) {
                itemReadingOtherTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            if (itemReadingOnyomiTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings onyomi">音読み：${ itemReadingOnyomiTooltipItems }</div>
                `;
            }

            if (itemReadingKunyomiTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings kunyomi">訓読み：${ itemReadingKunyomiTooltipItems }</div>
                `;
            }

            if (itemReadingNanoriTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings nanori">名乗り：${ itemReadingNanoriTooltipItems }</div>
                `;
            }

            if (itemReadingOtherTooltipItems != '') {
                returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings vocabulary">単語：${ itemReadingOtherTooltipItems }</div>
                `;
            }
        }

        if (itemMeanings.length > 0) {
            $.each(itemMeanings, function(index, meaning) {
                itemMeaningTooltipItems += (index == 0 ? '' : ', ') + meaning.meaning;
            });

            returnTooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-meanings">${ itemMeaningTooltipItems }</div>
            `;
        }

        returnTooltipTextHTML += `
            </div>
        `;
    }

    return returnTooltipTextHTML;
};


/*************************************************
 *  ANCHOR Custom summary HTML generator
 *************************************************/
function generateSummaryHTML(summaryData, htmlClasses, divHeaderText, hasButton = false, buttonClasses = '', buttonText = '') {
    wlWanikaniDebug('Generating summary HTML.');

    let buttonHTML = hasButton
    ? `
            <a class="custom-button ${ buttonClasses }">
                <span>${ buttonText }</span>
            </a>
    `
    : '';

    let summaryHTML = `
        <div class="custom-summary ${ htmlClasses }">
            <h2>${ divHeaderText }</h2>
            <span class="custom-summary-kanji">漢字（${ summaryData.kanji.length }）</span>
            <span class="custom-summary-radical">部首（${ summaryData.radical.length }）</span>
            <span class="custom-summary-vocabulary">単語（${ summaryData.vocabulary.length }）</span>
            ${ buttonHTML }
        </div>
    `;

    wlWanikaniDebug('Generated the following summary HTML.', summaryHTML);
    return summaryHTML;
};


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

    return levelProgressCircleHTML;
};


/*************************************************
 *  ANCHOR Next reviews summary HTML generator
 *************************************************/
function generateFutureReviewsHTML(data, nextReviewData) {
    wlWanikaniDebug('Generating future reviews HTML with the following data.', nextReviewData);

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

    wlWanikaniDebug('Generated the following future reviews HTML.', returnHTML);
    return returnHTML;
};

/*************************************************
 *  ANCHOR Difficult Items Table HTML generator
 *************************************************/
function generateDifficultItemsSection(data,  insertAfterElement = '.custom-dashboard .custom-dashboard-progress-wrapper') {
    const difficultItemsClass = 'custom-dashboard-difficult-items';

    if ($('.' + difficultItemsClass).length > 0) {
        $('.' + difficultItemsClass).remove();
    }

    if (wkof.settings[scriptId].show_difficult_items) {
        let difficultItemsData = getDifficultItemsData(data);
        let difficultItemsHTML = generateCustomItemsHTML(difficultItemsData.DifficultItems, 'difficult');
        let difficultItemsTableHTML = generateCustomItemsTableHTML(difficultItemsData.DifficultItems, difficultItemsClass, '苦労', difficultItemsHTML, true);

        $(difficultItemsTableHTML).insertAfter(insertAfterElement);
    }
};