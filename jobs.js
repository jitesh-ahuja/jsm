var Jobs = function () {

    var handleJobs = function () {

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
                ajax: { "url": "/job/list", }, // ajax source
                columns: [
                    {
                        data: "Code",
                        orderable: true,
                        render: function (data, type, row) {
                            if (type == 'display') {
                                return '<a href="javascript:;" class="btn-edit" data-id="' + row.Id + '">' + data + '</a>';
                            }
                            return data;
                        }
                    },
                    {
                        data: "Client",
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
                    {
                        data: "Id",
                        orderable: false,
                        render: function (data, type, row) {
                            if (type === 'display') {
                                return '<a class="btn btn-xs default green-haze-stripe btn-view-job" href="javascript:;" data-id="' + row.Id + '"> View</a> \
                                    <a class="btn btn-xs default btn-edit" href="javascript:;" data-id="' + row.Id + '"><i class="fa fa-pencil"></i> Edit</a> \
                                    <a class="btn btn-xs red-haze btn-delete" href="#" data-id="' + row.Id + '"><i class="fa fa-trash-o"></i> Del</a>';
                            }
                            return data;
                        }
                    }
                ],
                buttons: [
                   {
                       extend: 'print', className: 'btn dark btn-outline', exportOptions: {
                           columns: [0, 1, 2, 3, 4, 5, 6, 7], stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   return data;
                               }
                           }
                       }
                   },
                   {
                       extend: 'copy', className: 'btn red btn-outline', exportOptions: {
                           columns: [0, 1, 2, 3, 4, 5, 6, 7], stripHtml: true, format: {
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
                           columns: [0, 1, 2, 3, 4, 5, 6, 7], stripHtml: true, format: {
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
                       extend: 'excel', className: 'btn yellow btn-outline ', exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7] }, stripHtml: false, format: {
                           body: function (data, col, row) {
                               var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                               if (isImg) {
                                   return $(data).attr('title');
                               }
                               return data;
                           }
                       }
                   },
                   {
                       extend: 'csv', className: 'btn purple btn-outline ', exportOptions: {
                           columns: [0, 1, 2, 3, 4, 5, 6, 7], stripHtml: false, format: {
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
                           columns: [0, 1, 2, 3, 4, 5, 6, 7], stripHtml: false, format: {
                               body: function (data, col, row) {
                                   var isImg = ~data.toLowerCase().indexOf('img') ? $(data).is('img') : false;
                                   if (isImg) {
                                       return $(data).attr('title');
                                   }
                                   return data;
                               }
                           }
                       }
                   }
                ],
                order: [[0, "asc"]] // set first column as a default sort by asc
            }
        });

        //search
        $('#btn_search').on('click', function (event) {
            event.preventDefault();
            var frm_array = $('#frm_job_search').serializeArray();
            $.each(frm_array, function (i, fd) { grid.setAjaxParam(fd.name, fd.value); });
            grid.getDataTable().ajax.reload();
        });

        // handle datatable custom tools
        $('#tools > li > a.tool-action').on('click', function () {
            var action = $(this).attr('data-action');
            grid.getDataTable().button(action).trigger();
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
                message: 'Are you sure you want to delete this job?',
                url: '/job/delete',
                grid: grid
            });
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

            handleJobs();

        }
    };
}();

jQuery(document).ready(function () {
    Jobs.init();
});