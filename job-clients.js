var ClientJobs = function () {

    var handleClientJobs = function () {

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
                ajax: { "url": "/report/jobsperclient" }, // ajax source
                columns: [
                    {
                        data: "Code",
                        orderable: true,
                    },
                    {
                        data: "Client",
                        orderable: true
                    },
                    {
                         data: "PhoneNumber",
                         orderable: true
                    },
                    {
                        data: "Location",
                        orderable: true
                    },
                    {
                        data: "Type",
                        orderable: true
                    },
                    {
                        data: "AssignedTo",
                        orderable: true,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                if (row.IsAssignedToTeam)
                                    return '<a href="javascript:;" class=" btn-team-view" data-id="' + row.AssignedId + '">' + row.AssignedTo + '</a>';
                                else
                                    return row.AssignedTo;
                            }
                            return data;
                        }
                    },
                    {
                        data: "Start",
                        orderable: true
                    },
                    {
                        data: "End",
                        orderable: true
                    },
                    {
                        data: "Status",
                        orderable: true,
                        render: function (data, type, row) {
                            if (type === 'display' && row.StatusImageUrl != '') {
                                return '<img height="20px" src="' + row.StatusImageUrl + '" title="' + row.Status + '" />';
                            }
                            else
                                return row.Status
                            return '';
                        }
                    },
                ],
                buttons: [
                   {
                       extend: 'print', className: 'btn dark btn-outline', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'copy', className: 'btn red btn-outline', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'pdf', className: 'btn green btn-outline', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'excel', className: 'btn yellow btn-outline ', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'csv', className: 'btn purple btn-outline ', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns', exportOptions: {
                           stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   data = data.replace(/<.*?>/g, "");
                                   return data;
                               }
                           }
                       }
                   }
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
            var frm_array = $('#frm_client_jobs').serializeArray();
            $.each(frm_array, function (i, fd) { grid.setAjaxParam(fd.name, fd.value); });
            grid.getDataTable().ajax.reload();
        });

        //reset
        $('#btn_reset').on('click', function (event) {
            grid.clearAjaxParams(); grid.getDataTable().ajax.reload();
        });

        //crew members
        $('#datatable_ajax tbody').on('click', '.btn-team-view', function (e) {
            e.preventDefault();
            showModal({
                url: '/crew/members/' + $(this).data('id'),
                vm: $('#modal_members')
            });
        });
    }
    return {

        init: function () {

            handleClientJobs();

        }
    };

}();
jQuery(document).ready(function () {
    ClientJobs.init();
});