/*************************************************
 *  SUPERCEDED - Hides the completed progress items.
 *************************************************/
function hideCompleteProgressItems() {
    $('.progress-and-forecast .dashboard-progress .progress-entries').each(function() {
        let parentClasses = '';
        let progressEntry = $(this).find('.progress-entry');

        parentClasses += $(this).siblings('h2').text().toLowerCase();
        

        $(progressEntry).each(function() {
            if ($(this).find('.progress-entry__pips .bg-gray-300').length == 0) {
                $(this).addClass('hidden');
            }
        });

        parentClasses += ($(this).find('.progress-entry.hidden').length == $(this).find('.progress-entry').length) ? ' all-done' : '';

        $(this).parent('.rounded').addClass(parentClasses);
    });
};


function getreviewdata(data) {
    let nextReviewData = [];
    $.each(data.SummaryData.data.reviews, function(index, item) {
        if (item.subject_ids.length > 0) {
            let itemData = [];
            let refreshValue = new Date(item.available_at).toLocaleTimeString("en-AU", { timeZone: "Australia/Melbourne", hour: '2-digit' });
            itemData.text = refreshValue.includes('am') ? '午前' + refreshValue.replace(' am', '時') : '午後' + refreshValue.replace(' pm', '時');
            itemData.count = item.subject_ids.length;
            itemData.subjectIds = item.subject_ids;
            nextReviewData.push(itemData);
        }
    });
    console.log('review-data');
    console.log(nextReviewData);
}