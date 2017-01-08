var Settings = function () {

    var handleJobTypes = function () {

        var box_jtype = $('#box_jtype');
        var modal_jtype = $('#modal_jtype');
        modal_jtype.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //job type - create - get
        box_jtype.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_jtype.find('.modal-title').html('Add Job Type');
            modal_jtype.data('mode', 'create');

            showModal({
                data: {},
                url: '/jobtype/create',
                vm: modal_jtype
            });
        });

        //job type - edit - get 
        box_jtype.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_jtype.find('.modal-title').html('Edit Job Type');
            modal_jtype.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/jobtype/edit',
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
                            refreshJobTypeList();
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

        //job type - delete
        box_jtype.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this job type?',
                url: '/jobtype/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshJobTypeList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //job type - refresh
        function refreshJobTypeList() {
            displayHtmlResponse({
                url: '/jobtype/list',
                container: box_jtype.find('.portlet-body .scroller')
            });
        }

    }

    var handleJobStatuses = function () {

        var box_jstatus = $('#box_jstatus');
        var modal_jstatus = $('#modal_jstatus');
        modal_jstatus.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //job status - create - get
        box_jstatus.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_jstatus.find('.modal-title').html('Add Job Status');
            modal_jstatus.data('mode', 'create');

            showModal({
                data: {},
                url: '/jobstatus/create',
                vm: modal_jstatus
            });
        });

        //job status - edit - get 
        box_jstatus.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_jstatus.find('.modal-title').html('Edit Job Status');
            modal_jstatus.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/jobstatus/edit',
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
                            refreshJobStatusList();
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

        //job status - delete
        box_jstatus.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this job status?',
                url: '/jobstatus/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshJobStatusList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //job status - refresh
        function refreshJobStatusList() {
            displayHtmlResponse({
                url: '/jobstatus/list',
                container: box_jstatus.find('.portlet-body .scroller')
            });
        }

    }

    return {

        init: function () {

            handleJobTypes();

            handleJobStatuses();

        }
    };
}();

jQuery(document).ready(function () {
    Settings.init();
});