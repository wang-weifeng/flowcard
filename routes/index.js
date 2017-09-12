var express = require('express');
var router = express.Router();
var async = require('async');
var restport = 3000;
var redishost = "127.0.0.1";
var redisport = 6379;
var pool = require('../util/db');

// Redis
var redis = require("redis");
var redisClient = redis.createClient({ host: redishost, port: redisport });
redisClient.on("error", function (err) {
    console.log("Redis connect with error " + err);
});


/**
 * 流量卡申请引导页渲染
 * @param req
 * @param res
 */
router.get('/', function (req, res, next) {
    var spinfocode = '00000201708';
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    } else {
        var token_val = req.session.token_val;
    }
    if(req.query.spinfocode){
        spinfocode = req.query.spinfocode;
    }
    res.render('index', { spinfocode: spinfocode });
});

router.get('/uv/success', function (req, res, next) {
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    } else {
        var token_val = req.session.token_val;
    }
    if(req.query.spinfocode){
        spinfocode = req.query.spinfocode;
    }
    res.trace.uv({
        spinfocode: spinfocode,
        token_val:token_val
    });
});



/**
 * 流量卡申请页渲染
 * @param req
 * @param res
 */
router.get('/apply-card', function (req, res, next) {
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
    res.trace.event({
        name: 'checkStep',
        spinfocode: req.query.spinfocode,
        token_val:token_val
    });
    res.send(retrieve_resp);
    // var spinfocode = req.query.spinfocode
    // res.render('apply', { spinfocode: spinfocode });
});

/**
 * 流量卡申请页渲染
 * @param req
 * @param res
 */
router.get('/applyCard', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var spinfocode = "00000201700";
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    } else {
        var token_val = req.session.token_val;
    }
    res.trace.event({
        name: 'applyCardopend',
        spinfocode: spinfocode,
        token_val:token_val
    });
    res.render('apply', { spinfocode: spinfocode });
});

/**
 * 流量卡申请进度申请页渲染
 * @param req
 * @param res
 */
router.get('/apply-search', function (req, res, next) {
    res.render('search', { title: 'Express' });
});

/**
 * 流量卡申请成功到（支付界面）渲染
 * @param req
 * @param res
 */
router.get('/submit-success', function (req, res, next) {
    res.render('submit-success', { title: 'Express' });
});

/**
 * 流量卡申请提交表单
 * @param req
 * @param res
 */
router.post('/v1/apply-submit', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: {}
    }
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    }  else {
        var token_val = req.session.token_val;
    }
    res.trace.interface({
        name: 'check',
        spinfocode: req.body.spinfocode,
        params: req.body,
        token_val:token_val
    });
    var orderid = getNewBatchNo() + req.body.apply_idcard.slice(14,18);
    var apply_name = req.body.apply_name;
    var apply_idcard = req.body.apply_idcard;
    var apply_phone = req.body.apply_phone;
    var apply_address = req.body.apply_address;
    var spinfocode = req.body.spinfocode;
    var apply_money = 0;
    async.waterfall([
        function (callback) {
            var selectSq = "select apply_idcard from apply where apply_idcard='" + apply_idcard + "'";
            pool.query(selectSq, function (error, result, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    callback(retrieve_resp);
                } else {
                    callback(null, result);
                }
            });
        },
        function (result, callback) {
            if (result.length == 0) {
                var createSql = "insert into apply (apply_name,apply_idcard,apply_phone,apply_address,orderid,spinfocode,apply_money)"
                createSql += "values ('" + apply_name + "','" + apply_idcard + "','" + apply_phone + "','" + apply_address + "','" + orderid + "','" + spinfocode + "','"+apply_money+"')";
                pool.query(createSql, function (error, results, fields) {
                    if (error) {
                        console.log("Database access error while retrieve operator!");
                        retrieve_resp.status = false;
                        retrieve_resp.message = "Internal Error!";
                        callback(retrieve_resp);
                    } else {
                        retrieve_resp.data.orderid = orderid;
                        retrieve_resp.data.apply_money = apply_money;
                        console.log("流量卡申请提交成功");
                        callback(null, retrieve_resp);
                    }
                });
            } else {
                retrieve_resp.status = false;
                retrieve_resp.message = "已申请此卡";
                callback(null, retrieve_resp);
            }
        }
    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });

});

/**
 * 流量卡申请提交表单手机号码
 * @param req
 * @param res
 */
router.post('/v2/apply-submit', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: {}
    }
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    }  else {
        var token_val = req.session.token_val;
    }
    res.trace.interface({
        name: 'check',
        spinfocode: req.body.spinfocode,
        params: req.body,
        token_val:token_val
    });
    var orderid = getNewBatchNo() + req.body.apply_phone.slice(7,11);
    var spinfocode = req.body.spinfocode;
    var apply_phone = req.body.apply_phone;
    var apply_money = 0;
    async.waterfall([
        function (callback) {
            var selectSq = "select apply_phone from apply where apply_phone='" + apply_phone + "'";
            pool.query(selectSq, function (error, result, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    callback(retrieve_resp);
                } else {
                    callback(null, result);
                }
            });
        },
        function (result, callback) {
            if (result.length == 0) {
                var createSql = "insert into apply (apply_phone,orderid,spinfocode,apply_money)"
                createSql += "values ('" + apply_phone + "','" + orderid + "','" + spinfocode + "','"+apply_money+"')";
                pool.query(createSql, function (error, results, fields) {
                    if (error) {
                        console.log("Database access error while retrieve operator!");
                        retrieve_resp.status = false;
                        retrieve_resp.message = "Internal Error!";
                        callback(retrieve_resp);
                    } else {
                        retrieve_resp.data.orderid = orderid;
                        retrieve_resp.data.apply_money = apply_money;
                        console.log("流量卡申请提交成功");
                        callback(null, retrieve_resp);
                    }
                });
            } else {
                retrieve_resp.status = false;
                retrieve_resp.message = "已申请此卡";
                callback(null, retrieve_resp);
            }
        }
    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });

});

/**
 * 流量卡申请信息补全表单
 * @param req
 * @param res
 */
router.post('/v3/apply-submit', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: {}
    }
    if(!req.session.token_val){
        var token_val = require('crypto').randomBytes(16).toString('hex');
        req.session.token_val = token_val;
    }  else {
        var token_val = req.session.token_val;
    }
    res.trace.interface({
        name: 'check1',
        spinfocode: req.body.spinfocode,
        params: req.body,
        token_val:token_val
    });
    var orderid = getNewBatchNo() + req.body.apply_idcard.slice(14,18);
    var apply_name = req.body.apply_name;
    var apply_idcard = req.body.apply_idcard;
    var apply_phone = req.body.apply_phone;
    var apply_address = req.body.apply_address;
    var spinfocode = req.body.spinfocode;
    var apply_money = 0;
    async.waterfall([
        function (callback) {
            var selectSq = "select apply_idcard from apply where apply_idcard='" + apply_idcard + "'";
            pool.query(selectSq, function (error, result, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    callback(retrieve_resp);
                } else {
                    callback(null, result);
                }
            });
        },
        function (result, callback) {
            if (result.length == 0) {
                var createSql = "insert into apply (apply_name,apply_idcard,apply_phone,apply_address,orderid,spinfocode,apply_money)"
                createSql += "values ('" + apply_name + "','" + apply_idcard + "','" + apply_phone + "','" + apply_address + "','" + orderid + "','" + spinfocode + "','"+apply_money+"')";
                pool.query(createSql, function (error, results, fields) {
                    if (error) {
                        console.log("Database access error while retrieve operator!");
                        retrieve_resp.status = false;
                        retrieve_resp.message = "Internal Error!";
                        callback(retrieve_resp);
                    } else {
                        retrieve_resp.data.orderid = orderid;
                        retrieve_resp.data.apply_money = apply_money;
                        console.log("流量卡申请提交成功");
                        callback(null, retrieve_resp);
                    }
                });
            } else {
                retrieve_resp.status = false;
                retrieve_resp.message = "已申请此卡";
                callback(null, retrieve_resp);
            }
        }
    ], function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });

});

/**
 * 流量卡申请进度查询
 * @param req
 * @param res
 */
router.post('/v1/apply-speed', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var apply_phone = req.body.apply_phone;
    var apply_idcard = req.body.apply_idcard;
    var createSql = "select * from apply where apply_phone = '" + apply_phone + "' and apply_idcard = '" + apply_idcard + "'";
    pool.query(createSql, function (error, results, fields) {
        if (error) {
            console.log("Database access error while retrieve operator!");
            retrieve_resp.status = false;
            retrieve_resp.message = "Internal Error!";
            res.send(retrieve_resp);
        } else {
            console.log("流量卡申请进度查询成功");
            if (results.length == 0) {
                retrieve_resp.message = '不好意思，你没有完成的订单';
            } else if (results.length == 1) {
                var dataItem = {};
                dataItem.apply_name = results[0].apply_name;
                dataItem.apply_phone = results[0].apply_phone;
                dataItem.apply_address = results[0].apply_address;
                retrieve_resp.data.push(dataItem);
                retrieve_resp.message = '你好，订单已处理，请耐心等待';
            }
            res.send(retrieve_resp);
        }
    });
});

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
