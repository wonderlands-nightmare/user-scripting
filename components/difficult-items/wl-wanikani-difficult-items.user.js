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
    wlWanikaniDebug('Check if difficult.', dataItems);
    
    let returnItems = []
    $.each(dataItems, function (index, dataItem) {
        if ("assignments" in dataItem) {
            if ((dataItem.data.level <= wkofItemsData.SafeLevel) && (dataItem.assignments.srs_stage <= wkof.settings[scriptId].srs_stage)) {
                returnItems.push(dataItem);
            }
        }
    });
    
    return returnItems;
};


/*************************************************
 *  ANCHOR Difficult Items Table HTML generator
 *************************************************/
function generateDifficultItemsSection(data,  insertAfterElement = customDashboardProgressWrapperElement) {
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


/*************************************************
 *  ANCHOR Generate difficult items data object
 *************************************************/
function getDifficultItemsData(data) {
    wlWanikaniDebug('Getting difficult items.', data);

    wkofItemsData.SafeLevel = data.UsersData.data.level - wkof.settings[scriptId].safe_level;
    wkofItemsData.DifficultItems = isDifficult(data.ItemsData);
    wkofItemsData.DifficultItems = itemLevelSort(wkofItemsData.DifficultItems);

    wlWanikaniDebug('Got difficult items, show data.', wkofItemsData);
    return wkofItemsData;
};