function openLeftMenu(codiceMenu) {
    prepareLeftMenu(codiceMenu);
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
}

function prepareLeftMenu(codiceMenu) {
    $('#mySidebar').html('');
    for (var i = 0; i < categorie.length; i++) {
        if (categorie[i].codice_menu == codiceMenu) {
            $('#mySidebar').append('<a href="/categoria?cat=' + categorie[i].codice + '" onclick="$(\'#overlay\').fadeIn();" class="inner-bar-item large all-width text-left"><span class="sub-left-menu-name">' + categorie[i].nome + '</span></a>');
        }
    }
}

function closeLeftMenu() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
}

function openRightMenu() {
    document.getElementById("rightMenu").style.display = "block";
}

function closeRightMenu() {
    document.getElementById("rightMenu").style.display = "none";
}

function closeAllMenu() {
    closeRightMenu();
    closeLeftMenu();
}

function menuScrollCheck() {
    $(window).scroll(function() {
        var scroll = $('#barMenu').outerHeight(true) - $(this).scrollTop();
        if (scroll < 1) {
            $('#mySidebar').css({ 'top': '0' });
        } else {
            $('#mySidebar').css({ 'top': scroll });
        }
    });
}

function clickMenu(sender) {
    $(sender).closest('div').find('button').each(function() {
        if (!$(this).hasClass('button-active'))
            $(this).removeClass('button-clicked');
    });
    var codice = $(sender).attr('data-codicemenu');
    if ($('#mySidebar').hasClass('menu_' + codice)) {
        $('#mySidebar').removeClass('menu_' + codice);
        if (!$(this).hasClass('button-active'))
            $(sender).removeClass('button-clicked');
        closeLeftMenu();
    } else {
        $('#menu_principale').find('button').each(function() {
            $('#mySidebar').removeClass('menu_' + $(this).attr('data-codicemenu'));
        });
        $('#mySidebar').addClass('menu_' + codice);
        if (!$(this).hasClass('button-active'))
            $(sender).addClass('button-clicked');
        openLeftMenu(codice);
    }
}

$(document).ready(function() {
    menuScrollCheck();
    $('button').click(function() {
        $('#overlay').fadeIn();
    });
    $('#menu_principale').find('button').off();
    $('#template_accedi').off();
});

function avvisaUser(codice) {
    ajaxCall('POST', window.location.origin + '/avvertimi', 5000, { codice: codice }, function() {
        alert('Grazie!\n sarai avvisato tramite mail non appena il prodotto tornerà disponibile');
        $('#overlay').fadeOut();
    });
}
