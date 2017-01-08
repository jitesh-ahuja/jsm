var JobEdit_01 = function () {

    var modal_job = $('#modal_job');
    //var modal_view_job = $('#modal_view_job');

    var handleJobEdit = function () {

        modal_job.on('shown.bs.modal', function () { $(this).find('#ClientId').focus(); });

        //job - create - get        
        $('#btn_new').on('click', function (e) {
            e.preventDefault();

            modal_job.find('.modal-title').html('Add Job');
            modal_job.data('mode', 'create');

            showModal({
                url: '/job/create',
                vm: modal_job
            });
        });

        //job - edit - get        
        $('#datatable_ajax tbody').on('click', '.btn-edit', function (event) {
            event.preventDefault();

            modal_job.find('.modal-title').html('Edit Job');
            modal_job.data('mode', 'edit');
            //modal_job.find('.btn-primary').css('display', 'block');
            showModal({
                data: { id: $(this).data('id') },
                url: '/job/edit',
                vm: modal_job
            });
        });

        //job - edit - get        
        $('#datatable_ajax tbody').on('click', '.btn-view-job', function (event) {
            event.preventDefault();

            modal_job.find('.modal-title').html('View Job');
            modal_job.data('mode', 'view');
            //modal_job.find('.btn-primary').css('display', 'none');
            showModal({
                data: { id: $(this).data('id') },
                url: '/job/viewjob',
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

        //job - refresh
        function refreshJobList() {
            $('#frm_job_search').find('#btn_search').click();
        }
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

            handleJobEdit();

            handleJobTypes();

            handleJobStatuses();
        }
    };
}();

jQuery(document).ready(function () {
    JobEdit_01.init();
});