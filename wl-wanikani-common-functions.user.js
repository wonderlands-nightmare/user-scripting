// ==UserScript==
// @name         WaniKani Dashboard Common Functions
// @namespace    https://github.com/wonderlands-nightmare
// @author       Wonderlands-Nightmares
// ==/UserScript==

/*************************************************
 *  Variable initialisation.
 *************************************************/
// wlWanikaniDebug
let debugMode = false;


/*************************************************
 *  Helper functions.
 *************************************************/
function setWlWanikaniDebugMode(debugModeBoolean) {
    debugMode = debugModeBoolean;
};

function wlWanikaniDebug(debugMessage, debugItem = 'empty') {
    if (debugMode) {
        console.log('Critical Items log: ' + debugMessage);

        if (debugItem != 'empty') {
            console.log(debugItem);
        }
    }
};

function itemsCharacterCallback (itemsData){
    wlWanikaniDebug('Character callback.');

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
 *  Common HTML generator functions.
 *************************************************/
function generateCustomItemsTableHTML(criticalItemsData) {
    wlWanikaniDebug('Generating critical items table HTML with the following data.', criticalItemsData);
    let getCriticalItemsHTML = generateCriticalItemsHTML(criticalItemsData.CriticalItems);
    let headerMessage = (criticalItemsData.length == 0) 
                        ? 'Sorry no items are critical right now.'
                        : 'You have critical items you suck at!';

    let criticalTableHTML = `
        <div class="rounded custom-critical-items custom-items ${ getCriticalItemsHTML == '' ? 'all-done' : '' }">
            <section class="rounded bg-white p-3 -mx-3">
                <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${ headerMessage }</h2>
                <div class="progress-entries">
                    ${ getCriticalItemsHTML }
                </div>
            </section>
        </div>
    `;

    if ($('.custom-critical-items').length > 0) {
        $('.custom-critical-items').remove();
    }
    $(criticalTableHTML).insertAfter('section.srs-progress');
    wlWanikaniDebug('Finished adding critical items table.');
};

function generateCustomItemsHTML(items) {
    wlWanikaniDebug('Generating critical items HTML.');
    let criticalItemsHTML = '';

    if (items.length > 0) {
        $.each(items, function(index, item) {
            let itemAddedStyle = '';
            let itemType = item.object;
            let criticalItemTooltipHTML = generateItemTooltipHTML(item);

            if (item.critical_level > 0) {
                itemAddedStyle = 'style="box-shadow: inset 0 0 ' + (item.critical_level * 25) + 'px black"';
            }

            criticalItemsHTML += `
                    <div class="custom-item-tooltip progress-entry relative rounded-tr rounded-tl ${ itemType }">
                        ${ criticalItemTooltipHTML }
                        <a href="${ item.data.document_url }" class="${ itemType }-icon" lang="ja" ${ itemAddedStyle }>
                            <div>${ itemsCharacterCallback(item.data) }</div>
                            <span class="progress-item-level">${ item.data.level }</span>
                            <span class="progress-item-srs-level srs-level-${ item.assignments.srs_stage }">${ item.assignments.srs_stage }</span>
                        </a>
                    </div>
            `;
        });
    }

    wlWanikaniDebug('Generated the following critical items HTML.', criticalItemsHTML);
    return criticalItemsHTML;
};

function generateItemTooltipHTML(item) {
    let tooltipTextHTML = '';
    let itemReadingTooltipItems = '';
    let itemMeaningTooltipItems = '';
    let itemReadings = item.object != 'radical' ? item.data.readings.filter(isAccepted) : {};
    let itemMeanings = item.data.meanings.filter(isAccepted);

    if (itemReadings.length > 0 || itemMeanings.length > 0) {
        tooltipTextHTML += `
            <span class="custom-item-tooltip-text">
        `;

        if (itemReadings.length > 0) {
            $.each(itemReadings, function(index, reading) {
                itemReadingTooltipItems += (index == 0 ? '' : ', ') + reading.reading;
            });

            tooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-readings">${ itemReadingTooltipItems }</div>
            `;
        }

        if (itemMeanings.length > 0) {
            $.each(itemMeanings, function(index, meaning) {
                itemMeaningTooltipItems += (index == 0 ? '' : ', ') + meaning.meaning;
            });

            tooltipTextHTML += `
                <div class="custom-item-tooltip-text-entries item-meanings">${ itemMeaningTooltipItems }</div>
            `;
        }

        tooltipTextHTML += `
            </span>
        `;
    }

    return tooltipTextHTML;
};