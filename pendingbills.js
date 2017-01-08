var PendingBills = function () {

    var handlePendingBills = function () {

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
                ajax: { "url": "/pendingbill/list" }, // ajax source
                columns: [
                     {
                         data: "AccountNumber",
                         orderable: true,

                     },
                     {
                         data: "FirstName",
                         orderable: false,
                     },
                    {
                        data: "LastName",
                        orderable: false,
                    },
                    {
                        data: "Date",
                        orderable: false,
                    },
                    {
                        data: "Crew",
                        orderable: false,
                    }
                    ,
                    {
                        data: "Balance",
                        orderable: false,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                return '$' + data;
                            }
                            return data
                        }
                    }
                ],
                "footerCallback": function (row, data) {
                    var api = this.api(), data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                            i : 0;
                    };

                    // Total over all pages
                    total = api
                        .column(5)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total over this page
                    pageTotal = api
                        .column(5, { page: 'current' })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(5).footer()).html(
                        '$' + pageTotal + ' ( $' + total + ' total)'
                    );
                },
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

        $('#frm_pendingbill').find('.date').datepicker({ autoclose: true });

        // handle datatable custom tools
        $('#tools > li > a.tool-action').on('click', function () {
            var action = $(this).attr('data-action');
            grid.getDataTable().button(action).trigger();
        });

        //search
        $('#btn_search').on('click', function (event) {
            event.preventDefault();
            var frm_array = $('#frm_pendingbill').serializeArray();
            $.each(frm_array, function (i, fd) { grid.setAjaxParam(fd.name, fd.value); });
            grid.getDataTable().ajax.reload();
        });

        //reset
        $('#btn_reset').on('click', function (event) {
            grid.clearAjaxParams(); grid.getDataTable().ajax.reload();
        });
    }

    return {

        init: function () {

            handlePendingBills();

        }
    };
}();
jQuery(document).ready(function () {
    PendingBills.init();
});