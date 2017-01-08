var JobCard = function () {

    var modal_job = $('#modal_job');

    var handleCCInput = function () {
        var the = $('.inbox-compose .mail-to .inbox-cc');
        var input = $('.inbox-compose .input-cc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    }

    var handleBCCInput = function () {
        var the = $('.inbox-compose .mail-to .inbox-bcc');
        var input = $('.inbox-compose .input-bcc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
        });
    }

    return {

        init: function () {

            //handle compose/reply cc input toggle
            modal_job.on('click', '#tab_jobcard .mail-to .inbox-cc', function (e) {
                handleCCInput();
            });

            //handle compose/reply bcc input toggle
            modal_job.on('click', '#tab_jobcard .mail-to .inbox-bcc', function (e) {
                handleBCCInput();
            });
        }
    };

}();

jQuery(document).ready(function () {
    JobCard.init();
});