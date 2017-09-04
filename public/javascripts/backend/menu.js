    $(document).ready(function() {
        updateElencoMenu();
        socket.off('backend_menu');
        socket.on('backend_menu', function(data) {
            if (data.message == 'refresh') {
                $('#newMenu').val('');
                $('#overlay').fadeIn();
                location.reload();
            }
        });
        $('#add').on('click', function() {
            var data = {
                menuName: $('#newMenu').val()
            }
            ajaxCall("POST", window.location.origin + '/amministrazione/menu/add', 5000, data, function(data) { console.log('fatto'); });
        });
    });

    function updateElencoMenu() {
        $('#elenco_menu').find('input').off();
        $('#elenco_menu').find('.menuName').on('keyup change', function() {
            checkMod();
        });
        $('#newMenu').on('keyup change', function() {
            var preventEdit = false;
            var currVal = $(this).val();
            $('#elenco_menu').find('.menuName').each(function() {
                if (currVal == $(this).attr('data-orgvalue'))
                    preventEdit = true;
            });
            if (preventEdit == false) {
                if ($(this).val() != '')
                    $('#add').removeAttr('disabled');
                else
                    $('#add').attr({ 'disabled': 'disabled' });
            } else
                $('#add').attr({ 'disabled': 'disabled' });
        });
        $('#elenco_menu').find('.deleteMenu').on('click', function() {
            ajaxCall("POST", window.location.origin + '/amministrazione/menu/delete', 5000, { codice: $(this).closest('li').attr('data-id') }, function(data) { console.log('fatto'); });
        });
        $('#save').on('click', function() {
            var multipleUpdate = [];
            var iterator = 0;
            $('#elenco_menu').find('.menuName').each(function() {
                if ($(this).val() != $(this).attr('data-orgvalue')) {
                    multipleUpdate[iterator] = { codice: $(this).closest('li').attr('data-id'), nome: $(this).val() };
                    iterator++;
                }
            });
            ajaxCall("POST", window.location.origin + '/amministrazione/menu/update', 5000, { data: JSON.stringify(multipleUpdate) }, function(data) { console.log('fatto'); });
        });
    }

    function checkMod() {
        var edited = false;
        $('#elenco_menu').find('.menuName').each(function() {
            if ($(this).val() != $(this).attr('data-orgvalue'))
                edited = true;
        });
        if (edited == true)
            $('#save').removeAttr('disabled');
        else
            $('#save').attr({ 'disabled': 'disabled' });
    }