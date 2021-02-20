/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseSrsSummaryComponent() {
    // NOTE Get lesson, review, and srs level data
    
    let apprenticeSummaryData = getSubjectData(wkofItemsData.AllData, 'apprentice');
    let guruSummaryData = getSubjectData(wkofItemsData.AllData, 'guru');
    let masterSummaryData = getSubjectData(wkofItemsData.AllData, 'master');
    let enlightenedSummaryData = getSubjectData(wkofItemsData.AllData, 'enlightened');
    let burnedSummaryData = getSubjectData(wkofItemsData.AllData, 'burned');

    

    // NOTE Generate the custom items HTML for srs level summary and section
    let apprenticeSummaryItemsHTML = `${ generateCustomItemsHTML(apprenticeSummaryData.kanji) }${ generateCustomItemsHTML(apprenticeSummaryData.radical) }${ generateCustomItemsHTML(apprenticeSummaryData.vocabulary) }`;
    let guruSummaryItemsHTML = `${ generateCustomItemsHTML(guruSummaryData.kanji) }${ generateCustomItemsHTML(guruSummaryData.radical) }${ generateCustomItemsHTML(guruSummaryData.vocabulary) }`;
    let masterSummaryItemsHTML = `${ generateCustomItemsHTML(masterSummaryData.kanji) }${ generateCustomItemsHTML(masterSummaryData.radical) }${ generateCustomItemsHTML(masterSummaryData.vocabulary) }`;
    let enlightenedSummaryItemsHTML = `${ generateCustomItemsHTML(enlightenedSummaryData.kanji) }${ generateCustomItemsHTML(enlightenedSummaryData.radical) }${ generateCustomItemsHTML(enlightenedSummaryData.vocabulary) }`;
    let burnedSummaryItemsHTML = `${ generateCustomItemsHTML(burnedSummaryData.kanji) }${ generateCustomItemsHTML(burnedSummaryData.radical) }${ generateCustomItemsHTML(burnedSummaryData.vocabulary) }`;

    // NOTE Generate HTML for srs level section
    let apprenticeSummaryItemsTableHTML = generateCustomItemsTableHTML(apprenticeSummaryData, 'custom-dashboard-summary-items apprentice', '見習', apprenticeSummaryItemsHTML);
    let guruSummaryItemsTableHTML = generateCustomItemsTableHTML(guruSummaryData, 'custom-dashboard-summary-items guru', '達人', guruSummaryItemsHTML);
    let masterSummaryItemsTableHTML = generateCustomItemsTableHTML(masterSummaryData, 'custom-dashboard-summary-items master', '主人', masterSummaryItemsHTML);
    let enlightenedSummaryItemsTableHTML = generateCustomItemsTableHTML(enlightenedSummaryData, 'custom-dashboard-summary-items enlightened', '悟りを開いた', enlightenedSummaryItemsHTML);
    let burnedSummaryItemsTableHTML = generateCustomItemsTableHTML(burnedSummaryData, 'custom-dashboard-summary-items burned', '焼け', burnedSummaryItemsHTML);

    // NOTE Generate custom dashboard content HTML
    
    let enlightenedSummaryTotalCount = enlightenedSummaryData.totalCount >= 10000 ? '~' + (enlightenedSummaryData.totalCount / 1000).toFixed() + '千' : enlightenedSummaryData.totalCount;
    let customDashboardProgressContent = `
        ${ generateSummaryHTML(apprenticeSummaryData, 'custom-dashboard-progress-summary apprentice-summary', '見習（' + apprenticeSummaryData.totalCount + '）', true, 'custom-progress-summary-button apprentice', '見せて') }
        ${ generateSummaryHTML(guruSummaryData, 'custom-dashboard-progress-summary guru-summary', '達人（' + guruSummaryData.totalCount + '）', true, 'custom-progress-summary-button guru', '見せて') }
        ${ generateSummaryHTML(masterSummaryData, 'custom-dashboard-progress-summary master-summary', '主人（' + masterSummaryData.totalCount + '）', true, 'custom-progress-summary-button master', '見せて') }
        ${ generateSummaryHTML(enlightenedSummaryData, 'custom-dashboard-progress-summary enlightened-summary', '悟りを開いた（' + enlightenedSummaryTotalCount + '）', true, 'custom-progress-summary-button enlightened', '見せて') }
        ${ generateSummaryHTML(burnedSummaryData, 'custom-dashboard-progress-summary burned-summary', '焼け（' + burnedSummaryData.totalCount + '）', true, 'custom-progress-summary-button burned', '見せて') }
    `;
    let customDashboardProgressAfterContent = `
        ${ apprenticeSummaryItemsTableHTML }
        ${ guruSummaryItemsTableHTML }
        ${ masterSummaryItemsTableHTML }
        ${ enlightenedSummaryItemsTableHTML }
        ${ burnedSummaryItemsTableHTML }
    `;
    
    $('.custom-dashboard .custom-dashboard-progress-wrapper .custom-section.custom-dashboard-progress').append(customDashboardProgressContent);
    $('.custom-dashboard .custom-dashboard-progress-wrapper').append(customDashboardProgressAfterContent);

    setProgressSummaryButtonEffects();
}


/*************************************************
 *  ANCHOR Add slide toggle effects to the SRS Progress Summary 'show'
 *  buttons to show SRS Progress Summary information
 *************************************************/
function setProgressSummaryButtonEffects() {
    $('.custom-dashboard .custom-section.custom-dashboard-progress').find('.custom-progress-summary-button').each(function (index, item) {
        let currentProgressType = $(this).attr('class').replace('custom-button custom-progress-summary-button ', '').replace(' selected', '');
        let progressSummarySection = $('.custom-dashboard .custom-dashboard-summary-items.' + currentProgressType);

        progressSummarySection.slideToggle();

        $(this).on('click', function() {
            wlWanikaniDebug('Clicked class type: ', currentProgressType);

            $(this).toggleClass('selected');
            progressSummarySection.slideToggle();
        });
    });
}