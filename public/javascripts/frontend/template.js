function openLeftMenu() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";

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
    $(window).scroll(function () {
        var scroll = $('#barMenu').outerHeight(true) - $(this).scrollTop();

        if (scroll < 1) {
            $('#mySidebar').css({
                'top': '0'
            });
        } else {
            $('#mySidebar').css({
                'top': scroll
            });
        }
    });
}
$(document).ready(function () {
    menuScrollCheck();
});

function clickMenu(sender) {
    $(sender).closest('div').find('button').each(function () {
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
        $('#menu_principale').find('button').each(function () {
            $('#mySidebar').removeClass('menu_' + $(this).attr('data-codicemenu'));
        });
        $('#mySidebar').addClass('menu_' + codice);
        if (!$(this).hasClass('button-active'))
            $(sender).addClass('button-clicked');
        openLeftMenu();
    }

}