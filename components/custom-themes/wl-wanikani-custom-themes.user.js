/*************************************************
 *  ANCHOR Sets custom dashboard theme on save/load
 *************************************************/
function setCustomDashboardTheme() {
    if ($('.custom-dashboard-theme-css').length > 0) {
        $('.custom-dashboard-theme-css').remove();
    }

    let style = document.createElement('style');

    style.innerHTML = getResourceText(dashboardResources.customTheme[wkof.settings[scriptId].selected_theme].css);
    style.className = 'custom-dashboard-theme-css';

    document.head.appendChild(style);
}