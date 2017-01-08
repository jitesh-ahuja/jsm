var Scheduler = function () {

    var modal_job = $('#modal_job');

    //job - create
    var createJob = function (date) {
        modal_job.find('.modal-title').html('Add Job');
        modal_job.data('mode', 'create');

        var clientId = $(this).data('id');

        showModal({
            url: '/job/create',
            vm: modal_job,
            callback: function () {
                $('#frm_job').find('#ClientId').val(clientId).change();
                $('#frm_job').find('#StartDate').val(date);
                $('#frm_job').find('#EndDate').val(date);
            }
        });
    }

    var handleJobs = function () {

        modal_job.on('shown.bs.modal', function () { $(this).find('#ClientId').focus(); });

        //job - create - get        
        $('.scheduler-searchform').on('click', '.btn-new-job', function (e) {
            e.preventDefault();
            createJob(moment(new Date()).format('MM/DD/YYYY'));
        });

        //job - edit - get        
        $('body').on('click', '.btn-edit-job', function (event) {
            event.preventDefault();

            modal_job.find('.modal-title').html('Edit Job');
            modal_job.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/job/edit',
                vm: modal_job
            });
        });

        //job - save
        modal_job.on('click', '.btn-save', function (e) {
            var id = $('#frm_job').find('#Id').val();
            var fieldWorkerId = $('#frm_job').find('#FieldWorkerId').val();
            var start = $('#frm_job').find('#StartDate').val() + " " + $('#frm_job').find('#StartTime').val();
            var end = $('#frm_job').find('#EndDate').val() + " " + $('#frm_job').find('#EndTime').val();
            var crewId = $('#frm_job').find('#CrewId').val();
            var data = { id: id, fieldWorkerId: fieldWorkerId, crewId: crewId, start: start, end: end }
            if (crewId > 0 || fieldWorkerId > 0) {
                $.ajax({
                    url: '/job/checkworkeravailability',
                    data: data,
                    success: function (result) {
                        if (result.success && crewId > 0) {
                            if (result.available > 0)
                                toastr.error("This team is not available in this time slot");
                            else if (result.members.length > 0)
                                ShowTeamAvailability(result.members, "The following field worker(s) are not available in the selected time slot:");
                            else
                                SaveJob();
                        }
                        else if (result.success && fieldWorkerId > 0) {
                            if (result.available > 0)
                                toastr.error("This field worker is not available in this time slot");
                            else if (result.members.length > 0)
                                ShowTeamAvailability(result.members, "This field worker is associated with following team in the selected time slot:");
                            else
                                SaveJob();
                        }
                    },
                })
            }
            else {
                SaveJob();
            }
        });

        function ShowTeamAvailability(crewMembers, message) {
            var message = '<span class="msg-delete">' + message + '</span>';
            var lst = $('<ul/>').addClass('list-associate');
            $.each(crewMembers, function (index, value) {
                $('<li/>').text(value).appendTo(lst);
            });
            message += $('<span/>').append(lst).html();
            message += '<div class="bootbox-body">Are you sure to proceed to create a job?</div>'
            bootbox.confirm({
                title: "Confirmation",
                message: message,
                buttons: {
                    confirm: {
                        label: 'Proceed',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'Cancel',
                    }
                },
                callback: function (result) {
                    if (result)
                        SaveJob();
                }
            });
        }

        function SaveJob() {
            if ($('#frm_job').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/job/' + modal_job.data('mode'),
                    data: $('#frm_job').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_job.modal('hide');
                            toastr.success(result.message);
                            refreshJobList();
                        } else {
                            modal_job.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        }
    }

    var handleSchedulers = function () {

        if (!jQuery().fullCalendar) {
            return;
        }

        var h = {};

        if ($('#calendar').parents(".portlet").width() <= 720) {
            $('#calendar').addClass("mobile");
            h = {
                left: 'title, prev, next',
                center: '',
                right: 'today,month,agendaWeek,agendaDay'
            };
        } else {
            $('#calendar').removeClass("mobile");
            h = {
                left: 'title',
                center: '',
                right: 'prev,next,today,month,agendaWeek,agendaDay'
            };
        }

        $('#calendar').fullCalendar('destroy'); // destroy the calendar

        var data = { query: '', jobTypeId: '', fieldWorkerId: '', assignedJobId: '' };
        calender(data);

        function calender(data) {
            $('#calendar').fullCalendar({ //re-initialize the calendar
                dayClick: function (date, jsEvent, view) {
                    createJob(moment(date.format()).format('MM/DD/YYYY'));
                },
                header: h,
                defaultView: 'month', // change default view with available options from http://arshaw.com/fullcalendar/docs/views/Available_Views/ 
                slotMinutes: 15,
                editable: true,
                lazyFetching: true,
                droppable: false, // this allows things to be dropped onto the calendar !!!
                drop: function (date, allDay) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');
                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    copiedEventObject.allDay = allDay;
                    copiedEventObject.className = $(this).attr("data-class");

                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                    $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                },
                events: {
                    type: 'POST',
                    url: '/scheduler/calendar/',
                    data: { search: data.query, jobTypeId: data.jobTypeId, fieldWorkerId: data.fieldWorkerId, assignedJobId: data.assignedJobId },
                    error: function () {
                        toastr.error('There was an error while fetching events!');
                    },
                },
                loading: function (bool) {
                    var el = $('.calendar');
                    if (bool) {
                        App.blockUI({ target: el, animate: true, overlayColor: 'none' });
                    }
                    else {
                        App.unblockUI(el);
                    }
                },
                timeFormat: 'HH:mm',
                eventRender: function (event, element) {
                    element.popover({
                        title: event.title,
                        placement: 'auto',
                        content: event.content + ' <a class="btn-edit-job" href="javascript:;" data-id="' + event.id + '"><i class="fa fa-pencil"></i></a>',
                        trigger: 'click',
                        html: true,
                        container: 'body'
                    });
                }
            });
        }

        // search
        $('#btn_search').click(function (e) {

            e.preventDefault();
            $('#calendar').fullCalendar('destroy');
            var query = $('#Query').val();
            var jobTypeId = $('#TypeId').val();
            var fieldWorkerId = $('#FieldWorkerId').val();
            var assignedJobId = $('#AssignedJobId').val();
            var data = { query: query, jobTypeId: jobTypeId, fieldWorkerId: fieldWorkerId, assignedJobId: assignedJobId };
            calender(data);

        });

        // search reset
        $('#btn_reset').click(function (e) {
            $('#calendar').fullCalendar('destroy');
            calender(data);
        });

    }


    var handleJobTypes = function () {

        var modal_jtype = $('#modal_jtype');
        modal_jtype.on('shown.bs.modal', function () { $(this).find('#Title').focus(); })

        //job type - create - get
        modal_job.on('click', '#box_jtype .btn-add', function (e) {
            e.preventDefault();

            modal_jtype.find('.modal-title').html('Add Job Type');
            modal_jtype.data('mode', 'create');

            showModal({
                url: '/jobtype/create',
                vm: modal_jtype
            });
        });

        //job type - save
        modal_jtype.on('click', '.btn-save', function (e) {
            if ($('#frm_jtype').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/jobtype/' + modal_jtype.data('mode'),
                    data: $('#frm_jtype').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_jtype.modal('hide');
                            toastr.success(result.message);
                            fillDropdownList({
                                target: $('#frm_job').find('#TypeId'),
                                url: '/jobtype/listfordropdown',
                                callback: function () { $('#frm_job').find('#TypeId').val(result.id) }
                            });
                        } else {
                            modal_jtype.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

    }

    var handleJobStatuses = function () {

        var modal_jstatus = $('#modal_jstatus');
        modal_jstatus.on('shown.bs.modal', function () { $(this).find('#Title').focus(); })

        //job status - create - get
        modal_job.on('click', '#box_jstatus .btn-add', function (e) {
            e.preventDefault();

            modal_jstatus.find('.modal-title').html('Add Job Status');
            modal_jstatus.data('mode', 'create');

            showModal({
                url: '/jobstatus/create',
                vm: modal_jstatus
            });
        });

        //job status - save
        modal_jstatus.on('click', '.btn-save', function (e) {
            if ($('#frm_jstatus').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/jobstatus/' + modal_jstatus.data('mode'),
                    data: new FormData($('#frm_jstatus')[0]),
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result.success) {
                            modal_jstatus.modal('hide');
                            toastr.success(result.message);
                            fillDropdownList({
                                target: $('#frm_job').find('#StatusId'),
                                url: '/jobstatus/listfordropdown',
                                callback: function () { $('#frm_job').find('#StatusId').val(result.id) }
                            });
                        } else {
                            modal_jstatus.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

    }

    return {

        init: function () {

            handleJobs();

            handleSchedulers();

            handleJobTypes();

            handleJobStatuses();
        }

    };

}();

jQuery(document).ready(function () {
    Scheduler.init();
});