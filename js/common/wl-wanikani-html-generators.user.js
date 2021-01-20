// ==UserScript==
// @name         WaniKani Custom Dashboard HTML Generators
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
// Add code


/*************************************************
 *  Helper functions.
 *************************************************/
function itemsCharacterCallback (item){
    let itemsData = item.data;
    //check if an item has characters. Kanji and vocabulary will always have these but wk-specific radicals (e.g. gun, leaf, stick) use images instead
    if (itemsData.characters != null) {
        return itemsData.characters;
    } else if (itemsData.character_images != null){
        return '<img class="radical-image" alt="' + itemsData.slug + '" src="https://cdn.wanikani.com/subjects/images/' + item.id + '-' + itemsData.slug + '-original.png"/>';
    } else {
        //if both characters and character_images are somehow absent try using slug instead
        return itemsData.slug;
    }
};


/*************************************************
 *  Filter functions.
 *************************************************/
function isAccepted(item) {
    return item.accepted_answer == true;
};

function isNotAccepted(item) {
    return item.accepted_answer == false;
};


/*************************************************
 *  Common HTML generator functions.
 *************************************************/
function generateCustomItemsTableHTML(customItemsData, customClass, headerMessageType, customItemsHTML, headerCount = false) {
    wlWanikaniDebug('Generating custom items table (' + customClass + ') HTML with the following data.', customItemsData);

    let headerMessageCount = headerCount ? '（' + customItemsData.length + '）' : '';
    let headerMessage = (customItemsData.length == 0) 
                        ? 'ごめんなさい, 君は' + headerMessageType + 'ありません.'
                        : '君は' + headerMessageType + '項目あります!' + headerMessageCount;

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

    wlWanikaniDebug('Finished generating custom items (' + customClass + ') table.');
    return customTableHTML;
};

function generateCustomItemsHTML(items, type = '') {
    wlWanikaniDebug('Generating custom items HTML.');

    let customItemsHTML = '';

    if (items.length > 0) {
        $.each(items, function(index, item) {
            let itemAddedStyle = '';
            let itemSrsLevel = '';
            let itemType = item.object;
            let customItemTooltipHTML = generateItemTooltipHTML(item);

            if (type = 'critical') {
                if (item.critical_level > 0) {
                    itemAddedStyle = 'style="box-shadow: inset 0 0 ' + (item.critical_level * 25) + 'px black"';
                }
            }

            if ('assignments' in item) {
                itemSrsLevel = '<span class="progress-item-srs-level srs-level-' + item.assignments.srs_stage + '">' + item.assignments.srs_stage + '</span>';
            }

            customItemsHTML += `
                    <div class="custom-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ customItemTooltipHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon" lang="ja" ${ itemAddedStyle }>
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
}


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
}


function generateFutureReviewsHTML(data, nextReviewData) {
    wlWanikaniDebug('Generating future reviews HTML with the following data.', nextReviewData);

    let nextReviewHTMLData = [];
    let futureReviewsHTML = '';
    let returnHTML = [];

    if (nextReviewData.length > 0) {
        $.each(nextReviewData, function(index, dataItem) {
            let nextReviewSummaryData = getSubjectData(data, 'next-review', dataItem.subjectIds);
            let nextReviewCustomClass = index == 0 ? 'next-review-summary' : 'future-review-summary';
            let nextReviewDataTitle = dataItem.text == ''
                                    ? '次の復習をなんでもない'
                                    : dataItem.text +'の次の復習（' + nextReviewSummaryData.totalCount + '）';
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
}