var pay = {};

pay.init = function () {
    pay.bindEvent();
};

pay.bindEvent = function () {
    $("#payImmediately").on('click',function () {
		window.location.href = '/pay/v1/alipay-order?orderid='+orderId;
    });
    $("#payImmediatelywx").on('click',function () {
		window.location.href = '/pay/v1/wxpay-order?orderid='+orderId;
    });
};

$(function () {
    pay.init();
});