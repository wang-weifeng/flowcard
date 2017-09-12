var newtv = {};

newtv.init = function () {
    newtv.bindEvent();
};

newtv.bindEvent = function () {
    $("#qd").on('click', function () {
        var morephone = $("#morephone").val();
        if (!morephone){ 
            alert("填写号码");
            return;
        }
        $.get("/backstage/v1/newtv?morephone=" + morephone, function (result) {
            if (result.status == true) {
                alert("发送成功");
            } else { 
                alert("格式有误");
            }
        })
    });
};

$(function () {
    newtv.init();
});