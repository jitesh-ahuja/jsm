var Countries = function () {

    var handleCountries = function () {

        var grid = new Datatable();

        //init grid
        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) { },// execute some code after table records loaded
            onError: function (grid) { },// execute some code on network or other general error
            loadingMessage: 'Loading...',
            dataTable: {
                bStateSave: true, // save datatable state(pagination, sort, etc) in cookie. 
                lengthMenu: [[10, 20, 50, 100, 150], [10, 20, 50, 100, 150]],// change per page values here 
                pageLength: 10, // default record count per page
                ajax: { "url": "/country/list", },// ajax source
                columns: [
                    {
                        data: "Name",
                        orderable: true
                    },
                    {
                        data: "TwoLetterIsoCode",
                        orderable: true
                    },
                    {
                        data: "ThreeLetterIsoCode",
                        orderable: true
                    },
                    {
                        data: "NumericIsoCode",
                        orderable: true
                    },
                    {
                        data: "DisplayOrder",
                        orderable: true
                    },
                    {
                        data: "Published",
                        orderable: true
                    },
                    {
                        data: "NumberOfStates",
                        orderable: false
                    }
                ],
                order: [[0, "asc"]] // set first column as a default sort by asc
            }
        });

        //search
        $('#btn_search').on('click', function (event) {
            event.preventDefault();
            var frm_array = $('#frm_country').serializeArray();
            $.each(frm_array, function (i, fd) { grid.setAjaxParam(fd.name, fd.value); });
            grid.getDataTable().ajax.reload();
        });

        //delete
        $('#datatable_ajax tbody').on('click', '.btn-delete', function (event) {
            event.preventDefault();
            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this country?',
                url: '/country/delete',
                grid: grid
            });
        });
    }

    return {

        init: function () {

            handleCountries();

        }
    };
}();

jQuery(document).ready(function () {
    Countries.init();
});