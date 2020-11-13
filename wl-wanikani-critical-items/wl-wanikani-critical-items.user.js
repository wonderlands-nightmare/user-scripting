// ==UserScript==
// @name         WaniKani Dashboard Critical Items
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
// criticalItemsDebug
let debugMode = false;

// getItems
const itemDataConfig = {
    wk_items: {
        options: {
            review_statistics: true
        },
        filters: {
            level: '1..+0', //only retrieve items from lv 1 up to and including current level
            srs: {
                value: 'lock, init, burn',
                invert: true
            } //exlude locked, initial and burned items
        }
    }
};

let wkofItems = {};
let wkofItemsData = {};

// isCritical
const apprenticeIds = [1, 2, 3, 4];


/*************************************************
 *  Helper functions.
 *************************************************/
function setCriticalItemsDebugMode(debugModeBoolean) {
    debugMode = debugModeBoolean;
};

function criticalItemsDebug(debugMessage, debugItem = 'empty') {
    if (debugMode) {
        console.log('Critical Items log: ' + debugMessage);

        if (debugItem != 'empty') {
            console.log(debugItem);
        }
    }
};

function itemsCharacterCallback (itemsData){
    criticalItemsDebug('Character callback.');

    //check if an item has characters. Kanji and vocabulary will always have these but wk-specific radicals (e.g. gun, leaf, stick) use images instead
    if(itemsData.characters!= null) {
        return itemsData.characters;
    } else if (itemsData.character_images != null){
        return '<i class="radical-'+itemsData.slug+' radicalCharacterImgSize"></i>';
    } else {
        //if both characters and character_images are somehow absent try using slug instead
        return itemsData.slug;
    }
};


/*************************************************
 *  Add Critical Items component to dashboard.
 *************************************************/
// =================
// Critical items list
// =================
function getCriticalItems() {
    criticalItemsDebug('Getting items.');

    return Promise.all([wkof.ItemData.get_items(itemDataConfig), wkof.Apiv2.fetch_endpoint('user')])
        .then(function([itemsData, userData]) {
            wkofItems.ItemsData = itemsData;
            wkofItems.UsersData = userData;
            return wkofItems;
        });
};

function getCriticalItemsData(items) {
    criticalItemsDebug('Getting critical items.');

    wkofItemsData.SafeLevel = items.UsersData.data.level - 3;
    wkofItemsData.CriticalItems = items.ItemsData.filter(isCritical);

    criticalItemsDebug('Got critical items, show data.', wkofItemsData);

    return wkofItemsData;
};

function isCritical(item) {
    criticalItemsDebug('Check if critical.');
    // 1 - appr1, 2 - appr2, 3 - appr3, 4 - appr4, 5 - guru1, 6 - guru2, 7 - mast, 8 - enli

    const isLowerLevel = item.data.level <= wkofItemsData.SafeLevel ? true : false;
    const isApprentice = apprenticeIds.includes(item.assignments.srs_stage);
    const itemCritical = isLowerLevel && isApprentice;

    if (itemCritical) {
        item.critical_level = (wkofItemsData.SafeLevel - item.data.level)/item.assignments.srs_stage;

        return item;
    };
};

function updatePageForCriticalItems(items) {
    criticalItemsDebug('Updating page.');

    items = items.CriticalItems.sort(function(a, b) {
        return (a.critical_level == b.critical_level)
            ? a.assignments.srs_stage - b.assignments.srs_stage
            : b.critical_level - a.critical_level;
    });

    createTables(items);
};

function isAccepted(item) {
    criticalItemsDebug('Check if accepted.');

    return item.accepted_answer == true;
};

function createTables(items) {
    criticalItemsDebug('Create Tables.');

    let headerMessage = (items.length == 0) 
                        ? 'Sorry no items are critical right now.'
                        : 'You have critical items you suck at!';

    criticalItemsDebug('Create Tables after if.');

    let criticalTableHTML = `
        <div class="rounded custom-critical-items">
            <section class="rounded bg-white p-3 -mx-3">
                <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${headerMessage}</h2>
                <div class="progress-entries">
    `;

    criticalItemsDebug('Create Tables after html1.');

    if (items.length > 0) {
        $.each(items, function(index, item) {
            let itemAddedStyle = '';
            let tooltipTextHTML = '';
            let itemReadingTooltipItems = '';
            let itemMeaningTooltipItems = '';

            let itemType = item.object;

            let itemReadings = itemType != 'radical' ? item.data.readings.filter(isAccepted) : {};
            let itemMeanings = item.data.meanings.filter(isAccepted);

            if (item.critical_level > 0) {
                itemAddedStyle = 'style="box-shadow: inset 0 0 ' + (item.critical_level * 25) + 'px black"';
            }

            if (itemReadings.length > 0 || itemMeanings.length > 0) {
                tooltipTextHTML += `
                    <span class="critical-item-tooltip-text">
                `;

                if (itemReadings.length > 0) {
                    $.each(itemReadings, function(index, reading) {
                        itemReadingTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
                    });

                    tooltipTextHTML += `
                        <div class="critical-item-tooltip-text-entries item-readings">${ itemReadingTooltipItems }</div>
                    `;
                }

                if (itemMeanings.length > 0) {
                    $.each(itemMeanings, function(index, meaning) {
                        itemMeaningTooltipItems += (index == 0 ? '' : ', ') + meaning.meaning;
                    });

                    tooltipTextHTML += `
                        <div class="critical-item-tooltip-text-entries item-meanings">${ itemMeaningTooltipItems }</div>
                    `;
                }

                tooltipTextHTML += `
                    </span>
                `;
            }

            criticalTableHTML += `
                    <div class="critical-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ tooltipTextHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon" lang="ja" ${ itemAddedStyle }>
                            <div>${ itemsCharacterCallback(item.data) }</div>
                            <span class="progress-item-level">${ item.data.level }</span>
                            <span class="progress-item-srs-level srs-level-${ item.assignments.srs_stage }">${ item.assignments.srs_stage }</span>
                        </a>
                    </div>
            `;
        });
    }

    criticalTableHTML += `
                </div>
            </section>
        </div>
    `;

    if ($('.custom-critical-items').length > 0) {
        $('.custom-critical-items').remove();
    }
    $(criticalTableHTML).insertAfter('section.srs-progress');

    criticalItemsDebug('Created?');
};