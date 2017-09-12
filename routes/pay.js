var express = require('express');
var router = express.Router();
var restport = 3000;
var redishost = "127.0.0.1";
var redisport = 6379;
var pool = require('../util/db');
var alipay = require('../payment-modules/alipay_config').alipay;
var wxpay = require('../payment-modules/wxpay_config').wxpay;

// Redis
var redis = require("redis");

var logger = require('../util/log4js');

/**
 * 支付界面
 * @param req
 * @param res
 */
router.get('/', function (req, res, next) {
    var orderid = req.query.orderid;
    res.render('pay', { orderid: orderid });
});

/**
 * 根据订单号查询订单信息
 * @param req
 * @param res
 */
router.get('/v1/alipay-order', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var orderid = req.query.orderid;
    var createSql = "select * from apply where orderid='" + orderid + "'";
    pool.query(createSql, function (error, results, fields) {
        if (error) {
            console.log("Database access error while retrieve operator!");
            retrieve_resp.status = false;
            retrieve_resp.message = "Internal Error!";
            res.send(retrieve_resp);
        } else {
            var ret = {
                out_trade_no: 1,
                subject: results[0].apply_name,
                body: "http://138.128.221.78/submit-success",
                total_fee: 0.01
                //total_fee: results[0].apply_money;
            };
            alipay.create_direct_pay_by_user(ret, res);
        }
    });
});

/**
 * 免费时状态 
 * @param req
 * @param res
 */
router.get('/v1/feesuccess', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    } else {
        var token_val = req.session.token_val;
    }
    var moneyje = req.query.moneyje+"-"+req.query.apply_idcard;
    res.trace.interface({
        name: 'dopay',
        spinfocode: req.query.spinfocode,
        moneyje: moneyje,
        params: req.query,
        token_val:token_val
    });
    var orderid = req.query.orderid;
    var updateSql = "update apply set apply_paystatus=1 where orderid='" + orderid + "'";
    pool.query(updateSql, function (error, results, fields) {
        if (error) {
            console.log("Database access error while retrieve operator!");
            retrieve_resp.status = false;
            retrieve_resp.message = "Internal Error!";
            res.send(retrieve_resp);
        } else {
            res.send(retrieve_resp);
        }
    });
});



function getNowFormatDate() {
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var hour = 0;
    var minute = 0;
    var second = 0;
    var CurrentDate = "";
    //初始化时间
    Year = day.getFullYear();//ie火狐下都可以
    Month = day.getMonth() + 1;
    Day = day.getDate();
    hour = day.getHours();
    minute = day.getMinutes();
    second = day.getSeconds();
    CurrentDate += Year;
    if (Month >= 10) {
        CurrentDate += '-' + Month;
    } else {
        CurrentDate += "-0" + Month;
    }

    if (Day >= 10) {
        CurrentDate += '-' + Day;
    } else {
        CurrentDate += "-0" + Day;
    }
    if (hour >= 10) {
        CurrentDate += ' ' + hour;
    } else {
        CurrentDate += ' 0' + hour;
    }
    if (minute >= 10) {
        CurrentDate += ':' + minute;
    } else {
        CurrentDate += ':0' + minute;
    }
    if (second >= 10) {
        CurrentDate += ':' + second;
    } else {
        CurrentDate += ':0' + second;
    }
    return CurrentDate;
}

function getNewBatchNo() {
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var hour = 0;
    var minute = 0;
    var second = 0;
    var CurrentDate = "";
    //初始化时间
    Year = day.getFullYear();//ie火狐下都可以
    Month = day.getMonth() + 1;
    Day = day.getDate();
    hour = day.getHours();
    minute = day.getMinutes();
    second = day.getSeconds();
    CurrentDate += Year;
    if (Month >= 10) {
        CurrentDate += Month;
    } else {
        CurrentDate += "0" + Month;
    }

    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    CurrentDate += hour;
    CurrentDate += minute;
    CurrentDate += second;
    return CurrentDate;
}


module.exports = router;