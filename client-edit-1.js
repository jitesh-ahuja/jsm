var ClientEdit_01 = function () {

    var handleClients = function () {

        //back button
        $('#btn_back').on('click', function (e) {
            window.location.href = '/clients';
        });

        //client default country to USA and florida - user story 37
        $('#Address_CountryId option[value="1"]').attr("selected", true);
        fillDropdownList({
            target: $('#frm_client').find('#Address_StateProvinceId'),
            url: '/country/states',
            data: { id: 1 },
            callback: function () { $('#Address_StateProvinceId option[value="15"]').attr("selected", true) }
        });

        //client country change
        $('#frm_client').find('#Address_CountryId').change(function () {

            var countryId = $(this).val();
            if (!countryId) { countryId = -1; }

            fillDropdownList({
                target: $('#frm_client').find('#Address_StateProvinceId'),
                url: '/country/states',
                data: { id: countryId }
            });

        });

        //referral source change
        $('#ReferralSourceId').change(function () {

            if ($(this).val() == -1) {
                $('#OtherReferralSource').removeAttr('disabled');
            } else {
                $('#OtherReferralSource').attr('disabled', 'disabled').val('');
            }

        })

    }

    function handleCustomerTypes() {

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
                            fillDropdownList({
                                target: $('#frm_client').find('#CustomerTypeId'),
                                url: '/customertype/listfordropdown',
                                callback: function () { $('#frm_client').find('#CustomerTypeId').val(result.id) }
                            });
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

    }

    function handleCustomerIndustries() {

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
                            fillDropdownList({
                                target: $('#frm_client').find('#CustomerIndustryId'),
                                url: '/customerindustry/listfordropdown',
                                callback: function () { $('#frm_client').find('#CustomerIndustryId').val(result.id) }
                            });
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

    }

    function handleAccountTypes() {

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
                            fillDropdownList({
                                target: $('#frm_client').find('#AccountTypeId'),
                                url: '/accounttype/listfordropdown',
                                callback: function () { $('#frm_client').find('#AccountTypeId').val(result.id) }
                            });
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

    }

    function handleReferralSources() {

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
                            fillDropdownList({
                                target: $('#frm_client').find('#ReferralSourceId'),
                                url: '/referralsource/listfordropdown',
                                callback: function () { $('#frm_client').find('#ReferralSourceId').val(result.id) }
                            });
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

    }

    return {

        init: function () {

            handleClients();

            handleCustomerTypes();

            handleCustomerIndustries();

            handleAccountTypes();

            handleReferralSources();
        }
    };
}();

jQuery(document).ready(function () {
    ClientEdit_01.init();
});