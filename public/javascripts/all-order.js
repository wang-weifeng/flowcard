var allOrder = {};

allOrder.init = function () {
    allOrder.bindEvent();
    allOrder.rederOrder(-1, 1, "00000201708");
    allOrder.code();
};

allOrder.bindEvent = function () {
    $('#choosePage').on('click', function () {
        var token = sessionStorage.getItem("token");
        if (!token) {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        }
        var orderChoose = $("#orderChoose").val();
        var choosePropage = $("#choosePropage").val();
        var exampleInputEmail3 = $("#exampleInputEmail3").val();
        if (!orderChoose || !choosePropage || !exampleInputEmail3) {
            alert("信息填写完整哦-<>-");
            return;
        }
        allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
    });
    $("#sypage").on('click', function () {
        var token = sessionStorage.getItem("token");
        if (!token) {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        }
        var orderChoose = $("#orderChoose").val();
        var choosePropage = $("#choosePropage").val();
        var exampleInputEmail3 = $("#exampleInputEmail3").val();
        if (choosePropage > 1) {
            choosePropage--;
            $("#choosePropage").val(choosePropage);
        }
        if (!orderChoose || !choosePropage || !exampleInputEmail3) {
            alert("信息填写完整哦-<>-");
            return;
        }
        allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
    });
    $("#xypage").on('click', function () {
        var token = sessionStorage.getItem("token");
        if (!token) {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        }
        var orderChoose = $("#orderChoose").val();
        var choosePropage = $("#choosePropage").val();
        var exampleInputEmail3 = $("#exampleInputEmail3").val();
        choosePropage++;
        $("#choosePropage").val(choosePropage);
        if (!orderChoose || !choosePropage || !exampleInputEmail3) {
            alert("信息填写完整哦-<>-");
            return;
        }
        allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
    });
    $("#qdhao").on('click', function () {
        var token = sessionStorage.getItem("token");
        if (!token) {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        }
        var orderChoose = $("#orderChoose").val();
        var choosePropage = $("#choosePropage").val();
        var exampleInputEmail3 = $("#exampleInputEmail3").val();
        if (!orderChoose || !choosePropage || !exampleInputEmail3) {
            alert("信息填写完整哦-<>-");
            return;
        }
        allOrder.rederOrder(orderChoose, choosePropage, exampleInputEmail3);
    })
};

allOrder.rederOrder = function (chooseorderType, page, qudao) {
    var CONST = {
        PHONE_REGEX: new RegExp('^1\\d{10}$'),
        UNICOM_PHONE_REGEX: new RegExp('^((13[0-2])|145|(15[5|6])|176|(18[5|6]))\\d{8}$'),
        TELCOM_PHONE_REGEX: new RegExp('^(133|153|177|173|(18[0|1|9]))\\d{8}$'),
        MOBILE_PHONE_REGEX: new RegExp('^((13[4-9])|147|(15[0|1|2|7|8|9])|178|(18[2|3|4|7|8]))\\d{8}$'),
        _MOBILE_PHONE_REGEX: new RegExp('^((13[4-9])|147|(15[0|1|2|7|8|9])|178|(18[2|3|4|7|8]))')
    };
    var token = sessionStorage.getItem("token");
    if (!token) {
        clearSession();
        window.location.href = "/backstage/login";
        return;
    }
    $("#choosePropage").val(page);
    $("#exampleInputEmail3").val(qudao);
    var orderListHtml = '';
    $("#renderOrderList").html(orderListHtml);
    $.get('/backstage/v1/order-search?chooseorderType=' + chooseorderType + "&page=" + page + "&token=" + token + "&qudao=" + qudao, function (result) {
        if (result.status == true) {
            if (result.data.length > 0) {
                $.each(result.data, function (key, val) {
                    if (CONST.TELCOM_PHONE_REGEX.test(result.data[key].apply_phone)) {
                        var yy_phone = "--电信";
                    } else if (CONST.UNICOM_PHONE_REGEX.test(result.data[key].apply_phone)) {
                        var yy_phone = "--联通";
                    } else if (CONST.MOBILE_PHONE_REGEX.test(result.data[key].apply_phone)) {
                        var yy_phone = "--移动";
                    } else {
                        var yy_phone = "--未知";
                    }
                    var time = Date.parse(new Date(result.data[key].apply_time));
                    var send_time = result.data[key].apply_send_time;
                    if (!send_time) {
                        send_time = 0;
                    } else {
                        send_time = util.formateDate(send_time)
                    }
                    orderListHtml = "<tr><td>" + result.data[key].apply_name + "</td><td>" + result.data[key].apply_idcard + "</td><td>" + result.data[key].apply_phone + "</td>"
                        + "<td>" + result.data[key].apply_address + "</td><td>" + result.data[key].paysta + "</td>"
                        + "<td>" + result.data[key].sta + "</td><td>" + util.formateDate(time) + "</td>"
                        + "<td><a onClick=allOrder.effectOrder(" + result.data[key].apply_id + ")><span >有效</span></a><a onClick=allOrder.invalidOrder(" + result.data[key].apply_id + ")><span >无效</span></a></td>"
                        + "<td><a onClick=allOrder.sendOrder(" + result.data[key].apply_id + "," + result.data[key].apply_phone + ")>发送</a><span>" + yy_phone + "</span></td>"
                        + "<td>" + send_time + "</td></tr>";
                    $("#renderOrderList").append(orderListHtml);
                })
            } else {
                alert('暂无数据');
            }

        } else if (!result.status && result.message == "token过期，重新登录!") {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        } else {
            alert("网络暂时异常￣へ￣!");
            return;
        }
    })
}

allOrder.effectOrder = function (applyid) {
    var token = sessionStorage.getItem("token");
    if (!token) {
        clearSession();
        window.location.href = "/backstage/login";
        return;
    }
    $.get('/backstage/v1/effect-order?apply_id=' + applyid + '&token=' + token, function (result) {
        if (result.status == true) {
            alert("有效的订单被处理完成");
            var orderChoose = $("#orderChoose").val();
            var choosePropage = $("#choosePropage").val();
            var exampleInputEmail3 = $("#exampleInputEmail3").val();
            allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
        } else if (!result.status && result.message == "token过期，重新登录!") {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        } else {
            alert("网络暂时异常￣へ￣!");
            return;
        }
    })
}

allOrder.invalidOrder = function (applyid) {
    var token = sessionStorage.getItem("token");
    if (!token) {
        clearSession();
        window.location.href = "/backstage/login";
        return;
    }
    $.get('/backstage/v1/invalid-order?apply_id=' + applyid + '&token=' + token, function (result) {
        if (result.status == true) {
            alert("无效的订单被处理成功");
            var orderChoose = $("#orderChoose").val();
            var choosePropage = $("#choosePropage").val();
            var exampleInputEmail3 = $("#exampleInputEmail3").val();
            allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
        } else if (!result.status && result.message == "token过期，重新登录!") {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        } else {
            alert("网络暂时异常￣へ￣!");
            return;
        }
    })
}

allOrder.sendOrder = function (applyid, phone) {
    var token = sessionStorage.getItem("token");
    if (!token) {
        clearSession();
        window.location.href = "/backstage/login";
        return;
    }
    var param = {
        apply_id: applyid,
        token: token,
        apply_phone: phone
    }
    $.post('/backstage/v1/send-order', param, function (result) {
        if (result.code == 1) {
            alert("发送成功");
            $.get('/backstage/v1/send-success?apply_id=' + applyid, function (result) {
                if (result.status == true) {
                    var orderChoose = $("#orderChoose").val();
                    var choosePropage = $("#choosePropage").val();
                    var exampleInputEmail3 = $("#exampleInputEmail3").val();
                    allOrder.rederOrder(orderChoose, choosePropage,exampleInputEmail3);
                }
            })
        } else if (!result.status && result.message == "token过期，重新登录!") {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        } else {
            alert("网络暂时异常￣へ￣!");
            return;
        }
    })
}

allOrder.hqVal = function (val) {
    var choosePropage = $("#choosePropage").val();
    var exampleInputEmail3 = $("#exampleInputEmail3").val();
    allOrder.rederOrder(val, choosePropage,exampleInputEmail3);
}

allOrder.hqV = function(val){
    var choosePropage = $("#choosePropage").val();
    var orderChoose = $("#orderChoose").val();
    allOrder.rederOrder(orderChoose, choosePropage,val);
}

allOrder.code = function () { 
    var token = sessionStorage.getItem("token");
    if (!token) {
        clearSession();
        window.location.href = "/backstage/login";
        return;
    }
    var codeListHtml = '';
    $("#exampleInputEmail3").html(codeListHtml);
    $.get('/backstage/v1/code?token=' + token, function (result) {
        if (result.status == true) {
            if (result.data.length > 0) {
                $.each(result.data, function (key, val) {
                    codeListHtml = "<option value="+result.data[key].spinfocode+">"+result.data[key].title+"</option>";
                    $("#exampleInputEmail3").append(codeListHtml);
                })
            } else {
                alert('暂无数据');
            }

        } else if (!result.status && result.message == "token过期，重新登录!") {
            clearSession();
            window.location.href = "/backstage/login";
            return;
        } else {
            alert("网络暂时异常￣へ￣!");
            return;
        }
    })
} 

var util = {};

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

util.formateDate = function (timestamp) {
    var newDate = new Date();
    newDate.setTime(timestamp);

    return newDate.format('yyyy.MM.dd hh:mm:ss');
};

$(function () {
    allOrder.init();
});