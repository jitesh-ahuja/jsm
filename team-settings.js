var Settings = function () {

    var handleCrews = function () {

        var box_crew = $('#box_crew');
        var modal_crew = $('#modal_crew');
        modal_crew.on('shown.bs.modal', function () { $(this).find('#Name').focus(); });

        //crew - create - get
        box_crew.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_crew.find('.modal-title').html('Add Team');
            modal_crew.data('mode', 'create');

            showModal({
                url: '/crew/create',
                vm: modal_crew
            });
        });

        //crew - edit - get 
        box_crew.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_crew.find('.modal-title').html('Edit Team');
            modal_crew.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/crew/edit',
                vm: modal_crew
            });
        });

        //crew - save
        modal_crew.on('click', '.btn-save', function (e) {
            if ($('#frm_crew').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/crew/' + modal_crew.data('mode'),
                    data: $('#frm_crew').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_crew.modal('hide');
                            toastr.success(result.message);
                            refreshCrewList();
                        } else {
                            modal_crew.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //crew - delete
        box_crew.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this team?',
                url: '/crew/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshCrewList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //crew - refresh
        function refreshCrewList() {
            displayHtmlResponse({
                url: '/crew/list',
                container: box_crew.find('.portlet-body .scroller')
            });
        }

        //crew members
        box_crew.on('click', '.lnk-members', function (e) {
            e.preventDefault();
            showModal({
                url: '/crew/members/' + $(this).data('id'),
                vm: $('#modal_members')
            });
        });

    }

    var handleUsers = function () {

        var box_user = $('#box_user');
        var modal_user = $('#modal_user');
        modal_user.on('shown.bs.modal', function () { $(this).find('#Address_FirstName').focus(); });

        //user - create - get
        box_user.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_user.find('.modal-title').html('Add User');
            modal_user.data('mode', 'create');

            showModal({
                url: '/user/create',
                vm: modal_user
            });
        });

        //user - edit - get 
        box_user.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_user.find('.modal-title').html('Edit User');
            modal_user.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/user/edit',
                vm: modal_user
            });
        });

        //user - save
        modal_user.on('click', '.btn-save', function (e) {
            if ($('#frm_user').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/user/' + modal_user.data('mode'),
                    data: new FormData($('#frm_user')[0]),
                    contentType: false,
                    processData: false,
                    success: function (result) {
                        if (result.success) {
                            modal_user.modal('hide');
                            toastr.success(result.message);
                            refreshUserList();
                        } else {
                            modal_user.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //user - delete
        box_user.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this user?',
                url: '/user/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshUserList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //user - refresh
        function refreshUserList() {
            displayHtmlResponse({
                url: '/user/list',
                container: box_user.find('.portlet-body .scroller')
            });
        }

    }

    return {

        init: function () {

            handleCrews();

            handleUsers();

        }
    };
}();

jQuery(document).ready(function () {
    Settings.init();
});