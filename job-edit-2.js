var JobEdit_02 = function () {

    var modal_job = $('#modal_job');

    var handleDocuments = function () {

        var modal_document = $('#modal_document');
        modal_document.on('shown.bs.modal', function () { $(this).find('#Title').focus(); })

        //document - create - get
        modal_job.on('click', '#tab_documents .btn-add', function (e) {
            e.preventDefault();

            modal_document.find('.modal-title').html('Add Document');
            modal_document.data('mode', 'create');

            showModal({
                url: '/document/create',
                data: { jobId: modal_job.find('#tab_documents').data('jobid') },
                vm: modal_document
            });
        });

        //document - edit - get 
        modal_job.on('click', '#tab_documents .btn-edit', function (e) {
            e.preventDefault();

            modal_document.find('.modal-title').html('Edit Document');
            modal_document.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/document/edit',
                vm: modal_document
            });
        });

        //document - save
        modal_document.on('click', '.btn-save', function (e) {
            if ($('#frm_document').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/document/' + modal_document.data('mode'),
                    data: new FormData($('#frm_document')[0]),
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result.success) {
                            modal_document.modal('hide');
                            toastr.success(result.message);
                            refreshDocumentList();
                        } else {
                            modal_document.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //document - delete
        modal_job.on('click', '#tab_documents .btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this document?',
                url: '/document/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshDocumentList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //document - refresh
        function refreshDocumentList() {
            displayHtmlResponse({
                url: '/document/list',
                data: { jobId: modal_job.find('#tab_documents').data('jobid') },
                container: modal_job.find('#tab_documents .portlet-body')
            });
        }

    }

    var handleEquipments = function () {

        var modal_equipment = $('#modal_equipment');
        modal_equipment.on('shown.bs.modal', function () { $(this).find('#Name').focus(); })

        //equipment - create - get
        modal_job.on('click', '#tab_equipments .btn-add', function (e) {
            e.preventDefault();

            modal_equipment.find('.modal-title').html('Add Equipment');
            modal_equipment.data('mode', 'create');

            showModal({
                url: '/equipment/create',
                data: { jobId: modal_job.find('#tab_equipments').data('jobid') },
                vm: modal_equipment
            });
        });

        //equipment - edit - get 
        modal_job.on('click', '#tab_equipments .btn-edit', function (e) {
            e.preventDefault();

            modal_equipment.find('.modal-title').html('Edit Equipment');
            modal_equipment.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/equipment/edit',
                vm: modal_equipment
            });
        });

        //equipment - save
        modal_equipment.on('click', '.btn-save', function (e) {
            if ($('#frm_equipment').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/equipment/' + modal_equipment.data('mode'),
                    data: $('#frm_equipment').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_equipment.modal('hide');
                            toastr.success(result.message);
                            refreshEquipmentList();
                        } else {
                            modal_equipment.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //equipment - delete
        modal_job.on('click', '#tab_equipments .btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this equipment?',
                url: '/equipment/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshEquipmentList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //equipment - refresh
        function refreshEquipmentList() {
            displayHtmlResponse({
                url: '/equipment/list',
                data: { jobId: modal_job.find('#tab_equipments').data('jobid') },
                container: modal_job.find('#tab_equipments .portlet-body')
            });
        }

    }

    var handleJobcard = function () {

        var modal_jobcard = $('#modal_jobcard');
        modal_jobcard.on('shown.bs.modal', function () { });

        //jobcard - preview - get
        modal_job.on('click', '#tab_jobcard .btn-preview', function (e) {
            e.preventDefault();

            modal_jobcard.find('.modal-title').html('Job Card Preview');

            showModal({
                url: '/jobcard/jobcardPreview',
                data: { jobId: modal_job.find('#tab_jobcard').data('jobid') },
                vm: modal_jobcard
            });
        });

        //jobcard - email
        modal_job.on('click', '#tab_jobcard .btn-email', function (e) {
            e.preventDefault();

            if ($('#frm_jobcard').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/jobcard/sendemail',
                    data: $('#frm_jobcard').serialize(),
                    success: function (result) {
                        if (result.success) {
                            toastr.success(result.message);
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

            handleDocuments();

            handleEquipments();

            handleJobcard();
        }
    };
}();

jQuery(document).ready(function () {
    JobEdit_02.init();
});