// ==UserScript==
// @name         WaniKani Dashboard Critical Items
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
let wkofItemsData = {};

// isCritical
const apprenticeIds = [1, 2, 3, 4];


/*************************************************
 *  Helper functions.
 *************************************************/
// Add code


/*************************************************
 *  Filter functions.
 *************************************************/
function isCritical(item) {
    wlWanikaniDebug('Check if critical.');
    // 1 - appr1, 2 - appr2, 3 - appr3, 4 - appr4, 5 - guru1, 6 - guru2, 7 - mast, 8 - enli

    if ("ItemsData" in wkofItemsData) {
        const isLowerLevel = item.data.level <= wkofItemsData.SafeLevel ? true : false;
        const isApprentice = apprenticeIds.includes(item.assignments.srs_stage);
        const itemCritical = isLowerLevel && isApprentice;

        if (itemCritical) {
            item.critical_level = (wkofItemsData.SafeLevel - item.data.level)/item.assignments.srs_stage;

            return item;
        }
    }
};

function isAccepted(item) {
    wlWanikaniDebug('Check if accepted.');

    return item.accepted_answer == true;
};


/*************************************************
 *  Add Critical Items component to dashboard.
 *************************************************/
// =================
// Critical items list
// =================
function getCriticalItemsData(items) {
    wlWanikaniDebug('Getting critical items.', items);

    wkofItemsData.SafeLevel = items.UsersData.data.level - 3;
    wkofItemsData.CustomItems = items.ItemsData.filter(isCritical);
    wkofItemsData.CustomItems = wkofItemsData.CustomItems.sort(function(a, b) {
        return (a.critical_level == b.critical_level)
            ? a.assignments.srs_stage - b.assignments.srs_stage
            : b.critical_level - a.critical_level;
    });

    wlWanikaniDebug('Got critical items, show data.', wkofItemsData);

    return wkofItemsData;
};