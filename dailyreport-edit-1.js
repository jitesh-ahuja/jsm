var DailyReportEdit_01 = function () {

    var handleDailyReports = function () {

        $('#frm_daily-report').find('#CrewId').change(function () {

            var crewId = $(this).val();
            if (crewId > 0)
                fillDropdownList({
                    target: $('#frm_daily-report').find('.crew-members'),
                    url: '/crew/listfordropdown',
                    data: { id: crewId }
                });
            else {
                $('#frm_daily-report').find('.crew-members option[value=""]').attr("selected", true)
            }
        });

        $(document).ready(function () {
            var count = $('#frm_daily-report').find('.lnk_add_routelog').data('count')
            if (count != 0) {
                for (var i = 0; i < count; i++) {
                    var clientId = $('#frm_daily-report').find('#RouteLogs_' + i + '__ClientId').val();
                    $('#frm_daily-report').find('#RouteLogs_' + i + '__ClientId option[value=' + clientId + ']').attr("selected", true)
                    var paymentId = $('#frm_daily-report').find('#RouteLogs_' + i + '__PaymentModeId').val();
                    $('#frm_daily-report').find('#RouteLogs_' + i + '__PaymentModeId option[value=' + paymentId + ']').attr("selected", true)
                }
            }
        });

        //back button
        $('#btn_back').on('click', function (e) {
            window.location.href = '/dailyreports';
        });

        var newLog = $('#newrow');
        var logTable = $('#LogDetails');
        $(".lnk_add_routelog").click(function (e) {
            e.preventDefault();
            var index = $(this).data('count');
            var clone = newLog.clone();
            clone.html($(clone).html().replace(/#/g, index));
            var row = clone.find('tr');
            logTable.append(row);
            bindList(index);
            $(this).data('count', (+index + 1));
        });

        function bindList(index) {
            $.ajax({
                url: '/dailyreport/binddatatodropdown',
                success: function (data) {
                    $.each(data.Clientlist, function (i, item) {
                        $("#RouteLogs_" + index + "__ClientId").append($('<option>', {
                            value: item.Value,
                            text: item.Text
                        }));
                    });
                    $.each(data.PaymentMode, function (i, item) {
                        $("#RouteLogs_" + index + "__ClientId_payment").append($('<option>', {
                            value: item.Value,
                            text: item.Text
                        }));
                    });
                }
            });
            $('#frm_daily-report').find('.cleaning-time').timepicker({ autoclose: true, minuteStep: 5 });
        }
        $('#frm_daily-report').find('.cleaning-time').timepicker({ autoclose: true, minuteStep: 5 });

        //set driver license
        $('#frm_daily-report').on('change', '#DriverId', function (e) {
            $('#frm_daily-report').find('#DriverLicense').val('')
            $('#frm_daily-report').find('#driver_license').text('')
            var id = $(this).val();
            if (id > 0)
                $.ajax({
                    url: '/dailyreport/getdriverlicense',
                    data: { id: id },
                    success: function (result) {
                        $('#frm_daily-report').find('#DriverLicense').val(result.license)
                        $('#frm_daily-report').find('#driver_license').text(result.license)

                    }
                });
        });

        //set account number
        $('#frm_daily-report').on('change', '.client-id', function (e) {
            var id = $(this).val();
            var accountText = $(this).attr('id')
            $('#frm_daily-report').find('#' + accountText).val(id);
            var accountId = accountText.substring(0, 11);
            $('#frm_daily-report').find('#' + accountId + '__ClientId_number').val('')
            $('#frm_daily-report').find('.' + accountId + '__ClientId_number').text('')
            if (id > 0)
                $.ajax({
                    url: '/dailyreport/getclientaccountnumber',
                    data: { id: id },
                    success: function (result) {
                        $('#frm_daily-report').find('#' + accountId + '-account_number').val(result.accountnumber)
                        $('#frm_daily-report').find('.' + accountId + '-account_number').text(result.accountnumber)
                    }
                });
        });

        //set paymentmode
        $('#frm_daily-report').on('change', '.payment-mode', function (e) {
            var id = $(this).val();
            var paymentMode = $(this).attr('id');
            $('#frm_daily-report').find('#' + paymentMode).val(id);
        });

        //calculate total miles
        $('#frm_daily-report').on('keyup', '.miles', function (e) {
            totalDailyMiles();
        });

        function totalDailyMiles() {
            var startMiles = $('#frm_daily-report').find('#StartMi').val();
            var endMiles = $('#frm_daily-report').find('#EndMi').val();
            if (startMiles != '' & endMiles != '') {
                var dailyMiles = parseInt(endMiles) - parseInt(startMiles);

                if (dailyMiles < 0)
                {
                    dailyMiles = 0;
                }

                $('#frm_daily-report').find('#DailyMi').val(dailyMiles);
                $('#frm_daily-report').find('#daily_miles').text(dailyMiles);
            }
        }

        //calculate team time
        $('#frm_daily-report').on('change', '.report-time', function (e) {
            teamTimeCalculation();
        })

        $('#frm_daily-report').on('keyup', '#MinusTime', function (e) {
            teamTimeCalculation();
        });

        function teamTimeCalculation() {
            var timeIn = $('#frm_daily-report').find('#StartTime').val();
            var timeOut = $('#frm_daily-report').find('#EndTime').val();
            var minusTime = $('#frm_daily-report').find('#MinusTime').val();
            var timeStart = new Date("01/01/2007 " + timeIn);
            var timeEnd = new Date("01/01/2007 " + timeOut);
            var diff = (timeEnd - timeStart) / 60000;

            //minus the team time (in minutes)
            diff = diff - minusTime;
            
            var minutes = diff % 60;
            var hours = (diff - minutes) / 60;
            
            if (hours > 0 || minutes >0)
            {
                totalTime = hours + ':' + minutes;
            }
            else {
                totalTime = "00:00";
            }

            $('#frm_daily-report').find('#TeamTime').val(totalTime);
        }

        //calculate total time
        $('#frm_daily-report').on('change', '.cleaning-time', function (e) {
            var timeOutId = $(this).attr('id');
            totalTimeCalculation(timeOutId)
        })

        function totalTimeCalculation(timeOutId) {
            $('#frm_daily-report').find('#StartTime' + timeOutId + '_total').val('');
            $('#frm_daily-report').find('.' + timeOutId + '-total').text('');
            var timeIn = $('#frm_daily-report').find('.' + timeOutId + '-in').val();
            var timeOut = $('#frm_daily-report').find('.' + timeOutId + '-out').val();

            var timeStart = new Date("01/01/2007 " + timeIn);
            var timeEnd = new Date("01/01/2007 " + timeOut);

            var diff = (timeEnd - timeStart) / 60000;

            var minutes = diff % 60;
            var hours = (diff - minutes) / 60;

            totalTime = hours + ':' + minutes;
            if (timeIn != '' & timeOut != '') {
                $('#frm_daily-report').find('#' + timeOutId + '_total').val(totalTime);
                $('#frm_daily-report').find('.' + timeOutId + '-total').text(totalTime);
            }
            else {
                $('#frm_daily-report').find('#' + timeOutId + '_total').val("00:00");
                $('#frm_daily-report').find('.' + timeOutId + '-total').text('00:00');
            }
        }

        //calculate amount due
        $('#frm_daily-report').on('keyup', '.amount', function (e) {
            var amountId = $(this).attr('id');
            amountDueCalculation(amountId)
        })

        function amountDueCalculation(amountId) {
            var totalAmount = $('#frm_daily-report').find('.' + amountId + '_totalamount').val();
            var amountPaid = $('#frm_daily-report').find('.' + amountId + '_amountpaid').val();
            var amountDue = parseInt(totalAmount) - parseInt(amountPaid);
            if (amountPaid != '') {
                $('#frm_daily-report').find('#' + amountId + '_amountdue').val(amountDue);
                $('#frm_daily-report').find('.' + amountId + '-amountdue').text(amountDue);
            }
            else {
                $('#frm_daily-report').find('#' + amountId + '_amountdue').val(amountDue);
                $('#frm_daily-report').find('.' + amountId + '-amountdue').text(totalAmount);
            }
        }

        //set route lod status
        $('#frm_daily-report').on('click', '.close', function (e) {
            var closeId = $(this).attr('id');
            $('#frm_daily-report').find('#Deleted' + closeId).val("true");
            $(this).closest('tr').css('visibility', 'hidden');

        });
    }
    return {

        init: function () {

            handleDailyReports();
        }
    };
}();

jQuery(document).ready(function () {
    DailyReportEdit_01.init();
});