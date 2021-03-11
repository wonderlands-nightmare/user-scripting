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
    $.each(dataItems, function (index, dataItem) {
        if ("assignments" in dataItem) {
            if ((dataItem.data.level <= wkofItemsData.SafeLevel) && (dataItem.assignments.srs_stage <= wkof.settings[scriptId].srs_stage)) {
                if (wkof.settings[scriptId].identify_upcoming_difficult_items) {
                    dataItem.upcoming = (dataItem.assignments.srs_stage == wkof.settings[scriptId].srs_stage 
                                         && Object.values(wkofItemsData.NextRevewItems).includes(dataItem.id))
                                      ? true
                                      : false;
                }
                returnItems.push(dataItem);
            }
        }
    });

    wlWanikaniDebug('data', '==Difficult Items: isDifficult== List of difficult items:', returnItems);
    wlWanikaniDebug('data', '==Difficult Items: isDifficult== List of upcoming difficult items:', returnItems.filter(function(item) { return item.upcoming == true; }));
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
        let difficultItemsHTML = generateCustomItemsHTML(difficultItemsData.DifficultItems, 'difficult');
        let difficultItemsTableHTML = generateCustomItemsTableHTML(difficultItemsData.DifficultItems, difficultItemsClass, '苦労', difficultItemsHTML, true);

        wlWanikaniDebug('html', '==Difficult Items: generateDifficultItemsSection== Generated the following difficult items HTML:', { main_html: difficultItemsTableHTML });
        $(difficultItemsTableHTML).insertAfter(insertAfterElement);
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