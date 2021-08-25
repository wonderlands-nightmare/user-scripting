/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseDifficultItemsComponent() {
    // NOTE Load difficult items if enabled
    if (wkof.settings[scriptId].show_difficult_items) {
        generateDifficultItemsSection(wkofItemsData.AllData);
    }
}


/*************************************************
 *  ANCHOR Item filters and sorting
 *************************************************/
// NOTE Filters items based on Safe Level
function isDifficult(dataItems) {
    wlWanikaniDebug('data', '==Difficult Items: isDifficult== Filter difficult items with the following data:', dataItems);
    
    let returnItems = []
    let itemLevelLimit = wkof.settings[scriptId].identify_level_up ? wkofItemsData.SafeLevel + 1 : wkofItemsData.SafeLevel;
    $.each(dataItems, (index, dataItem) => {
        if ("assignments" in dataItem) {
            if ((dataItem.data.level <= itemLevelLimit) && (dataItem.assignments.srs_stage <= wkof.settings[scriptId].srs_stage)) {
                if (wkof.settings[scriptId].identify_upcoming_difficult_items) {
                    dataItem.upcoming = (dataItem.assignments.srs_stage == wkof.settings[scriptId].srs_stage 
                                         && Object.values(wkofItemsData.NextRevewItems).includes(dataItem.id))
                                      ? true
                                      : false;
                }
                else {
                    if ('upcoming' in dataItem) {
                        delete dataItem.upcoming;
                    }
                }
                returnItems.push(dataItem);
            }
        }
    });

    wlWanikaniDebug('data', '==Difficult Items: isDifficult== List of difficult items:', returnItems);
    wlWanikaniDebug('data', '==Difficult Items: isDifficult== List of upcoming difficult items:', returnItems.filter((item) => {
        if ('upcoming' in item) {
            return item.upcoming == true;
        }
    }));
    return returnItems;
};


/*************************************************
 *  ANCHOR Difficult Items Table HTML generator
 *************************************************/
function generateDifficultItemsSection(data,  insertAfterElement = '.dashboard .custom-dashboard-progress-wrapper') {
    const difficultItemsClass = 'custom-dashboard-difficult-items';

    if ($('.' + difficultItemsClass).length > 0) {
        $('.' + difficultItemsClass).remove();
    }

    if (wkof.settings[scriptId].show_difficult_items) {
        wlWanikaniDebug('html', '==Difficult Items: generateDifficultItemsSection== Generating difficult items section and appending to:', insertAfterElement);
        let difficultItemsData = getDifficultItemsData(data);
        let difficultItemsDisplayData = difficultItemsData.DifficultItems.filter(item => item.data.level <= wkofItemsData.SafeLevel);
        let difficultItemsHTML = generateCustomItemsHTML(difficultItemsDisplayData, 'difficult');
        let difficultItemsTableHTML = generateCustomItemsTableHTML(difficultItemsDisplayData
                                                                 , difficultItemsClass
                                                                 , translationText.words.difficult.jp_kanji
                                                                 , translationText.words.difficult
                                                                 , difficultItemsHTML
                                                                 , true
                                                                 );

        wlWanikaniDebug('html', '==Difficult Items: generateDifficultItemsSection== Generated the following difficult items HTML:', { main_html: difficultItemsTableHTML });
        $(difficultItemsTableHTML).insertAfter(insertAfterElement);
        
        if (wkof.settings[scriptId].identify_upcoming_difficult_items) {
            let upcomingDifficultItemsCount = difficultItemsDisplayData.filter(item => item.upcoming).length;
            if (upcomingDifficultItemsCount > 0) {
                let upcomingDifficultItemsCountHTML = `<span class="upcoming-items-count">~${ upcomingDifficultItemsCount }</span>`;
                $('.dashboard .' + difficultItemsClass + ' h2').append(upcomingDifficultItemsCountHTML);
            }
        }

        if (wkof.settings[scriptId].identify_upcoming_difficult_items && wkof.settings[scriptId].identify_level_up && wkofItemsData.MightLevelUp) {
            let upcomingDifficultItemsOnLevelUpCount = wkofItemsData.DifficultItems.filter(item => item.data.level == wkofItemsData.SafeLevel + 1).length;
            if (upcomingDifficultItemsOnLevelUpCount > 0) {
                let upcomingDifficultItemsOnLevelUpCountHTML = `<span class="upcoming-items-on-level-up-count">(+${ upcomingDifficultItemsOnLevelUpCount })</span>`;
                $('.dashboard .' + difficultItemsClass + ' h2').append(upcomingDifficultItemsOnLevelUpCountHTML);
            }
        }
    }
};


/*************************************************
 *  ANCHOR Generate difficult items data object
 *************************************************/
function getDifficultItemsData(data) {
    wlWanikaniDebug('data', '==Difficult Items: getDifficultItemsData== Getting difficult items data.');

    wkofItemsData.SafeLevel = data.UsersData.data.level - wkof.settings[scriptId].safe_level;
    wkofItemsData.DifficultItems = isDifficult(data.ItemsData);
    wkofItemsData.DifficultItems = itemLevelSort(wkofItemsData.DifficultItems);

    wlWanikaniDebug('data', '==Difficult Items: getDifficultItemsData== Got difficult items and appended to global wkofItemsData variable (see all except wkofItemsData.AllData):', wkofItemsData);
    return wkofItemsData;
};