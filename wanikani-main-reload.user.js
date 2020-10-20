(function() {
    let counter = 0

    function refreshPromise() {
        let currentHour = new Date().getHours() % 12 || 12;
        let nextReviewHour = $('.forecast table.w-full > tbody:first-child > tr.review-forecast__hour:nth-child(2) time').text().replace(/ am| pm/gi, '');

        if (currentHour == nextReviewHour) {
            location.reload();
        }
        else {
            setTimeout(refreshPromise, 600000);
            console.log('Reset timeout: ' + counter);
            counter = counter + 1
        }
    };

    refreshPromise();
})();