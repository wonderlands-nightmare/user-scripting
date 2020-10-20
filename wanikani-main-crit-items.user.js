// ==UserScript==
// @name         WaniKani Dashboard
// @namespace    https://github.com/wonderlands-nightmare
// @version      0.2
// @description  try to take over the world!
// @author       Wonderlands-Nightmares
// @match        https://www.wanikani.com/dashboard
// @grant        none
// ==/UserScript==

(function() {
    const config = {
		wk_items: {
			options: {
				review_statistics: true
			},
            filters: {
                level: '1..+0', //only retrieve items from lv 1 up to and including current level
                srs: {value: 'lock, init, burn', invert: true} //exlude locked, initial and burned items
            }
		}
	};

	wkof.include('ItemData');
	wkof.ready('ItemData')
        .then(getItems)
        .then(getCriticalItems)
        .then(updatePage)
        .then(function() {console.log('Promise complete!');});


    function getItems() {
        console.log('Getting items.');
        return wkof.ItemData.get_items(config);
    }


    function getCriticalItems(items) {
        console.log('Getting critical items.');

        let returnItems = items.filter(isCritical);
        console.log(returnItems);
        return returnItems;
    }

    function isCritical(item) {
        console.log('Check if critical.');

        item.critical_score = item.review_statistics.percentage_correct;
        return item.critical_score <= 90;
    }

    function updatePage(items) {
        console.log('Updating page.');
        //sort by percentage, if score equal sort by level ascending
        items = items.sort(function(a, b){
            return (a.critical_score == b.critical_score)
                ? a.data.level - b.data.level
                : b.critical_score - a.critical_score});
            //.slice(0, 10);

        createTables(items);
	}

    function itemsCharacterCallback (itemsData){
        console.log('Character callback.');
        //check if an item has characters. Kanji and vocabulary will always have these but wk-specific radicals (e.g. gun, leaf, stick) use images instead
        if(itemsData.characters!= null) {
            return itemsData.characters;
        } else if (itemsData.character_images != null){
            return '<i class="radical-'+itemsData.slug+' radicalCharacterImgSize"></i>';
        } else {
            //if both characters and character_images are somehow absent try using slug instead
            return itemsData.slug;
        }
    }

    function createTables(items) {
        console.log('Create Tables.');
        let criticalTableHTML = '';
        let headerMessage = '';

        if (items.length == 0){ //if no items
            headerMessage = 'Sorry no items are critical right now.';
        }
        else {
            headerMessage = 'You have critical items you suck at!'
        }

        console.log('Create Tables after if.');

        criticalTableHTML += `
            <div class="custom-critical-items">
                <section class="rounded bg-white p-3 -mx-3">
                    <h2 class="border-gray-100 border-solid border-0 border-b text-sm text-black text-left leading-none tracking-normal font-bold mt-0 pb-2 mb-2">${headerMessage}</h2>
                    <div class="progress-entries">
        `;

        console.log('Create Tables after html1.');

        $.each(items, function(index, item) {
            console.log('Is item index: '+index);
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

        $(criticalTableHTML).insertBefore('section.srs-progress');
        console.log('Created?');
    }
})();
