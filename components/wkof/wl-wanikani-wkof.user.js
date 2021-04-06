/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
const scriptName = 'Wanikani Custom Dashboard';
const scriptId = 'wanikani_custom_dashboard';
const dashboardUrlRegEx = /^https:\/\/(www|preview).wanikani.com\/(dashboard)?$/;
const sessionUrlRegEx = /^https:\/\/(www|preview).wanikani.com\/(lesson|review)\/session$/;
const reviewSummaryUrlRegEx = /^https:\/\/(www|preview).wanikani.com\/review$/;

// For dialog CSS since this file can't use GM
let wcdDialogCss = '';

// General WKOF item data config
const itemDataConfig = {
    wk_items: {
        options: {
            assignments: true,
            review_statistics: true
        },
        filters: {
            level: '1..+0'
        }
    }
};


/*************************************************
 *  ANCHOR Check if WKOF is installed
 *************************************************/
function wkofInstallCheck() {
    if (!wkof) {
        let response = confirm(scriptName + ' requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');
        if (response) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        };

        return;
    };
};


/*************************************************
 *  ANCHOR Get the primary WKOF data for all other functions
 *************************************************/
async function getWkofDataObject() {
    console.log('Running WKOF data retrieval.');
    let getWkofData = {};

    getWkofData.UsersData = await wkof.Apiv2.fetch_endpoint('user');
    getWkofData.SummaryData = await wkof.Apiv2.fetch_endpoint('summary');
    getWkofData.ItemsData = await wkof.ItemData.get_items(itemDataConfig);

    console.log('WKOF data retrieval complete.');
    return getWkofData;
};


/*************************************************
 *  ANCHOR Loads WKOF settings
 *************************************************/
function loadWkofSettings() {
    let defaults = {
        show_difficult_items: false,
        safe_level: 3,
        srs_stage: 4,
        identify_upcoming_difficult_items: false,
        identify_level_up: false,
        hover_translation: 1,
        selected_theme: 1,
        skip_session_summary: false
    };
    
    wkof.Settings.load(scriptId, defaults);
}


/*************************************************
 *  ANCHOR Loads WKOF menu
 *************************************************/
function loadWkofMenu() {
    let config = {
        name: scriptId,
        submenu: 'Settings',
        title: scriptName,
        on_click: openSettings
    };

    wkof.Menu.insert_script_link(config);
}


/*************************************************
 *  ANCHOR Initiates WKOF settings on open
 *************************************************/
function openSettings(items) {
    let config = {
        script_id: scriptId,
        title: scriptName,
        content: {
            wanikani_custom_dashabord_tabset: {
                type: 'tabset',
                content: {
                    settings_page: {
                        type: 'page',
                        label: 'Settings',
                        hover_tip: 'Main WaniKani Custom Dashboard settings.',
                        content: {
                            primary_settings: {
                                type: 'group',
                                label: 'Dashboard settings',
                                content: {
                                    difficult_items_header: {
                                        type: 'section',
                                        label: 'Difficult items'
                                    },
                                    show_difficult_items: {
                                        type: 'checkbox',
                                        label: 'Show Difficult Items section',
                                        hover_tip: 'Check if you want to see the Difficult Items section. Defaults to not show.',
                                        default: false
                                    },
                                    safe_level: {
                                        type: 'number',
                                        label: '"Safe Level" difference',
                                        hover_tip: 'This is a number that is subtracted from your current level, and defines what the maximum level of the Difficult Items is to show. Defaults to 3.',
                                        multi: false,
                                        min: 0,
                                        max: 59,
                                        default: 3
                                    },
                                    srs_stage: {
                                        type: 'dropdown',
                                        label: 'SRS Stage cap',
                                        hover_tip: 'The maximum SRS stage that a Difficult Item can be shown with. Default is Apprentice 4.',
                                        content: {
                                            1: 'Apprentice 1',
                                            2: 'Apprentice 2',
                                            3: 'Apprentice 3',
                                            4: 'Apprentice 4',
                                            5: 'Guru 1',
                                            6: 'Guru 2',
                                            7: 'Master',
                                            8: 'Enlightened',
                                            9: 'Burned'
                                        },
                                        default: 4
                                    },
                                    identify_upcoming_difficult_items: {
                                        type: 'checkbox',
                                        label: 'Highlight items that may move out of difficult items list',
                                        hover_tip: 'Check if you want to highlight the difficult items that are avaialble within the current or next review period (not future) that, if passed, will progress up above the currently set SRS Stage cap.',
                                        default: false
                                    },
                                    themes_header: {
                                        type: 'section',
                                        label: 'Custom themes'
                                    },
                                    selected_theme: {
                                        type: 'dropdown',
                                        label: 'Select theme',
                                        hover_tip: 'Select your prefered theme for the custom dashboard.',
                                        content: {
                                            1: 'Default',
                                            2: 'Dark'
                                        },
                                        default: 1
                                    },
                                    selected_compatibility_theme: {
                                        type: 'dropdown',
                                        label: 'Select compatibility theme',
                                        hover_tip: 'Select a compatibility theme for third party themes.',
                                        content: {
                                            1: 'None',
                                            2: 'WaniKani Breeze Dark'
                                        },
                                        default: 1
                                    },
                                    debug_header: {
                                        type: 'section',
                                        label: 'Debugging'
                                    },
                                    debug_data: {
                                        type: 'checkbox',
                                        label: 'Enable data debugging (refreshes on enable)',
                                        hover_tip: 'Check if you want to enable debugging for the WKOF data used and generated.',
                                        default: false
                                    },
                                    debug_html: {
                                        type: 'checkbox',
                                        label: 'Enable HTML debugging (refreshes on enable)',
                                        hover_tip: 'Check if you want to enable debugging for the HTML used and generated.',
                                        default: false
                                    },
                                    other_dashboard_settings_header: {
                                        type: 'section',
                                        label: 'Other dashboard settings'
                                    },
                                    identify_level_up: {
                                        type: 'checkbox',
                                        label: 'Identify if you might level up',
                                        hover_tip: 'Check if you want to identify if you might be able to level up in your current reviews or reviews in the immediate next review set.',
                                        default: false
                                    },
                                    hover_translation: {
                                        type: 'dropdown',
                                        label: 'Show translations/readings on hover (refreshes on changed value)',
                                        hover_tip: 'Check if you want the english translations or hiragana readings to show on mouse hover on the dashboard kanji headings.',
                                        content: {
                                            1: 'None',
                                            2: 'English',
                                            3: 'Hiragana',
                                            4: 'Both'
                                        },
                                        default: 1
                                    }
                                }
                            },
                            additional_settings: {
                                type: 'group',
                                label: 'Additional settings',
                                content: {
                                    skip_session_summary: {
                                        type: 'checkbox',
                                        label: 'Skip session summaries',
                                        hover_tip: 'Check if you want to skip the summary pages after lesson and review sessions.',
                                        default: false
                                    }
                                }
                            }
                        }
                    },
                    translations_page: {
                        type: 'page',
                        label: 'Translations',
                        hover_tip: 'Having trouble with all the Japanese? Here are the translations!',
                        content: {
                            words_group: {
                                type: 'group',
                                label: 'Words',
                                content: {
                                    words_html: {
                                        type: 'html',
                                        html: generateTranslationWords()
                                    }
                                }
                            },
                            sentences_phrases_group: {
                                type: 'group',
                                label: 'Sentences and phrases',
                                content: {
                                    sentences_phrases_html: {
                                        type: 'html',
                                        html: generateTranslationPhrases()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        on_save: (() => {
            if (window.location.href.match(dashboardUrlRegEx)) {
                generateDifficultItemsSection(wkofItemsData.AllData);
                setCustomDashboardTheme();
                setCustomDashboardCompatibilityTheme();
                initialiseLevelProgressComponent();
                // Must happen after everything else to force text colour check
                setTextColour();
                // Annoying if statement cause we don't need to reload if deselecting
                if (
                    (!dataDebugMode && wkof.settings[scriptId].debug_data)
                 || (!htmlDebugMode && wkof.settings[scriptId].debug_html)
                 || (showHoverTranslation != wkof.settings[scriptId].hover_translation)
                ) {
                    window.location.reload();
                }
            }
            if (window.location.href.match(sessionUrlRegEx)) {
                skipReviewLessonSummary();
            }
        }),
        on_close: (() => {
            if ($('.custom-dialog-css').length > 0) {
                $('.custom-dialog-css').remove();
            }
        })
    };
    let dialog = new wkof.Settings(config);
    dialog.open();
    removeInlineCssFromSettingsDialog();
};


/*************************************************
 *  ANCHOR Removes inline styles from WaniKani Custom Dashboard dialog
 *************************************************/
function removeInlineCssFromSettingsDialog() {
    let elementsToRemoveInlineStylesFrom = {
        mainDialog: '#wkof_ds div[role="dialog"]',
        mainDialogContent: '#wkof_ds #wkofs_wanikani_custom_dashboard.ui-dialog .ui-dialog-content'
    };

    if ($('.custom-dialog-css').length == 0) {
        let style = document.createElement('style');

        style.innerHTML = wcdDialogCss;
        style.className = 'custom-dialog-css';

        document.head.appendChild(style);
    }

    $.each(elementsToRemoveInlineStylesFrom, function (index) {
        $(elementsToRemoveInlineStylesFrom[index]).removeAttr('style');
    });
};


/*************************************************
 *  ANCHOR Settings html template generators
 *************************************************/
// NOTE Translation words
function generateTranslationWords() {
    let translationWordsHTML = '';

    $.each(translationText.words, function(index, textItem) {
        translationWordsHTML += `
            <div class="wcd-dialog-item wcd-dialog-word">
                ${ textItem.jp_kanji }
                </br>${ textItem.jp_reading }
                </br>${ textItem.en_meaning }
            </div>
        `;
    });

    return translationWordsHTML;
};


// NOTE Translation phrases
function generateTranslationPhrases() {
    let translationPhrasesHTML = '';

    $.each(translationText.phrases, function(index, textItem) {
        translationPhrasesHTML += `
            <div class="wcd-dialog-item wcd-dialog-sentence-phrase">
                ${ textItem.jp_kanji }
                </br>${ textItem.jp_reading }
                </br>${ textItem.en_meaning }
                </br>Notes: ${ textItem.en_notes }
            </div>
        `;
    });

    return translationPhrasesHTML;
};