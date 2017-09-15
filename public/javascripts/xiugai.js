var xiugai = {};

xiugai.init = function () {
    xiugai.bindEvent();
};

xiugai.bindEvent = function () {
    $("#xtijiao").on('click', function () { 
        var token = sessionStorage.getItem("token");
        if (!token) {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        }
        var xname = $("#xname").val();
        var xidcard = $("#xidcard").val();
        var xaddress = $("#xaddress").val();
        var xphone = $("#xphone").val();
        var xbeizhu = $("#xbeizhu").val();
        var params = {
            token: token,
            xname: xname,
            xidcard: xidcard,
            xaddress: xaddress,
            xphone: xphone,
            xbeizhu: xbeizhu,
            xid:xid
        }
        $.post('/backstage/v1/xiugai', params, function (result) { 
            if (result.status == true) {
                window.location.href = "/backstage";
            } else if (!result.status && result.message == "token过期，重新登录!") {
                clearSession();
                window.location.href = "/backstage/login";
                return;
            } else {
                alert("网络暂时异常￣へ￣!");
                return;
            }
        })
    })
};

$(function () {
    xiugai.init();
});