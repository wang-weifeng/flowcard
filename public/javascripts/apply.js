var apply = {};

apply.init = function () {
    apply.bindEvent();
};

apply.bindEvent = function () {
    $('#applyOrder').on('click', function () {
        var apply_name = $("#accountName").val();
        var apply_idcard = $("#idCard").val();
        var apply_phone = $("#phone").val();
        var address1 = expressArea;
        var apply_address1 = $("#address").val();
        apply_address = address1 + apply_address1;
        if (!address1 || !apply_name || !apply_idcard || !apply_phone || !apply_address1) {
            //alert("信息填写完整哦-<>-");
            // layer.open({
            //     content: '信息填写完整哦-<>-'
            //     , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
            //     , time: 6
            // });
            layer.open({
                content: '信息填写完整哦-<>-',
                btn: '我知道了',
                shadeClose: false,
                time: 6,
                style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                // yes: function () {
                //     //window.location.href = '/?spinfocode=' + spinfocode;
                // }
            });
            return;
        }
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(apply_idcard) === false) {
            //alert("身份证输入不合法");
            // layer.open({
            //     content: '身份证输入不合法-<>-'
            //     , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
            //     , time: 6
            // });
            layer.open({
                content: '身份证输入不合法-<>-',
                btn: '我知道了',
                shadeClose: false,
                time: 6,
                style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                // yes: function () {
                //     //window.location.href = '/?spinfocode=' + spinfocode;
                // }
            });
            return;
        }
        if (!(/^1[34578]\d{9}$/.test(apply_phone))) {
            //alert("手机号码有误，请重填");
            // layer.open({
            //     content: '手机号码有误，请重填-<>-'
            //     , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
            //     , time: 6
            // });
            layer.open({
                content: '手机号码有误，请重填-<>-',
                btn: '我知道了',
                shadeClose: false,
                time: 6,
                style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                // yes: function () {
                //     //window.location.href = '/?spinfocode=' + spinfocode;
                // }
            });
            return;
        }
        var param = {
            apply_name: apply_name
            , apply_idcard: apply_idcard
            , apply_phone: apply_phone
            , apply_address: apply_address
            , spinfocode: spinfocode
        }
        $.post('/v1/apply-submit', param, function (result) {
            if (result.status == true) {
                var orderid = result.data.orderid;
                if (result.data.apply_money == 0) {
                    $.get('/pay/v1/feesuccess?orderid=' + orderid + '&spinfocode=' + spinfocode + '&moneyje=' + result.data.apply_money+"&apply_idcard="+apply_idcard, function (result) {
                        if (result.status == true) {
                            //alert("请耐心等待审核");
                            layer.open({
                                content: '恭喜你，提交成功！手机卡将在2-5个工作日内寄出，请注意查收。如有疑问，请咨询客服电话：4001009440',
                                btn: '我知道了',
                                shadeClose: false,
                                yes: function () {
                                    window.location.href = '/?spinfocode=' + spinfocode;
                                }
                            });
                        }
                    });
                } else {
                    window.location.href = '/pay?orderid=' + orderid + '&spinfocode=' + spinfocode;
                }
            } else if (result.status == false && result.message == "已申请此卡") {
                //alert("已申请此卡");
                // layer.open({
                //     content: '你好，已申请此卡，如信息需要更改，请咨询客服电话：<a href="tel:4001009440">4001009440</a>'
                //     , style: 'background-color:#fb6d68; color:#fff; border:none;' //自定风格
                //     , time: 6
                // });
                layer.open({
                    content: '你好，已申请此卡，如信息需要更改，请咨询客服电话：<a href="tel:4001009440">4001009440</a>',
                    btn: '我知道了',
                    shadeClose: false,
                    time: 6,
                    style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                    // yes: function () {
                    //     //window.location.href = '/?spinfocode=' + spinfocode;
                    // }
                });
            } else {
                // layer.open({
                //     content: '服务器异常，请稍后重试-<>-'
                //     , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                //     , time: 6
                // });
                layer.open({
                    content: '你服务器异常，请稍后重试-<>-',
                    btn: '我知道了',
                    shadeClose: false,
                    time: 6,
                    style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                    // yes: function () {
                    //     //window.location.href = '/?spinfocode=' + spinfocode;
                    // }
                });
            }

        })
    });
    $('#applyOrde').on('click', function () {
        var apply_name = $("#accountName").val();
        var apply_idcard = $("#idCard").val();
        var apply_phone = $("#phone").val();
        var address1 = expressArea;
        var apply_address1 = $("#address").val();
        apply_address = address1 + apply_address1;
        if (!address1 || !apply_name || !apply_idcard || !apply_phone || !apply_address1) {
            //alert("信息填写完整哦-<>-");
            layer.open({
                content: '信息填写完整哦-<>-'
                , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                , time: 6
            });
            return;
        }
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(apply_idcard) === false) {
            //alert("身份证输入不合法");
            layer.open({
                content: '身份证输入不合法-<>-'
                , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                , time: 6
            });
            return;
        }
        if (!(/^1[34578]\d{9}$/.test(apply_phone))) {
            //alert("手机号码有误，请重填");
            layer.open({
                content: '手机号码有误，请重填-<>-'
                , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                , time: 6
            });
            return;
        }
        var param = {
            apply_name: apply_name
            , apply_idcard: apply_idcard
            , apply_phone: apply_phone
            , apply_address: apply_address
            , spinfocode: spinfocode
        }
        $.post('/v3/apply-submit', param, function (result) {
            if (result.status == true) {
                var orderid = result.data.orderid;
                if (result.data.apply_money == 0) {
                    $.get('/pay/v1/feesuccess?orderid=' + orderid + '&spinfocode=' + spinfocode + '&moneyje=' + result.data.apply_money+"&apply_idcard="+apply_idcard, function (result) {
                        if (result.status == true) {
                            //alert("请耐心等待审核");
                            layer.open({
                                content: '恭喜你，提交成功！手机卡将在2-5个工作日内寄出，请注意查收。如有疑问，请咨询客服电话：4001009440',
                                btn: '我知道了',
                                shadeClose: false,
                                yes: function () {
                                    window.location.href = '/applyCard?spinfocode=' + spinfocode;
                                }
                            });
                        }
                    });
                } else {
                    window.location.href = '/pay?orderid=' + orderid + '&spinfocode=' + spinfocode;
                }
            } else if (result.status == false && result.message == "已申请此卡") {
                //alert("已申请此卡");
                layer.open({
                    content: '你好，已申请此卡，如信息需要更改，请咨询客服电话：<a href="tel:4001009440">4001009440</a>'
                    , style: 'background-color:#fb6d68; color:#fff; border:none;' //自定风格
                    , time: 6
                });
            } else {
                layer.open({
                    content: '服务器异常，请稍后重试-<>-'
                    , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                    , time: 6
                });
            }

        })
    });
    $('#searchOrder').on('click', function () {
        window.location.href = '/apply-search';
    });
    $('#typeSubmit').on('click', function () {
        var apply_phone = $("#typephone").val();
        if (!apply_phone) {
            //alert("信息填写完整哦-<>-");
            layer.open({
                content: '信息填写完整哦-<>-'
                , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                , time: 6
            });
            return;
        }
        if (!(/^1[34578]\d{9}$/.test(apply_phone))) {
            //alert("手机号码有误，请重填");
            layer.open({
                content: '手机号码有误，请重填-<>-'
                , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                , time: 6
            });
            return;
        }
        var param = {
            apply_phone: apply_phone,
            spinfocode:spinfocode
        }
        $.post('/v2/apply-submit', param, function (result) {
            if (result.status == true) {
                var orderid = result.data.orderid;
                if (result.data.apply_money == 0) {
                    $.get('/pay/v1/feesuccess?orderid=' + orderid + '&spinfocode=' + spinfocode + '&moneyje=' + result.data.apply_money + "&apply_phone=" + apply_phone, function (result) {
                        if (result.status == true) {
                            //alert("请耐心等待审核");
                            layer.open({
                                content: '恭喜你，提交成功！我们的客服人员将在1-2个工作日内与您联系，为您免费办理沃派畅爽卡，请您保持手机畅通。如有疑问，请咨询客服电话：4001009440',
                                btn: '我知道了',
                                shadeClose: false,
                                yes: function () {
                                    window.location.href = '/?spinfocode=' + spinfocode;
                                }
                            });
                        }
                    });
                } else {
                    window.location.href = '/pay?orderid=' + orderid + '&spinfocode=' + spinfocode;
                }
            } else if (result.status == false && result.message == "已申请此卡") {
                //alert("已申请此卡");
                layer.open({
                    content: '你好，已申请此卡，如信息需要更改，请咨询客服电话：<a href="tel:4001009440">4001009440</a>'
                    , style: 'background-color:#fb6d68; color:#fff; border:none;' //自定风格
                    , time: 6
                });
            } else {
                layer.open({
                    content: '服务器异常，请稍后重试-<>-'
                    , style: 'background-color:#f86261; color:#fff; border:none;' //自定风格
                    , time: 6
                });
            }

        })
    });

};

$(function () {
    apply.init();
});