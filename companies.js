var Companies = function () {

    var handleCompanies = function () {

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
                ajax: { "url": "/company/list" }, // ajax source
                columns: [
                    {
                        data: "Name",
                        orderable: true,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                return '<a href="/company/edit/' + row.Id + '">' + data + '</a>';
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
                                return '<a class="btn btn-xs red-haze btn-delete" href="javascript:;" data-id="' + row.Id + '"><i class="fa fa-trash-o"></i> Delete</a> ';
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
            var frm_array = $('#frm_company').serializeArray();
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
                message: 'Are you sure you want to delete this company?',
                url: '/company/delete',
                grid: grid
            });
        });

    }

    return {

        init: function () {

            handleCompanies();

        }
    };

}();

jQuery(document).ready(function () {
    Companies.init();
});