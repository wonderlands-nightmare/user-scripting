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
                                                                     , translationText.words.apprentice
                                                                     , apprenticeSummaryItemsHTML
                                                                     );
    let guruSummaryItemsTableHTML = generateCustomItemsTableHTML(guruSummaryData
                                                               , 'custom-dashboard-summary-items guru'
                                                               , translationText.words.guru.jp_kanji
                                                               , translationText.words.guru
                                                               , guruSummaryItemsHTML
                                                               );
    let masterSummaryItemsTableHTML = generateCustomItemsTableHTML(masterSummaryData
                                                                 , 'custom-dashboard-summary-items master'
                                                                 , translationText.words.master.jp_kanji
                                                                 , translationText.words.master
                                                                 , masterSummaryItemsHTML
                                                                 );
    let enlightenedSummaryItemsTableHTML = generateCustomItemsTableHTML(enlightenedSummaryData
                                                                      , 'custom-dashboard-summary-items enlightened'
                                                                      , translationText.words.enlightened.jp_kanji
                                                                      , translationText.words.enlightened
                                                                      , enlightenedSummaryItemsHTML
                                                                      );
    let burnedSummaryItemsTableHTML = generateCustomItemsTableHTML(burnedSummaryData
                                                                 , 'custom-dashboard-summary-items burned'
                                                                 , translationText.words.burned.jp_kanji
                                                                 , translationText.words.burned
                                                                 , burnedSummaryItemsHTML
                                                                 );

    // NOTE Generate SRS Summary content HTML
    let enlightenedSummaryTotalCount = enlightenedSummaryData.totalCount >= 10000 ? '~' + (enlightenedSummaryData.totalCount / 1000).toFixed() + '千' : enlightenedSummaryData.totalCount;
    let customDashboardProgressContent = `
        ${ generateSummaryHTML(apprenticeSummaryData
                             , 'custom-dashboard-progress-summary apprentice-summary'
                             , translationText.words.apprentice.jp_kanji + '（' + apprenticeSummaryData.totalCount + '）'
                             , [translationText.words.apprentice, '（' + apprenticeSummaryData.totalCount + '）']
                             , true
                             , 'custom-progress-summary-button apprentice'
                             , translationText.words.look_at.jp_kanji
                             , [translationText.words.look_at]
        ) }
        ${ generateSummaryHTML(guruSummaryData
                             , 'custom-dashboard-progress-summary guru-summary'
                             , translationText.words.guru.jp_kanji + '（' + guruSummaryData.totalCount + '）'
                             , [translationText.words.guru, '（' + guruSummaryData.totalCount + '）']
                             , true
                             , 'custom-progress-summary-button guru'
                             , translationText.words.look_at.jp_kanji
                             , [translationText.words.look_at]
        ) }
        ${ generateSummaryHTML(masterSummaryData
                             , 'custom-dashboard-progress-summary master-summary'
                             , translationText.words.master.jp_kanji + '（' + masterSummaryData.totalCount + '）'
                             , [translationText.words.master, '（' + masterSummaryData.totalCount + '）']
                             , true
                             , 'custom-progress-summary-button master'
                             , translationText.words.look_at.jp_kanji
                             , [translationText.words.look_at]
        ) }
        ${ generateSummaryHTML(enlightenedSummaryData
                             , 'custom-dashboard-progress-summary enlightened-summary'
                             , translationText.words.enlightened.jp_kanji + '（' + enlightenedSummaryTotalCount + '）'
                             , [translationText.words.enlightened, '（' + enlightenedSummaryTotalCount + '）']
                             , true
                             , 'custom-progress-summary-button enlightened'
                             , translationText.words.look_at.jp_kanji
                             , [translationText.words.look_at]
        ) }
        ${ generateSummaryHTML(burnedSummaryData
                             , 'custom-dashboard-progress-summary burned-summary'
                             , translationText.words.burned.jp_kanji + '（' + burnedSummaryData.totalCount + '）'
                             , [translationText.words.burned, '（' + burnedSummaryData.totalCount + '）']
                             , true
                             , 'custom-progress-summary-button burned'
                             , translationText.words.look_at.jp_kanji
                             , [translationText.words.look_at]
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

    const disableLessons = wkof.settings[scriptId].disable_lessons && (apprenticeSummaryData.totalCount >= wkof.settings[scriptId].disable_lessons_limit);

    if (disableLessons) {
        $('.custom-button.custom-lessons-and-reviews-button.lessons-button').removeClass('has-lessons').removeAttr('href');
        $('.navigation-shortcut.navigation-shortcut--lessons > a').removeClass('has-lessons');
    }
}


/*************************************************
 *  ANCHOR Add slide toggle effects to the SRS Progress Summary 'show'
 *  buttons to show SRS Progress Summary information
 *************************************************/
function setProgressSummaryButtonEffects() {
    $('.dashboard .custom-section.custom-dashboard-progress').find('.custom-progress-summary-button').each((index, item) => {
        let currentProgressType = $(item).attr('class').replace('custom-button custom-progress-summary-button ', '').replace(' selected', '');
        let progressSummarySection = $('.dashboard .custom-dashboard-summary-items.' + currentProgressType);

        progressSummarySection.slideToggle();

        $(item).on('click', () => {
            wlWanikaniDebug('data', '==SRS Summary: setProgressSummaryButtonEffects== Clicked class type: ', currentProgressType);

            $(item).toggleClass('selected');
            progressSummarySection.slideToggle();
        });
    });
}