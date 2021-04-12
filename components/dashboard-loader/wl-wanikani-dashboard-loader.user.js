/*************************************************
 *  ANCHOR Add a loading animation to the page while the dashboard HTML
 *  is generated
 *************************************************/
function dashboardLoader(loaded = false, failedToLoad = false) {
    let loaderHTML = `
        <div class="custom-dashboard-loader">
            <div class="load-indicator"></div>
        </div>
    `;
    const loaderClass = '.custom-dashboard-loader'
    const failMessage = `
            <div class="load-failure">
                <h2>Loading has taken longer than 10 seconds, please check your internet connection and the browser console output for issues/errors and try a refresh.</h2>
            </div>
    `;

    if (loaded) {
        if ($(loaderClass).length > 0) {
            $(loaderClass).remove();
        }
        
        $('.dashboard').show();
    }
    else if (!loaded && !failedToLoad) {
        // Yes this doubles up but is just in case a cache/reload issue happens and the loader exists on the page
        if ($(loaderClass).length > 0) {
            $(loaderClass).remove();
        }

        $('.dashboard').hide();

        $(loaderHTML).insertAfter('.footer-adjustment #search');
    }
    else if (failedToLoad) {
        $(failMessage).insertAfter(loaderClass);
    }

    // Dashboard seems to sit under the WaniKani Header, so this is to force window to top
    window.scrollTo(window.top);
}