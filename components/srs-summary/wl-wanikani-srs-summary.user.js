/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseSrsSummaryComponent() {
    // NOTE Get srs level data
    let apprenticeSummaryData = getSubjectData(wkofItemsData.AllData, 'apprentice');
    let guruSummaryData = getSubjectData(wkofItemsData.AllData, 'guru');
    let masterSummaryData = getSubjectData(wkofItemsData.AllData, 'master');
    let enlightenedSummaryData = getSubjectData(wkofItemsData.AllData, 'enlightened');
    let burnedSummaryData = getSubjectData(wkofItemsData.AllData, 'burned');

    // NOTE Generate the custom items HTML for srs level summary and section
    let apprenticeSummaryItemsHTML = generateCustomItemsHTML(apprenticeSummaryData.kanji, 'apprentice-kanji')
                                   + generateCustomItemsHTML(apprenticeSummaryData.radical, 'apprentice-radical')
                                   + generateCustomItemsHTML(apprenticeSummaryData.vocabulary, 'apprentice-vocabulary');
    let guruSummaryItemsHTML = generateCustomItemsHTML(guruSummaryData.kanji, 'guru-kanji')
                             + generateCustomItemsHTML(guruSummaryData.radical, 'guru-radical')
                             + generateCustomItemsHTML(guruSummaryData.vocabulary, 'guru-vocabulary');
    let masterSummaryItemsHTML = generateCustomItemsHTML(masterSummaryData.kanji, 'master-kanji')
                               + generateCustomItemsHTML(masterSummaryData.radical, 'master-radical')
                               + generateCustomItemsHTML(masterSummaryData.vocabulary, 'master-vocabulary');
    let enlightenedSummaryItemsHTML = generateCustomItemsHTML(enlightenedSummaryData.kanji, 'enlightened-kanji')
                                    + generateCustomItemsHTML(enlightenedSummaryData.radical, 'enlightened-radical')
                                    + generateCustomItemsHTML(enlightenedSummaryData.vocabulary, 'enlightened-vocabulary');
    let burnedSummaryItemsHTML = generateCustomItemsHTML(burnedSummaryData.kanji, 'burned-kanji')
                               + generateCustomItemsHTML(burnedSummaryData.radical, 'burned-radical')
                               + generateCustomItemsHTML(burnedSummaryData.vocabulary, 'burned-vocabulary');

    // NOTE Generate HTML for srs level section
    let apprenticeSummaryItemsTableHTML = generateCustomItemsTableHTML(apprenticeSummaryData
                                                                     , 'custom-dashboard-summary-items apprentice'
                                                                     , translationText.words.apprentice.jp_kanji
                                                                     , translationText.words.apprentice.en_meaning
                                                                     , apprenticeSummaryItemsHTML
                                                                     );
    let guruSummaryItemsTableHTML = generateCustomItemsTableHTML(guruSummaryData
                                                               , 'custom-dashboard-summary-items guru'
                                                               , translationText.words.guru.jp_kanji
                                                               , translationText.words.guru.en_meaning
                                                               , guruSummaryItemsHTML
                                                               );
    let masterSummaryItemsTableHTML = generateCustomItemsTableHTML(masterSummaryData
                                                                 , 'custom-dashboard-summary-items master'
                                                                 , translationText.words.master.jp_kanji
                                                                 , translationText.words.master.en_meaning
                                                                 , masterSummaryItemsHTML
                                                                 );
    let enlightenedSummaryItemsTableHTML = generateCustomItemsTableHTML(enlightenedSummaryData
                                                                      , 'custom-dashboard-summary-items enlightened'
                                                                      , translationText.words.enlightened.jp_kanji
                                                                      , translationText.words.enlightened.en_meaning
                                                                      , enlightenedSummaryItemsHTML
                                                                      );
    let burnedSummaryItemsTableHTML = generateCustomItemsTableHTML(burnedSummaryData
                                                                 , 'custom-dashboard-summary-items burned'
                                                                 , translationText.words.burned.jp_kanji
                                                                 , translationText.words.burned.en_meaning
                                                                 , burnedSummaryItemsHTML
                                                                 );

    // NOTE Generate SRS Summary content HTML
    let enlightenedSummaryTotalCount = enlightenedSummaryData.totalCount >= 10000 ? '~' + (enlightenedSummaryData.totalCount / 1000).toFixed() + '千' : enlightenedSummaryData.totalCount;
    let customDashboardProgressContent = `
        ${ generateSummaryHTML(apprenticeSummaryData
                             , 'custom-dashboard-progress-summary apprentice-summary'
                             , translationText.words.apprentice.jp_kanji + '（' + apprenticeSummaryData.totalCount + '）'
                             , translationText.words.apprentice.en_meaning + '（' + apprenticeSummaryData.totalCount + '）'
                             , true
                             , 'custom-progress-summary-button apprentice'
                             , translationText.words.look_at.jp_kanji
                             , translationText.words.look_at.en_meaning
        ) }
        ${ generateSummaryHTML(guruSummaryData
                             , 'custom-dashboard-progress-summary guru-summary'
                             , translationText.words.guru.jp_kanji + '（' + guruSummaryData.totalCount + '）'
                             , translationText.words.guru.en_meaning + '（' + guruSummaryData.totalCount + '）'
                             , true
                             , 'custom-progress-summary-button guru'
                             , translationText.words.look_at.jp_kanji
                             , translationText.words.look_at.en_meaning
        ) }
        ${ generateSummaryHTML(masterSummaryData
                             , 'custom-dashboard-progress-summary master-summary'
                             , translationText.words.master.jp_kanji + '（' + masterSummaryData.totalCount + '）'
                             , translationText.words.master.en_meaning + '（' + masterSummaryData.totalCount + '）'
                             , true
                             , 'custom-progress-summary-button master'
                             , translationText.words.look_at.jp_kanji
                             , translationText.words.look_at.en_meaning
        ) }
        ${ generateSummaryHTML(enlightenedSummaryData
                             , 'custom-dashboard-progress-summary enlightened-summary'
                             , translationText.words.enlightened.jp_kanji + '（' + enlightenedSummaryTotalCount + '）'
                             , translationText.words.enlightened.en_meaning + '（' + enlightenedSummaryTotalCount.totalCount + '）'
                             , true
                             , 'custom-progress-summary-button enlightened'
                             , translationText.words.look_at.jp_kanji
                             , translationText.words.look_at.en_meaning
        ) }
        ${ generateSummaryHTML(burnedSummaryData
                             , 'custom-dashboard-progress-summary burned-summary'
                             , translationText.words.burned.jp_kanji + '（' + burnedSummaryData.totalCount + '）'
                             , translationText.words.burned.en_meaning + '（' + burnedSummaryData.totalCount + '）'
                             , true
                             , 'custom-progress-summary-button burned'
                             , translationText.words.look_at.jp_kanji
                             , translationText.words.look_at.en_meaning
        ) }
    `;
    let customDashboardProgressAfterContent = `
        ${ apprenticeSummaryItemsTableHTML }
        ${ guruSummaryItemsTableHTML }
        ${ masterSummaryItemsTableHTML }
        ${ enlightenedSummaryItemsTableHTML }
        ${ burnedSummaryItemsTableHTML }
    `;
    
    wlWanikaniDebug('html', '==SRS Summary: initialiseSrsSummaryComponent== Generated the following SRS Summary HTML:', { main_summary: customDashboardProgressContent, summary_details: customDashboardProgressAfterContent });
    $('.dashboard .custom-dashboard-progress-wrapper .custom-section.custom-dashboard-progress').append(customDashboardProgressContent);
    $('.dashboard .custom-dashboard-progress-wrapper').append(customDashboardProgressAfterContent);

    setProgressSummaryButtonEffects();
}


/*************************************************
 *  ANCHOR Add slide toggle effects to the SRS Progress Summary 'show'
 *  buttons to show SRS Progress Summary information
 *************************************************/
function setProgressSummaryButtonEffects() {
    $('.dashboard .custom-section.custom-dashboard-progress').find('.custom-progress-summary-button').each(function (index, item) {
        let currentProgressType = $(this).attr('class').replace('custom-button custom-progress-summary-button ', '').replace(' selected', '');
        let progressSummarySection = $('.dashboard .custom-dashboard-summary-items.' + currentProgressType);

        progressSummarySection.slideToggle();

        $(this).on('click', function() {
            wlWanikaniDebug('data', '==SRS Summary: setProgressSummaryButtonEffects== Clicked class type: ', currentProgressType);

            $(this).toggleClass('selected');
            progressSummarySection.slideToggle();
        });
    });
}