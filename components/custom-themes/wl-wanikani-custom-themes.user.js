/*************************************************
 *  ANCHOR Variable initialisations
 *************************************************/
// For theme CSS since this file can't use GM
let customThemeCss = {
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