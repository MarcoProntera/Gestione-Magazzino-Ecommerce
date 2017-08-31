function ajaxCall(type, url, timeout, data, success) {
    $('#overlay').fadeIn();
    //AJAX CALL to say data to you
    $.ajax({
        type: type,
        url: url,
        timeout: 20000,//timeout,
        data: data,
        success: function (data) {
            success(data);
            $('#overlay').fadeOut(500);
        },
        error: function (jqXHR, textStatus, err) {
            alert('text status ' + textStatus + ', err ' + err);
        }
    });
}
var socket;
$(document).ready(function () {
    socket = io.connect(window.location.origin.split(':')[0] + ':' + window.location.origin.split(':')[1] + ':3001');
});