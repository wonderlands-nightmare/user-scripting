/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
const scriptName = 'Wanikani Custom Dashboard';
const scriptId = 'wanikani_custom_dashboard';

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
        selected_theme: 1
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
                            selected_theme: {
                                type: 'dropdown',
                                label: 'Custom Dashboard theme',
                                hover_tip: 'Select your prefered theme for the custom dashboard.',
                                content: {
                                    1: 'Default',
                                    2: 'Dark'
                                },
                                default: 1
                            }
                        }
                    },
                    translations_page: {
                        type: 'page',
                        label: 'Translations',
                        hover_tip: 'Having trouble with all the Japanese? Here are the translations!',
                        content: {
                            words_phrases_group: {
                                type: 'group',
                                label: 'Words',
                                content: {
                                    words_html: {
                                        type: 'html',
                                        html: '<div class="wcd-dialog-item wcd-dialog-word">授業</br>じゅぎょう</br>Lesson</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">復習</br>ふくしゅう</br>Review</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">漢字</br>かんじ</br>Kanji</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">部首</br>ぶしゅ</br>Radical</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">単語</br>たんご</br>Vocabulary</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見習</br>みならい</br>Apprentice</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">達人</br>たつじん</br>Guru</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">主人</br>しゅじん</br>Master</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">悟りを開いた</br>さとりをひらいた</br>Enlightened</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">焼け</br>やけ</br>Burned</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">見せて</br>みせて</br>Look at</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">音読み</br>おんよみ</br>Onyomi</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">訓読み</br>くんよみ</br>Kunyomi</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">名乗り</br>なのり</br>Nanori</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">苦労</br>くろう</br>Difficult</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">レベルすすむ</br>れべるすすむ</br>Level progress</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-word">漢字ロック</br>かんじろっく</br>Kanji locked</div>'
                                    }
                                }
                            },
                            sentences_phrases_group: {
                                type: 'group',
                                label: 'Sentences and phrases',
                                content: {
                                    sentences_phrases_html: {
                                        type: 'html',
                                        html: '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">漢字と部首と単語が合計'
                                            + '</br>かんじとぶしゅとたんごがごうけい'
                                            + '</br>Total number of kanji, radicals and vocabulary'
                                            + '</br>A general statement sentence.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">次の復習をなんでもない'
                                            + '</br>つぎのふくしゅうをなんでもない'
                                            + '</br>No next review'
                                            + '</br>Highlights when there is no reviews available for the next 24 hours.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">午前__時の次の復習　・　午後__時の次の復習'
                                            + '</br>ごぜん__じのつぎのふくしゅ　・　ごご__じのつぎのふくしゅ'
                                            + '</br>Next review at __ am/pm'
                                            + '</br>These two statements are repeated with the hour that the review is due. 前（ぜん）is AM and 後（ご）is PM.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__を開始'
                                            + '</br>__をかいし'
                                            + '</br>__ start'
                                            + '</br>This phrase is repeated for both Lesson and Review section buttons.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__進行中'
                                            + '</br>__しんこうちゅう'
                                            + '</br>__ in progress'
                                            + '</br>This phrase is repeated for Kanji and Radicals in the current Level Progress section.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">__合格'
                                            + '</br>__ごうかく'
                                            + '</br>__ passed'
                                            + '</br>This phrase is repeated for Kanji and Radicals in the current Level Progress section.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">君は__項目をあります!'
                                            + '</br>きみは__こうもくをあります'
                                            + '</br>You have __ items!'
                                            + '</br>This sentence is repeated when there are items to be looked at in all main sections.</div>'
                                            + '<div class="wcd-dialog-item wcd-dialog-sentence-phrase">ごめんなさい, 君は__項目をありません.'
                                            + '</br>ごめんなさい、君は__こうもくをありません。'
                                            + "</br>Sorry, you don't have any __ items."
                                            + '</br>This sentence is repeated when there are no items to be looked at in any of the main sections.</div>'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        on_save: (() => {
            generateDifficultItemsSection(wkofItemsData.AllData);
            setCustomDashboardTheme();
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
}