var Settings = function () {

    var handleCustomerTypes = function () {

        var box_ctype = $('#box_ctype');
        var modal_ctype = $('#modal_ctype');
        modal_ctype.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //customer type - create - get
        box_ctype.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_ctype.find('.modal-title').html('Add Customer Type');
            modal_ctype.data('mode', 'create');

            showModal({
                url: '/customertype/create',
                vm: modal_ctype
            });
        });

        //customer type - edit - get 
        box_ctype.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_ctype.find('.modal-title').html('Edit Customer Type');
            modal_ctype.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/customertype/edit',
                vm: modal_ctype
            });
        });

        //customer type - save
        modal_ctype.on('click', '.btn-save', function (e) {
            if ($('#frm_ctype').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/customertype/' + modal_ctype.data('mode'),
                    data: $('#frm_ctype').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_ctype.modal('hide');
                            toastr.success(result.message);
                            refreshCustomerTypeList();
                        } else {
                            modal_ctype.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //customer type - delete
        box_ctype.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this customer type?',
                url: '/customertype/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshCustomerTypeList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //customer type - refresh
        function refreshCustomerTypeList() {
            displayHtmlResponse({
                url: '/customertype/list',
                container: box_ctype.find('.portlet-body .scroller')
            });
        }

    }

    var handleCustomerIndustries = function () {

        var box_cindustry = $('#box_cindustry');
        var modal_cindustry = $('#modal_cindustry');
        modal_cindustry.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //customer industry - create - get
        box_cindustry.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_cindustry.find('.modal-title').html('Add Customer Industry');
            modal_cindustry.data('mode', 'create');

            showModal({
                url: '/customerindustry/create',
                vm: modal_cindustry
            });
        });

        //customer industry - edit - get 
        box_cindustry.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_cindustry.find('.modal-title').html('Edit Customer Industry');
            modal_cindustry.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/customerindustry/edit',
                vm: modal_cindustry
            });
        });

        //industry industry - save
        modal_cindustry.on('click', '.btn-save', function (e) {
            if ($('#frm_cindustry').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/customerindustry/' + modal_cindustry.data('mode'),
                    data: $('#frm_cindustry').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_cindustry.modal('hide');
                            toastr.success(result.message);
                            refreshCustomerIndustryList();
                        } else {
                            modal_cindustry.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //customer industry - delete
        box_cindustry.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this customer industry?',
                url: '/customerindustry/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshCustomerIndustryList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //customer industry - refresh
        function refreshCustomerIndustryList() {
            displayHtmlResponse({
                url: '/customerindustry/list',
                container: box_cindustry.find('.portlet-body .scroller')
            });
        }

    }

    var handleAccountTypes = function () {

        var box_atype = $('#box_atype');
        var modal_atype = $('#modal_atype');
        modal_atype.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //account type - create - get
        box_atype.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_atype.find('.modal-title').html('Add Account Type');
            modal_atype.data('mode', 'create');

            showModal({
                url: '/accounttype/create',
                vm: modal_atype
            });
        });

        //account type - edit - get 
        box_atype.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_atype.find('.modal-title').html('Edit Account Type');
            modal_atype.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/accounttype/edit',
                vm: modal_atype
            });
        });

        //account type - save
        modal_atype.on('click', '.btn-save', function (e) {
            if ($('#frm_atype').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/accounttype/' + modal_atype.data('mode'),
                    data: $('#frm_atype').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_atype.modal('hide');
                            toastr.success(result.message);
                            refreshAccountTypeList();
                        } else {
                            modal_atype.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //account type - delete
        box_atype.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this account type?',
                url: '/accounttype/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshAccountTypeList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //account type - refresh
        function refreshAccountTypeList() {
            displayHtmlResponse({
                url: '/accounttype/list',
                container: box_atype.find('.portlet-body .scroller')
            });
        }

    }

    var handleReferralSources = function () {

        var box_rsource = $('#box_rsource');
        var modal_rsource = $('#modal_rsource');
        modal_rsource.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //referral source - create - get
        box_rsource.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_rsource.find('.modal-title').html('Add Referral Source');
            modal_rsource.data('mode', 'create');

            showModal({
                url: '/referralsource/create',
                vm: modal_rsource
            });
        });

        //referral source - edit - get 
        box_rsource.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_rsource.find('.modal-title').html('Edit Referral Source');
            modal_rsource.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/referralsource/edit',
                vm: modal_rsource
            });
        });

        //referral source - save
        modal_rsource.on('click', '.btn-save', function (e) {
            if ($('#frm_rsource').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/referralsource/' + modal_rsource.data('mode'),
                    data: $('#frm_rsource').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_rsource.modal('hide');
                            toastr.success(result.message);
                            refreshReferralSourceList();
                        } else {
                            modal_rsource.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //referral source - delete
        box_rsource.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this referral source?',
                url: '/referralsource/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshReferralSourceList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //referral source - refresh
        function refreshReferralSourceList() {
            displayHtmlResponse({
                url: '/referralsource/list',
                container: box_rsource.find('.portlet-body .scroller')
            });
        }

    }

    var handleEquipmentTypes = function () {

        var box_etype = $('#box_etype');
        var modal_etype = $('#modal_etype');
        modal_etype.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //equipment type - create - get
        box_etype.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_etype.find('.modal-title').html('Add Equipment Type');
            modal_etype.data('mode', 'create');

            showModal({
                url: '/equipmenttype/create',
                vm: modal_etype
            });
        });

        //equipment type - edit - get 
        box_etype.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_etype.find('.modal-title').html('Edit Equipment Type');
            modal_etype.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/equipmenttype/edit',
                vm: modal_etype
            });
        });

        //equipment type - save
        modal_etype.on('click', '.btn-save', function (e) {
            if ($('#frm_etype').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/equipmenttype/' + modal_etype.data('mode'),
                    data: $('#frm_etype').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_etype.modal('hide');
                            toastr.success(result.message);
                            refreshEquipmentTypeList();
                        } else {
                            modal_etype.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //equipment type - delete
        box_etype.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this equipment type?',
                url: '/equipmenttype/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshEquipmentTypeList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //equipment type - refresh
        function refreshEquipmentTypeList() {
            displayHtmlResponse({
                url: '/equipmenttype/list',
                container: box_etype.find('.portlet-body .scroller')
            });
        }

    }

    var handleEquipmentStatuses = function () {

        var box_estatus = $('#box_estatus');
        var modal_estatus = $('#modal_estatus');
        modal_estatus.on('shown.bs.modal', function () { $(this).find('#Title').focus(); });

        //equipment status - create - get
        box_estatus.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_estatus.find('.modal-title').html('Add Equipment Status');
            modal_estatus.data('mode', 'create');

            showModal({
                url: '/equipmentstatus/create',
                vm: modal_estatus
            });
        });

        //equipment status - edit - get 
        box_estatus.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_estatus.find('.modal-title').html('Edit Equipment Status');
            modal_estatus.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/equipmentstatus/edit',
                vm: modal_estatus
            });
        });

        //equipment status - save
        modal_estatus.on('click', '.btn-save', function (e) {
            if ($('#frm_estatus').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/equipmentstatus/' + modal_estatus.data('mode'),
                    data: $('#frm_estatus').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_estatus.modal('hide');
                            toastr.success(result.message);
                            refreshEquipmentStatusList();
                        } else {
                            modal_estatus.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //equipment status - delete
        box_estatus.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this equipment status?',
                url: '/equipmentstatus/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshEquipmentStatusList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //equipment status - refresh
        function refreshEquipmentStatusList() {
            displayHtmlResponse({
                url: '/equipmentstatus/list',
                container: box_estatus.find('.portlet-body .scroller')
            });
        }

    }

    return {

        init: function () {

            handleCustomerTypes();

            handleCustomerIndustries();

            handleAccountTypes();

            handleReferralSources();

            handleEquipmentTypes();

            handleEquipmentStatuses();

        }
    };
}();

jQuery(document).ready(function () {
    Settings.init();
});