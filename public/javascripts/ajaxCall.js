var socket = io();
function ajaxCall(type, url, timeout, data, successo) {
    $('#overlay').fadeIn();
    //AJAX CALL to say data to you
    $.ajax({
        type: type,
        url: url,
        timeout: 50000,//timeout,
        data: data,
        success: function (data) {
            successo(data);
        },
        error: function (jqXHR, textStatus, err) {
            console.log(jqXHR);
        }
    });
}