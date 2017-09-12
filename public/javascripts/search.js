var search = {};

search.init = function () {
    search.bindEvent();
};

search.bindEvent = function () {
    $('#searchStart').on('click', function () {
        var apply_phone = $("#phoneSearch").val();
        var apply_idcard = $("#idCardSearch").val();
        if (!apply_idcard || !apply_phone) {
            alert("信息填写完整哦-<>-");
            return;
        }
        var param = {
            apply_idcard: apply_idcard
            , apply_phone: apply_phone
        }
        $("#searchInfo").hide()
        $.post('/v1/apply-speed', param, function (result) {
            if (result.status == true) {
                if (result.data.length > 0) {
                    $("#phoneSearch").val('');
                    $("#idCardSearch").val('');
                    $("#searchInfo").show();
                    $("#searchName").text(result.data[0].apply_name);
                    $("#searchPhone").text(result.data[0].apply_phone);
                    $("#searchAddress").text(result.data[0].apply_address);
                } else {
                    alert(result.message);
                }
            }
        })
    });
};

$(function () {
    search.init();
});