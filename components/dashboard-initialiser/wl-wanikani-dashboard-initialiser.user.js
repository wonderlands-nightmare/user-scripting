/*************************************************
 *  ANCHOR Component initialisation
 *************************************************/
function initialiseDashboardInitialiserComponent() {
    dashboardLoader();
    generateDashboardWrapperHTML();
    updateShortcutNavigation('lessons');
    updateShortcutNavigation('reviews');
}


/*************************************************
 *  ANCHOR Variable initialisation
 *************************************************/
// NOTE Global data variable
let wkofItemsData = {
    AllData: {},
    DifficultItems: {},
    NextRevewItems: new Array(),
    SafeLevel: {}
};

let showHoverTranslation = wkof.settings[scriptId].hover_translation;

const translationText = {
    words: {
        lesson: {
            en_meaning: 'Lesson',
            jp_kanji: '授業',
            jp_reading: 'じゅぎょう'
        },
        review: {
            en_meaning: 'Review',
            jp_kanji: '復習',
            jp_reading: 'ふくしゅう'
        },
        am: {
            en_meaning: '__am',
            jp_kanji: '前__',
            jp_reading: 'ぜん__'
        },
        pm: {
            en_meaning: '__pm',
            jp_kanji: '後__',
            jp_reading: 'ご__'
        },
        kanji: {
            en_meaning: 'Kanji',
            jp_kanji: '漢字',
            jp_reading: 'かんじ'
        },
        radical: {
            en_meaning: 'Radical',
            jp_kanji: '部首',
            jp_reading: 'ぶしゅ'
        },
        vocabulary: {
            en_meaning: 'Vocabulary',
            jp_kanji: '単語',
            jp_reading: 'たんご'
        },
        apprentice: {
            en_meaning: 'Apprentice',
            jp_kanji: '見習',
            jp_reading: 'みならい'
        },
        guru: {
            en_meaning: 'Guru',
            jp_kanji: '達人',
            jp_reading: 'たつじん'
        },
        master: {
            en_meaning: 'Master',
            jp_kanji: '主人',
            jp_reading: 'しゅじん'
        },
        enlightened: {
            en_meaning: 'Enlightened',
            jp_kanji: '悟りを開いた',
            jp_reading: 'さとりをひらいた'
        },
        burned: {
            en_meaning: 'Burned',
            jp_kanji: '焼け',
            jp_reading: 'やけ'
        },
        look_at: {
            en_meaning: 'Look at',
            jp_kanji: '見せて',
            jp_reading: 'みせて'
        },
        onyomi: {
            en_meaning: 'Onyomi',
            jp_kanji: '音読み',
            jp_reading: 'おんよみ'
        },
        kunyomi: {
            en_meaning: 'Kunyomi',
            jp_kanji: '訓読み',
            jp_reading: 'くんよみ'
        },
        nanori: {
            en_meaning: 'Nanori',
            jp_kanji: '名乗り',
            jp_reading: 'なのり'
        },
        meaning: {
            en_meaning: 'Meaning',
            jp_kanji: '意味',
            jp_reading: 'いみ'
        },
        difficult: {
            en_meaning: 'Difficult',
            jp_kanji: '苦労',
            jp_reading: 'くろう'
        },
        level_progress: {
            en_meaning: 'Level progress',
            jp_kanji: 'レベルすすむ',
            jp_reading: 'れべるすすむ'
        },
        kanji_locked: {
            en_meaning: 'Kanji locked',
            jp_kanji: '漢字ロック',
            jp_reading: 'かんじろっく'
        }
    },
    phrases: {
        totals_summary: {
            en_meaning: 'Total number of kanji, radicals and vocabulary',
            en_notes: 'A general statement sentence.',
            jp_kanji: '漢字と部首と単語の合計',
            jp_reading: 'かんじとぶしゅとたんごがごうけい'
        },
        no_next_review: {
            en_meaning: 'No next review',
            en_notes: 'Highlights when there is no reviews available for the next 24 hours.',
            jp_kanji: '次の復習をなんでもない',
            jp_reading: 'つぎのふくしゅうをなんでもない'
        },
        next_review: {
            en_meaning: 'Next review at __',
            en_notes: 'This shows the hour that the next review is due.',
            jp_kanji: '午__時の次の復習',
            jp_reading: 'ご__じのつぎのふくしゅ'
        },
        lesson_review_start: {
            en_meaning: '__ start',
            en_notes: 'This phrase is repeated for both Lesson and Review section buttons.',
            jp_kanji: '__を開始',
            jp_reading: '__をかいし'
        },
        items_in_progress: {
            en_meaning: '__ in progress',
            en_notes: 'This phrase is repeated for Kanji and Radicals in the current Level Progress section.',
            jp_kanji: '__進行中',
            jp_reading: '__しんこうちゅう'
        },
        items_passed: {
            en_meaning: '__ passed',
            en_notes: 'This phrase is repeated for Kanji and Radicals in the current Level Progress section.',
            jp_kanji: '__合格',
            jp_reading: '__ごうかく'
        },
        have_items: {
            en_meaning: 'You have __ items!',
            en_notes: 'This sentence is repeated when there are items to be looked at in all main sections.',
            jp_kanji: '君は__項目をあります!',
            jp_reading: 'きみは__こうもくをあります'
        },
        have_no_items: {
            en_meaning: "Sorry, you don't have any __ items.",
            en_notes: 'This sentence is repeated when there are no items to be looked at in a main section.',
            jp_kanji: 'ごめんなさい, 君は__項目をありません.',
            jp_reading: 'ごめんなさい、君は__こうもくをありません.'
        }
    }
};


/*************************************************
 *  ANCHOR Add pulse effect for lesson and review buttons
 *************************************************/
function addReviewAndLessonButtonPulseEffect(buttonSelector, buttonCount, buttonHref, buttonClass) {
    if (buttonCount > 0) {
        $(buttonSelector).addClass(buttonClass).attr('href', buttonHref);
    }
    else {
        $(buttonSelector).removeClass(buttonClass);
    }
};


/*************************************************
 *  ANCHOR Add a loading animation to the page while the dashboard HTML
 *  is generated
 *************************************************/
function dashboardLoader(loaded = false) {
    const loaderClass = 'custom-dashboard-loader';

    if (loaded) {
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }
        
        $('.dashboard').show();
    }
    else {
        // Yes this doubles up but is just in case a cache/reload issue happens and the loader exists on the page
        if ($('.' + loaderClass).length > 0) {
            $('.' + loaderClass).remove();
        }

        $('.dashboard').hide();

        $('<div class="' + loaderClass + '"></div>').insertAfter('.footer-adjustment #search');
    }

    // Dashboard seems to sit under the WaniKani Header, so this is to force window to top
    window.scrollTo(window.top);
}


/*************************************************
 *  ANCHOR Alter the Lesson and Review shortcut navigations to be in
 *  Japanese
 *************************************************/
function updateShortcutNavigation(item) {
    let navItem = $('.navigation-shortcut.navigation-shortcut--' + item + ' a');
    let navItemCount = $(navItem).find('span').text();
    let newItemText = item == 'lessons' ? translationText.words.lesson.jp_kanji : translationText.words.review.jp_kanji;
    let newItemHoverText = item == 'lessons' ? translationText.words.lesson : translationText.words.review;
    let navHref = item == 'lessons' ? '/lesson/session' : '/review/start';
    let navHasClass = item == 'lessons' ? 'has-lessons' : 'has-reviews';

    navItem.text('').append('<span>' + navItemCount + '</span>' + newItemText);
    // 2 - English
    if (showHoverTranslation == 2) {
        navItem.attr('title', newItemHoverText.en_meaning);
    }
    // 3 - Hiragana
    else if (showHoverTranslation == 3) {
        navItem.attr('title', newItemHoverText.jp_reading);
    }
    // 4 - Both
    else if (showHoverTranslation == 4) {
        navItem.attr('title', `${ newItemHoverText.jp_reading } - ${ newItemHoverText.en_meaning }`);
    }

    $('.navigation-shortcuts').addClass('hidden');

    $(window).scroll(function() {
        if ($(window).scrollTop() >= 150) {
            $('.navigation-shortcuts').removeClass('hidden');
        }
        else {
            $('.navigation-shortcuts').addClass('hidden');
        }
    });

    addReviewAndLessonButtonPulseEffect(navItem, navItemCount, navHref, navHasClass);
};


/*************************************************
 *  ANCHOR Generate custom dashboard wrapper
 *************************************************/
function generateDashboardWrapperHTML() {
    wlWanikaniDebug('html', '==Dashboard Initialiser: generateDashboardWrapperHTML== Generating custom dashboard wrapper HTML:');

    let mainDashboard = $('.dashboard .container .row .span12');
    
    // NOTE Custom dashboard wrapper HTML, empty div with 'row' class is for other script compatibility
    let dashboardWrapperHTML = `
        <section class="custom-section custom-lessons-and-reviews progress-and-forecast"></section>
        <div class="custom-dashboard-progress-wrapper srs-progress">
            <section class="custom-section custom-dashboard-progress"></section>
        </div>
        <div class="row"></div>
    `;

    // NOTE Remove any existing dashboard elements
    mainDashboard.find('> div').remove();
    mainDashboard.find('> .srs-progress').remove();

    // Purely in case cache issue occurs, it cleans out the section the above removes wouldn't
    if (mainDashboard.find('> .custom-lessons-and-reviews').length > 0) {
        mainDashboard.find('> .custom-lessons-and-reviews').remove();
    }
    
    // NOTE Add custom dashboard wrappers to page
    mainDashboard.append(dashboardWrapperHTML);

    wlWanikaniDebug('html', '==Dashboard Initialiser: generateDashboardWrapperHTML== Generated the following custom dashboard wrapper HTML:', { main_html: dashboardWrapperHTML });
};


/*************************************************
 *  ANCHOR Generate a hover title attribute and value
 *************************************************/
function getHoverTitle(translationItem, extraText = '', isPhrase = false, replacementItem = '') {
    let hoverTitle = '';
    
    // 1 - None
    if (showHoverTranslation != 1) {
        let hoverText = '';
        // 2 - English
        if (showHoverTranslation == 2) {
            hoverText = isPhrase
                      ? translationItem.en_meaning.replace('__', replacementItem.en_meaning)
                      : translationItem.en_meaning;
        }
        // 3 - Hiragana
        else if (showHoverTranslation == 3) {
            hoverText = isPhrase
                      ? translationItem.jp_reading.replace('__', replacementItem.jp_reading)
                      : translationItem.jp_reading;
        }
        // 4 - Both
        else if (showHoverTranslation == 4) {
            hoverText = isPhrase
                      ? `${ translationItem.jp_reading.replace('__', replacementItem.jp_reading) } - ${ translationItem.en_meaning.replace('__', replacementItem.en_meaning) }`
                      : `${ translationItem.jp_reading } - ${ translationItem.en_meaning }`;
        }
        
        hoverTitle = ` title="${ hoverText }${ extraText }"`;
    }

    wlWanikaniDebug('html', '==Dashboard Initialiser: getHoverTitle== Generated the following title HTML:', { translation_item: translationItem, hover_title: hoverTitle });
    return hoverTitle;
};