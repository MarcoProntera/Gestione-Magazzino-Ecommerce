function ajaxCall(type, url, timeout, data, success) {
    $('#overlay').fadeIn();
    $.ajax({
        type: type,
        url: url,
        timeout: 10000,//timeout,
        data: data,
        success: function (data) {
            success(data);
            $('#overlay').fadeOut();
        },
        error: function(jqXHR, textStatus, err){
            alert('text status ' + textStatus + ', err ' + err);
        }
    });
}