var Settings = function () {

    var handleCompanies = function () {

        //company country change
        $('#frm_company').find('#Address_CountryId').change(function () {

            var countryId = $(this).val();
            if (!countryId) { countryId = -1; }

            fillDropdownList({
                target: $('#frm_company').find('#Address_StateProvinceId'),
                url: '/country/states',
                data: { id: countryId }
            });

        });

        $('#frm_company').on('click', '.btn-save', function (e) {
            e.preventDefault();
            if ($('#frm_company').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/company/update',
                    data: new FormData($('#frm_company')[0]),
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result.success) {
                            toastr.success(result.message);
                            $('.validation-summary-errors').hide();
                        } else {
                            $('#frm_company').html(result);
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

            handleCompanies();

        }
    };
}();

jQuery(document).ready(function () {
    Settings.init();
});