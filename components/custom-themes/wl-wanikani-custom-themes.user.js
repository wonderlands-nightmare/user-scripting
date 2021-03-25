/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
// For theme CSS since this file can't use GM
let customThemeCss = {
    1: '',
    2: ''
};
let customCompatabilityThemeCss = {
    1: ''
};


/*************************************************
 *  ANCHOR Sets custom dashboard theme on save/load
 *************************************************/
function setCustomDashboardTheme() {
    if ($('.custom-dashboard-theme-css').length > 0) {
        $('.custom-dashboard-theme-css').remove();
    }

    let style = document.createElement('style');

    style.innerHTML = customThemeCss[wkof.settings[scriptId].selected_theme];
    style.className = 'custom-dashboard-theme-css';

    document.head.appendChild(style);
}

// NOTE For making theming compatible with UserStyles
function setCustomDashboardCompatabilityTheme() {
    if ($('.custom-dashboard-compatability-theme-css').length > 0) {
        $('.custom-dashboard-compatability-theme-css').remove();
    }

    let style = document.createElement('style');

    style.innerHTML = customCompatabilityThemeCss[wkof.settings[scriptId].selected_compatability_theme];
    style.className = 'custom-dashboard-compatability-theme-css';

    document.head.appendChild(style);
}