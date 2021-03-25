/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
// For theme CSS since this file can't use GM
let customThemeCss = {
    1: '',
    2: ''
};
let customCompatibilityThemeCss = {
    1: '',
    2: ''
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
function setCustomDashboardCompatibilityTheme() {
    if ($('.custom-dashboard-compatibility-theme-css').length > 0) {
        $('.custom-dashboard-compatibility-theme-css').remove();
    }

    let style = document.createElement('style');

    style.innerHTML = customCompatibilityThemeCss[wkof.settings[scriptId].selected_compatibility_theme];
    style.className = 'custom-dashboard-compatibility-theme-css';

    document.head.appendChild(style);
}