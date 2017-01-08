var ClientEdit_02 = function () {

    var handleLocations = function () {

        var tab_locations = $('#tab_locations');
        var modal_location = $('#modal_location');
        modal_location.on('shown.bs.modal', function () { $(this).find('#Name').focus(); });

        //location - create - get
        tab_locations.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_location.find('.modal-title').html('Add Location');
            modal_location.data('mode', 'create');

            showModal({
                url: '/location/create',
                data: { clientId: tab_locations.data('clientid') },
                vm: modal_location
            });
        });

        //location - edit - get 
        tab_locations.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_location.find('.modal-title').html('Edit Location');
            modal_location.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/location/edit',
                vm: modal_location
            });
        });

        //location - save
        modal_location.on('click', '.btn-save', function (e) {
            if ($('#frm_location').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/location/' + modal_location.data('mode'),
                    data: $('#frm_location').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_location.modal('hide');
                            toastr.success(result.message);
                            refreshLocationList();
                        } else {
                            modal_location.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //location - delete
        tab_locations.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this location?',
                url: '/location/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshLocationList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //location - refresh
        function refreshLocationList() {
            displayHtmlResponse({
                url: '/location/list',
                data: { clientId: tab_locations.data('clientid') },
                container: tab_locations.find('.portlet-body')
            });
        }

    }

    var handleContacts = function () {

        var tab_contacts = $('#tab_contacts');
        var modal_contact = $('#modal_contact');
        modal_contact.on('shown.bs.modal', function () { $(this).find('#Address_FirstName').focus(); });

        //contact - create - get
        tab_contacts.on('click', '.btn-add', function (e) {
            e.preventDefault();

            modal_contact.find('.modal-title').html('Add Contact');
            modal_contact.data('mode', 'create');

            showModal({
                url: '/contact/create',
                data: { clientId: tab_contacts.data('clientid') },
                vm: modal_contact
            });
        });

        //contact - edit - get 
        tab_contacts.on('click', '.btn-edit', function (e) {
            e.preventDefault();

            modal_contact.find('.modal-title').html('Edit Contact');
            modal_contact.data('mode', 'edit');

            showModal({
                data: { id: $(this).data('id') },
                url: '/contact/edit',
                vm: modal_contact
            });
        });

        //contact - save
        modal_contact.on('click', '.btn-save', function (e) {
            if ($('#frm_contact').valid()) {
                $.ajax({
                    cache: false,
                    type: 'POST',
                    url: '/contact/' + modal_contact.data('mode'),
                    data: $('#frm_contact').serialize(),
                    success: function (result) {
                        if (result.success) {
                            modal_contact.modal('hide');
                            toastr.success(result.message);
                            refreshContactList();
                        } else {
                            modal_contact.find('.modal-body').html(result);
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        toastr.error(thrownError);
                    }
                });
            }
        });

        //contact - delete
        tab_contacts.on('click', '.btn-delete', function (e) {
            e.preventDefault();

            deleteEntity({
                data: { id: $(this).data('id') },
                message: 'Are you sure you want to delete this contact?',
                url: '/contact/delete',
                callback: function (result) {
                    if (result.success) {
                        toastr.success(result.message);
                        refreshContactList();
                    } else {
                        toastr.error(result.message);
                    }
                }
            });
        });

        //contact - refresh
        function refreshContactList() {
            displayHtmlResponse({
                url: '/contact/list',
                data: { clientId: tab_contacts.data('clientid') },
                container: tab_contacts.find('.portlet-body')
            });
        }

    }

    return {

        init: function () {

            handleLocations();

            handleContacts();

        }
    };
}();
jQuery(document).ready(function () {
    ClientEdit_02.init();
});