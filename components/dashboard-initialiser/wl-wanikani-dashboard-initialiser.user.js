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
let wkofItemsData = {};


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
    let newItemText = item == 'lessons' ? '授業' : '復習';
    let navHref = item == 'lessons' ? '/lesson/session' : '/review/start';
    let navHasClass = item == 'lessons' ? 'has-lessons' : 'has-reviews';

    navItem.text('').append('<span>' + navItemCount + '</span>' + newItemText);
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