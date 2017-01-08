var Clients = function () {

    var modal_job = $('#modal_job');

    var modal_viewclient = $('#modal_viewclient');

    var handleClients = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) { },// execute some code after table records loaded
            onError: function (grid) { },// execute some code on network or other general error
            loadingMessage: 'Loading...',
            dataTable: {
                bStateSave: true, // save datatable state(pagination, sort, etc) in cookie. 
                lengthMenu: [[10, 20, 50, 100, 150], [10, 20, 50, 100, 150]],// change per page values here 
                pageLength: 10, // default record count per page
                ajax: { "url": "/client/list" }, // ajax source
                columns: [
                    {
                        data: "AccountNumber",
                        orderable: true
                    },
                    {
                        data: "Name",
                        orderable: true,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                return '<a href="/client/edit/' + row.Id + '">' + data + '</a>';
                            }
                            return data;
                        }
                    },
                    {
                        data: "Location",
                        orderable: true
                    },
                    {
                        data: "Phone",
                        orderable: true
                    },
                    {
                        data: "Email",
                        orderable: true
                    },
                    {
                        data: "Id",
                        orderable: false,
                        render: function (data, type, row) {
                            if (type === 'display') {
                                return '<a class="btn btn-xs default green-haze-stripe btn-view-client" href="javascript:;" data-id="' + row.Id + '"> View</a> \
                                          <a class="btn btn-xs default btn-edit" href="/client/edit/' + row.Id + '"><i class="fa fa-pencil"></i> Edit</a> \
                                        <a class="btn btn-xs red-haze btn-delete" href="javascript:;" data-id="' + row.Id + '"><i class="fa fa-trash-o"></i> Delete</a> \
                                        <a class="btn btn-xs default btn-new-job" href="javascript:;" data-id="' + row.Id + '"><i class="fa fa-plus"></i> New Job</a>';
                            }
                            return data;
                        }
                    }
                ],
                buttons: [
                    { extend: 'print', className: 'btn dark btn-outline', exportOptions: { columns: [0, 1, 2, 3] } },
                    { extend: 'copy', className: 'btn red btn-outline', exportOptions: { columns: [0, 1, 2, 3] } },
                    { extend: 'pdf', className: 'btn green btn-outline', exportOptions: { columns: [0, 1, 2, 3] } },
                    { extend: 'excel', className: 'btn yellow btn-outline ', exportOptions: { columns: [0, 1, 2, 3] } },
                    { extend: 'csv', className: 'btn purple btn-outline ', exportOptions: { columns: [0, 1, 2, 3] } },
                    { extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns', exportOptions: { columns: [0, 1, 2, 3] } }
                ],
                order: [[0, "asc"]] // set first column as a default sort by asc
            }
        });

        // handle datatable custom tools
        $('#tools > li > a.tool-action').on('click', function () {
            var action = $(this).attr('data-action');
            grid.getDataTable().button(action).trigger();
        });

        //search
        $('#btn_search').on('click', function (event) {
            event.preventDefault();
            var frm_array = $('#frm_client').serializeArray();
            $.each(frm_array, function (i, fd) { grid.setAjaxParam(fd.name, fd.value); });
            grid.getDataTable().ajax.reload();
        });

        //reset
        $('#btn_reset').on('click', function (event) {
            grid.clearAjaxParams(); grid.getDataTable().ajax.reload();
        });

        //delete
        $('#datatable_ajax tbody').on('click', '.btn-delete', function (event) {
            event.preventDefault();
            deleteEntity({
                data: { id: $(this).data('id') },
                confirm: true,
                message: 'Are you sure you want to delete this client?',
                url: '/client/delete',
                grid: grid
            });
        });

    }



    viewClients = function () {



        //view - client        
        $('#datatable_ajax tbody').on('click', '.btn-view-client', function (e) {
            e.preventDefault();

            modal_viewclient.find('.modal-title').html('View Client');
            modal_viewclient.data('mode', 'create');

            var clientId = $(this).data('id');

            showModal({
                url: '/client/viewclient',
                data: { id: $(this).data('id') },
                vm: modal_viewclient,

            });
        });
    }





    handleJobs = function () {

        modal_job.on('shown.bs.modal', function () { $(this).find('#ClientId').focus(); });

        //job - create - get        
        $('#datatable_ajax tbody').on('click', '.btn-new-job', function (e) {
            e.preventDefault();

            modal_job.find('.modal-title').html('Add Job');
            modal_job.data('mode', 'create');

            var clientId = $(this).data('id');

            showModal({
                url: '/job/create',
                vm: modal_job,
                callback: function () {
                    $('#frm_job').find('#ClientId').val(clientId).change();
                }
            });
        });


        //job - edit- view after save from client
        function editJob(id) {
            modal_job.find('.modal-title').html('Edit Job');
            modal_job.data('mode', 'edit');

            showModal({
                data: { id: id },
                url: '/job/edit',
                vm: modal_job
            });
        }

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

            handleClients();

            handleJobs();

            handleJobTypes();

            handleJobStatuses();

            viewClients();
        }
    };
}();

jQuery(document).ready(function () {
    Clients.init();
});