$(document).ready(function() {
    socket.off('backend_categorie');
    socket.on('backend_categorie', function(data) {
        if (data.message == 'refresh') {
            location.reload();
        }
    });
    socket.off('backend_menu');
    socket.on('backend_menu', function(data) {
        if (data.message == 'refresh') {
            alert('attenzione!!\nc\'è stata una modifica nel menu, controllare prima di salvare eventuali modifiche alle categorie.');
        }
    });

    $('.cat_menu').on('change', function() {
        checkMod();
    });
    $('.categoriaName').on('keyup change', function() {
        checkMod();
    });

    $('#newCategoria').on('keyup change', function() {
        var preventEdit = false;
        var currVal = $(this).val();
        $('#elenco_categorie').find('.categoriaName').each(function() {
            if (currVal == $(this).attr('data-orgvalue'))
                preventEdit = true;
        });
        if (preventEdit == false) {
            if ($(this).val() != '')
                $('#add').removeAttr('disabled');
            else
                $('#add').attr({
                    'disabled': 'disabled'
                });
        } else
            $('#add').attr({
                'disabled': 'disabled'
            });
    });

    $('#elenco_categorie').find('.deleteCategoria').on('click', function() {
        ajaxCall("POST", window.location.origin + '/amministrazione/categorie/delete', 5000, {
            codice: $(this).closest('li').find('.categoriaName').attr('data-catcod')
        }, function(data) {
            console.log('fatto');
        });
    });

    $('#save').on('click', function() {
        var multipleUpdate = [];
        var iterator = 0;
        $('#elenco_categorie').find('.categoriaName').each(function() {
            if ($(this).val() != $(this).attr('data-orgvalue') || $(this).closest('li').find('.cat_menu').val() != $(this).attr('data-mencod')) {
                multipleUpdate[iterator] = {
                    codice: $(this).attr('data-catcod'),
                    nome: $(this).val(),
                    codice_menu: $(this).closest('li').find('.cat_menu').val()
                };
                iterator++;
            }
        });
        ajaxCall("POST", window.location.origin + '/amministrazione/categorie/update', 5000, {
            data: JSON.stringify(multipleUpdate)
        }, function(data) {
            console.log('fatto');
        });
    });

    $('#add').on('click', function() {
        var data = {
            categoriaName: $('#newCategoria').val(),
            codiceMenu: $('#newMenuCode').val()
        }
        $('#add').attr({
            'disabled': 'disabled'
        });
        $('#newCategoria').val('');
        ajaxCall("POST", window.location.origin + '/amministrazione/categorie/add', 5000, data, function(data) {
            console.log('fatto');
        });
    });
});

function checkMod() {
    var edited = false;
    $('#elenco_categorie').find('.categoriaName').each(function() {
        if ($(this).val() != $(this).attr('data-orgvalue'))
            edited = true;
    });

    $('#elenco_categorie').find('.cat_menu').each(function() {
        if ($(this).val() != $(this).closest('li').find('.categoriaName').attr('data-mencod'))
            edited = true;
    });
    if (edited == true)
        $('#save').removeAttr('disabled');
    else
        $('#save').attr({
            'disabled': 'disabled'
        });
}