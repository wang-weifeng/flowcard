var express = require('express');
var router = express.Router();
var restport = 3000;
var redishost = "127.0.0.1";
var redisport = 6379;
var pool = require('../util/db');
var md5 = require('md5');
var request = require('request');

// Redis
var redis = require("redis");
var redisClient = redis.createClient({ host: redishost, port: redisport });
redisClient.on("error", function (err) {
    console.log("Redis connect with error " + err);
});
var logger = require('../util/log4js');

/**
 * 后台登录
 * @param req
 * @param res
 */
router.get('/login', function (req, res, next) {
    res.render('login', { title: 'Express' });
});

/**
 * 后台展示订单情况的渲染页面
 * @param req
 * @param res
 */
router.get('/', function (req, res, next) {
    res.render('all-order', { title: 'Express' });
});

/**
 * 后台新号码发送腾讯会员渲染页面
 * @param req
 * @param res
 */
router.get('/new-tv', function (req, res, next) {
    res.render('newtv', { title: 'Express' });
});

/**
 * 流量卡后台登陆
 * @param req
 * @param res
 */
router.post('/v1/login', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: {}
    };
    var user_name = req.body.user_name;
    var user_password = req.body.user_password;
    var createIdSql = "select * from user where user_name='" + user_name + "' and user_password='" + user_password + "'";
    console.log(createIdSql);
    pool.query(createIdSql, function (error, results, fields) {
        if (error) {
            console.log("Database access error while retrieve operator!");
            retrieve_resp.result = false;
            retrieve_resp.message = "Internal Error!";
            res.send(retrieve_resp);
        } else {
            console.log(results.length);
            if (results.length == 0) {
                retrieve_resp.result = false;
                retrieve_resp.message = "用户名或密码错误!";
                res.send(retrieve_resp);
            } else {
                var session_expiraton = 1800;
                var token = require('crypto').randomBytes(16).toString('hex');
                var sessionContent = {
                    user_name: results[0].user_name,
                    user_id: results[0].user_id
                };
                redisClient.set(token, JSON.stringify(sessionContent));
                redisClient.expire(token, session_expiraton);
                retrieve_resp.data.user_id = results[0].user_id;
                retrieve_resp.data.user_name = results[0].user_name;
                retrieve_resp.data.token = token;
                console.log("登陆成功!");
                res.send(retrieve_resp);
            }
        }
    });
});

/**
 * 后台查询订单
 * @param req
 * @param res
 */
router.get('/v1/order-search', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var page = req.query.page;
    var apply_status = req.query.chooseorderType;
    var spinfocode = req.query.qudao;
    page = page - 1;
    var token = req.query.token;
    tokenValidation(token, function (result) {
        if (result != null) {
            var createSql = "select * from apply where apply_status=" + apply_status + " and spinfocode='"+spinfocode + "' order by apply_time desc limit " + page * 30 + ",30";
            if (apply_status == -1) {
                createSql = "select * from apply where spinfocode='"+spinfocode + "' order by apply_time desc limit " + page * 30 + ",30";
            }
            console.log(createSql);
            pool.query(createSql, function (error, results, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    res.send(retrieve_resp);
                } else {
                    console.log("订单查询成功");
                    results.forEach(function (item, index) {
                        var dataItem = {};
                        dataItem.apply_id = item.apply_id;
                        dataItem.apply_name = item.apply_name;
                        dataItem.apply_phone = item.apply_phone;
                        dataItem.apply_address = item.apply_address;
                        dataItem.apply_idcard = item.apply_idcard;
                        dataItem.apply_time = item.apply_time;
                        dataItem.apply_send = item.apply_send;
                        dataItem.apply_send_time = item.apply_send_time;
                        if (item.apply_send == 0) {
                            dataItem.send = '未发送';
                        } else if (item.apply_send == 1) {
                            dataItem.send = '已发送';
                        }
                        if (item.apply_status == 0) {
                            dataItem.sta = '未处理';
                        } else if (item.apply_status == 1) {
                            dataItem.sta = '已处理(有效)';
                        } else if (item.apply_status == 2) {
                            dataItem.sta = '已处理(无效)';
                        }
                        if (item.apply_paystatus == 0) {
                            dataItem.paysta = '否';
                        } else if (item.apply_paystatus == 1) {
                            dataItem.paysta = '是';
                        }
                        retrieve_resp.data.push(dataItem);
                    })
                    res.send(retrieve_resp);
                }
            });
        } else {
            retrieve_resp.status = false;
            retrieve_resp.message = "token过期，重新登录!";
            console.log("token过期!");
            res.send(retrieve_resp);
        }
    })
});

/**
 * 后台查询code
 * @param req
 * @param res
 */
router.get('/v1/code', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var token = req.query.token;
    tokenValidation(token, function (result) {
        if (result != null) {
            var createSql = "select * from code ";
            console.log(createSql);
            pool.query(createSql, function (error, results, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    res.send(retrieve_resp);
                } else {
                    console.log("code查询成功");
                    results.forEach(function (item, index) {
                        var dataItem = {};
                        dataItem.title = item.title;
                        dataItem.spinfocode = item.spinfocode;
                        retrieve_resp.data.push(dataItem);
                    })
                    res.send(retrieve_resp);
                }
            });
        } else {
            retrieve_resp.status = false;
            retrieve_resp.message = "token过期，重新登录!";
            console.log("token过期!");
            res.send(retrieve_resp);
        }
    })
});


/**
 * 有效订单被处理
 * @param req
 * @param res
 */
router.get('/v1/effect-order', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var apply_id = req.query.apply_id;
    var token = req.query.token;
    tokenValidation(token, function (result) {
        if (result != null) {
            var updateSql = "update apply set apply_status=1 where apply_id=" + apply_id;
            pool.query(updateSql, function (error, results, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    res.send(retrieve_resp);
                } else {
                    console.log("有效订单处理成功");
                    res.send(retrieve_resp);
                }
            });
        } else {
            retrieve_resp.status = false;
            retrieve_resp.message = "token过期，重新登录!";
            console.log("token过期!");
            res.send(retrieve_resp);
        }
    })
});

/**
 * 无效订单被处理
 * @param req
 * @param res
 */
router.get('/v1/invalid-order', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var apply_id = req.query.apply_id;
    var token = req.query.token;
    tokenValidation(token, function (result) {
        if (result != null) {
            var updateSql = "update apply set apply_status=2 where apply_id=" + apply_id;
            pool.query(updateSql, function (error, results, fields) {
                if (error) {
                    console.log("Database access error while retrieve operator!");
                    retrieve_resp.status = false;
                    retrieve_resp.message = "Internal Error!";
                    res.send(retrieve_resp);
                } else {
                    console.log("无效订单处理成功");
                    res.send(retrieve_resp);
                }
            });
        } else {
            retrieve_resp.status = false;
            retrieve_resp.message = "token过期，重新登录!";
            console.log("token过期!");
            res.send(retrieve_resp);
        }
    })
});

/**
 * 发送短信
 * @param req
 * @param res
 */
router.post('/v1/send-order', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var apply_id = req.body.apply_id;
    var token = req.body.token;
    var appid = "1";
    var phone = req.body.apply_phone;
    var content = "沃派畅爽卡腾讯视频免费领取地址：http://wo.zj186.com/tencent/index.do【校园卡】";
    var time = new Date().getTime();

    var type = "99";
    var service = "send_msg";
    var hash = md5(appid + content + phone + service + time + type + "sky");
    content = encodeURIComponent(content);
    var url = "http://api.ringbox.com.cn/ringsetclientv3/phone.htm?type=" + type + "&service=" + service + "&phone=" + phone + "&content=" + content + "&appid=" + appid + "&hash=" + hash + "&timespan=" + time;
    console.log(url);
    tokenValidation(token, function (result) {
        if (result != null) {
            var options = {
                url: url,
                method: 'GET',
                json: true,
                headers: {
                    "content-type": "application/json",
                },
            };
            request(options, function (error, response, content) {
                if (!error && response.statusCode == 200) {
                    res.send(content);
                } else {
                    retrieve_resp.status = false;
                    retrieve_resp.message = "error";
                    res.send(retrieve_resp);
                }
            });
        } else {
            retrieve_resp.status = false;
            retrieve_resp.message = "token过期，重新登录!";
            console.log("token过期!");
            res.send(retrieve_resp);
        }
    })
});

/**
 * 短信成功后更新状态
 * @param req
 * @param res
 */
router.get('/v1/send-success', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var apply_id = req.query.apply_id;
    var nowtime = new Date().getTime();
    console.log(nowtime);
    var updateSql = "update apply set apply_send=1,apply_send_time='" + nowtime + "' where apply_id=" + apply_id;
    console.log(updateSql);
    pool.query(updateSql, function (error, results, fields) {
        if (error) {
            console.log("Database access error while retrieve operator!");
            retrieve_resp.status = false;
            retrieve_resp.message = "Internal Error!";
            res.send(retrieve_resp);
        } else {
            console.log("短信发送后状态更新");
            res.send(retrieve_resp);
        }
    });
});

/**
 * 发送短信
 * @param req
 * @param res
 */
router.get('/v1/newtv', function (req, res, next) {
    var retrieve_resp = {
        status: true,
        message: "ok",
        data: []
    }
    var phone = req.query.morephone;
    var appid = "1";
    var content = "您有一次免费领取畅爽卡腾讯视频会员的机会，请在48小时后及时领取：http://wo.zj186.com/tencent/index.do【校园卡】";
    var type = "99";
    var service = "send_msg";
    function hello(file) {
        return new Promise((resolve, reject) => {
            var options = {
                url: file,
                method: 'GET',
                json: true,
                headers: {
                    "content-type": "application/json",
                },
            };
            request(options, function (error, response, content) {
                if (!error && response.statusCode == 200) {
                    resolve(content);
                } else {
                    retrieve_resp.status = false;
                    retrieve_resp.message = "error";
                    reject(retrieve_resp);
                }
            });
        });
    }
    let start = async () => {
        try {
            var everphone = phone.split(",");
            for (let i = 0; i < everphone.length; i++) {
                var time = new Date().getTime();
                phone = everphone[i];
                var hash = md5(appid + content + phone + service + time + type + "sky");
                content = encodeURIComponent(content);
                var url = "http://api.ringbox.com.cn/ringsetclientv3/phone.htm?type=" + type + "&service=" + service + "&phone=" + phone + "&content=" + content + "&appid=" + appid + "&hash=" + hash + "&timespan=" + time;
                console.log(url);
                let helloVal = await hello(url);
                console.log(helloVal);
            }
            console.log(retrieve_resp);
            res.send(retrieve_resp);
        }
        catch (err) {
            console.log(err);
            res.send(err);
        }
    };
    start(); 
});


//校验token
function tokenValidation(token, cb) {
    redisClient.get(token, function (err, reply) {
        if (err || reply === null) {
            cb(null);
        } else {
            redisClient.expire(token, 1800);
            cb(reply);
        }
    });
}

module.exports = router;
