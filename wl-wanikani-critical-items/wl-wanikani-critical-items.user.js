// ==UserScript==
// @name         WaniKani Dashboard Critical Items
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.1
// @description  try to take over the world!
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @updateURL    https://github.com/wonderlands-nightmare/custom-scripting/blob/master/wl-wanikani-critical-items/wl-wanikani-critical-items.user.js
// @grant        none
// ==/UserScript==

(function () {
    /*************************************************
     *  Variable initialisation.
     *************************************************/
    const scriptNameSpace = 'wl-wanikani-critical-items';
    
    // criticalItemsDebug
    let debugMode = false;

    // getItems
    const config = {
		wk_items: {
			options: {
                review_statistics: true,
                asignments: true
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

    // openSettings, installSettings, processSettings
    let settingsDialog;
    
    // installSettings
    let defaults = {
        debugMode: false,
    };
    

    /*************************************************
     *  Execute script.
     *************************************************/
    console.log('Running ' + scriptNameSpace + ' functions.');
    wkof.include('ItemData, Menu, Settings');
    wkof.ready('ItemData, Menu, Settings')
        .then(addStyles)
        .then(installMenu)
        .then(installSettings)
        .then(getItems)
        .then(getCriticalItems)
        .then(updatePage)
        .then(function() { console.log('All ' + scriptNameSpace + ' functions have loaded.'); });
    

    /*************************************************
     *  Helper functions.
     *************************************************/
    function criticalItemsDebug(debugMessage) {
        debugMode ? console.log(debugMessage) : '';
    };


    /*************************************************
     *  Adds styling to page.
     *************************************************/
    function addStyles() {
        var style = document.createElement('style');
        var cssFile = 'https://raw.githubusercontent.com/wonderlands-nightmare/custom-scripting/master/' + scriptNameSpace + '/' + scriptNameSpace + '.user.css';

        $.get(cssFile, function(content) {
            style.innerHTML = content;
        });

        style.className = '' + scriptNameSpace + '-custom-styles';

        document.head.appendChild(style);
    };


    /*************************************************
     *  Add Critical Items component to dashboard.
     *************************************************/
    // =================
    // Critical items menu/settings
    // =================
    function installMenu() {
        wkof.Menu.insert_script_link({
            script_id: 'Critical_Tables',
            name: 'Critical_Tables',
            submenu:   'Settings',
            title:     'Critical Tables',
            on_click:  openSettings
        });
    };

    function openSettings() {
        settingsDialog.open();
    };

    function installSettings() {
        settingsDialog = new wkof.Settings({
            script_id: 'Critical_Tables',
            name: 'Critical_Tables',
            title: 'Critical Tables',
            on_save: processSettings,
            settings: {
                'debugMode': {
                    type:'dropdown',
                    label:'Total number of leeches',
                    hover_tip: 'The amount of leeches you want to display',
                    default: defaults.debugMode,
                    content:{
                        true:'Enable',
                        false:'Disable'
                    }
                }
            }
        });

        settingsDialog.load().then(function(){
            wkof.settings.Critical_Tables = $.extend(true, {}, defaults,wkof.settings.Critical_Tables);
            settingsDialog.save();
        });
    };

    function processSettings(){
        settingsDialog.save();
        console.log(wkof.settings.Critical_Tables.debugMode);
        debugMode = wkof.settings.Critical_Tables.debugMode;
        //refresh critical items table
        getItems()
            .then(getCriticalItems)
            .then(updatePage);
    };
    
    // =================
    // Critical items list
    // =================
    function getItems() {
        criticalItemsDebug('Getting items.');

        return wkof.ItemData.get_items(config);
    };


    function getCriticalItems(items) {
        criticalItemsDebug('Getting critical items.');

        let returnItems = items.filter(isCritical);

        criticalItemsDebug(returnItems);
        
        return returnItems;
    };

    function isCritical(item) {
        criticalItemsDebug('Check if critical.');

        item.critical_score = item.review_statistics.percentage_correct;
        return item.critical_score <= 65;
    };

    function updatePage(items) {
        criticalItemsDebug('Updating page.');

        //sort by percentage, if score equal sort by level ascending
        items = items.sort(function(a, b){
            return (a.critical_score == b.critical_score)
                ? a.data.level - b.data.level
                : b.critical_score - a.critical_score});

        createTables(items);
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

    function createTables(items) {
        criticalItemsDebug('Create Tables.');

        let criticalTableHTML = '';
        let headerMessage = '';

        if (items.length == 0){ //if no items
            headerMessage = 'Sorry no items are critical right now.';
        }
        else {
            headerMessage = 'You have critical items you suck at!'
        }

        criticalItemsDebug('Create Tables after if.');

        criticalTableHTML += `
            <div class="custom-critical-items">
                <section class="rounded bg-white p-3 -mx-3">
                    <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${headerMessage}</h2>
                    <div class="progress-entries">
        `;

        criticalItemsDebug('Create Tables after html1.');

        $.each(items, function(index, item) {
            criticalItemsDebug('Is item index: '+index);
            let itemType = item.object;
            criticalTableHTML += `
                        <div class="progress-entry relative rounded-tr rounded-tl ${itemType}">
                            <a href="${item.data.document_url}" class="${itemType}-icon" lang="ja">
                                <div>${itemsCharacterCallback(item.data)}</div>
                            </a>
                        </div>
            `;
        });

        criticalTableHTML += `
                    </div>
                </section>
            </div>
        `;

        $(criticalTableHTML).insertAfter('section.srs-progress');

        criticalItemsDebug('Created?');
    };
})();
