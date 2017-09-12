/**
 * Created by LXP on 2017/3/23.
 */
"use strict";

var url = require("url");
var querystring = require("querystring");
var logger = require("./log4js")("trace");
var util = require('util');
require('date-utils');
module.exports = function (req, res, next) {
    //   function extend() {
    // 		var _extend,
    // 			_isObject,
    // 			arr = arguments,
    // 			result = {},
    // 			i;

    // 		// _isObject = function (o) {
    // 		// 	return Object.prototype.toString.call(o) === '[object Object]';
    // 		// };

    // 		_extend = function self(destination, source) {
    // 			var property;
    // 			for (property in destination) {
    //         //console.log(destination);
    //         //console.log(property);
    //         var a = {}
    //         a = destination;
    //         var destinatio = {
    //     apply_address:"北京市东城区12",
    //     apply_idcard:"340323199305183734",
    //     apply_name:"王",
    //     apply_phone:"15555373875"
    // };
    //   console.log(destinatio === a);
    //         // if(destination.hasOwnProperty("apply_name")){
    //         //     console.log("1");
    //         // } else {
    //         //   console.log("2");
    //         // }
    // 				if (destination.hasOwnProperty(property)) {

    // 					// 若destination[property]和sourc[property]都是对象，则递归
    // 					if (_isObject(destination[property]) && _isObject(source[property])) {
    // 						self(destination[property], source[property]);
    // 					}
    // 					;

    // 					// 若sourc[property]已存在，则跳过
    // 					if (source.hasOwnProperty(property)) {
    // 						continue;
    // 					} else {
    // 						source[property] = destination[property];
    // 					}
    // 				}
    // 			}
    // 		};

    // 		if (!arr.length) return {};

    // 		for (i = arr.length - 1; i >= 0; i--) {
    // 			//if (_isObject(arr[i])) {
    // 				_extend(arr[i], result);
    // 		//	}
    // 		}

    // 		arr[0] = result;

    // 		return result;
    // 	}
    //日志对象
    function traceData() {
        //var q = extend({}, req.query, req.body);
        this.date = new Date().toFormat('YYYY/MM/DD');
        this.time = new Date().toFormat('HH24:MI:SS');
        this.spinfocode = '';
        this.tracename = '';
        this.user = {};
        this.eventname = '';
        this.eventparams = '';
        this.explain = '';
        this.token_val = '';
        /**
         * 网络类型
         * 返回值 QQ返回值   类型
         * 0    unknown UNKNOW
         * 1    ethernet ETHERNET
         * 2    wifi WIFI
         * 3    2g CELL_2G
         * 4    3g CELL_3G
         * 5    4g CELL_4G（中国现在也会出现这个值，是hspa+）
         * ?    none NONE
         */
        this.networktype = '';
        this.url = url.parse(req.originalUrl).pathname;
        this.referer = req.headers['referer'] || '';
        this.remark = '';
        this.format = function () {
            this.eventparams = this.eventparams.replace(/\r\n/g, ' ');
            this.explain = this.explain.replace(/\r\n/g, ' ');
            if (this.remark)
                this.remark = this.remark.replace(/\r\n/g, ' ');
            return util.format("%s %s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s",
                this.date, this.time, this.spinfocode, this.tracename, this.token_val,
                this.user.id || '', this.user.phone || '', this.user.weixinid || '',
                this.eventname, this.eventparams, this.explain,
                res.locals.comkey || '', this.networktype, res.locals.comkeyStatus || '',
                this.url, this.referer, res.locals.ip, this.remark);
        };
    }

    //写日志
    function save(traceData) {
        try {
            var data = traceData.format();

            logger.trace(data);
        }
        catch (e) {
            console.error(e);
        }
    }

    res.trace = {
        //PV访问
        uv: function (options) {
            var trace = new traceData();
            trace.tracename = 'UV';
            trace.remark = req.headers['user-agent'];
            if (options) {
                if (options.spinfocode)
                    trace.spinfocode = options.spinfocode;
                if (options.token_val)
                    trace.token_val = options.token_val;
                if (options.user)
                    trace.user = options.user;
                if (options.name)
                    trace.eventname = options.name;
                if (options.params) {
                    trace.eventparams = options.params;
                    if (typeof trace.eventparams == "object")
                        trace.eventparams = querystring.stringify(trace.eventparams);
                }
            }
            save(trace);
        },

        // //访问跟踪=Visit
        // visit: function () {
        //   var locals = res.locals;
        //   if (locals.visit)
        //     return;

        //   var trace = new traceData();
        //   trace.tracename = 'Visit';
        //   trace.remark = req.headers['user-agent'];
        //   save(trace);
        // },

        //透传跟踪=Unikey
        //option={phone: 透传到手机号}
        /*comkey: function (options) {
          var trace = new traceData();
          trace.tracename = 'Unikey';
          if(options) {
            if (options.phone)
              trace.user.phone = options.phone;
          }
          save(trace);
        },*/

        //动作日志=Event
        //option={user: 用户信息, name: 事件名, params: 事件参数}
        event: function (options) {
            var trace = new traceData();
            trace.tracename = 'Event';
            if (options) {
                if (options.spinfocode)
                    trace.spinfocode = options.spinfocode;
                if (options.token_val)
                    trace.token_val = options.token_val;
                if (options.user)
                    trace.user = options.user;
                if (options.name)
                    trace.eventname = options.name;
                if (options.params) {
                    trace.eventparams = options.params;
                    if (typeof trace.eventparams == "object")
                        trace.eventparams = querystring.stringify(trace.eventparams);
                }
            }
            save(trace);
        },

        //接口日志=Interface
        //option={user: 用户信息, name: 接口名, params: 接口参数}
        interface: function (options) {
            var trace = new traceData();
            trace.tracename = 'Interface';
            if (options) {
                if (options.spinfocode)
                    trace.spinfocode = options.spinfocode;
                if (options.token_val)
                    trace.token_val = options.token_val;
                if (options.moneyje)
                    trace.explain = options.moneyje;
                if (options.user)
                    trace.user = options.user;
                if (options.name)
                    trace.eventname = options.name;
                if (options.params) {
                    trace.eventparams = options.params;
                    if (typeof trace.eventparams == "object")
                        trace.eventparams = querystring.stringify(trace.eventparams);
                }
            }
            save(trace);
        },

        //错误日志=Error
        //option={user: 用户信息, name: 接口名, params: 接口参数, msg: 错误信息}
        error: function (options) {
            var trace = new traceData();
            trace.tracename = 'Error';
            if (options) {
                if (options.user)
                    trace.user = options.user;
                if (options.name)
                    trace.eventname = options.name;
                if (options.params) {
                    trace.eventparams = options.params;
                    if (typeof trace.eventparams == "object")
                        trace.eventparams = querystring.stringify(trace.eventparams);
                }
                if (options.msg) {
                    trace.explain = options.msg;
                    if (typeof trace.explain == "object")
                        trace.explain = JSON.stringify(trace.explain);
                }
            }
            save(trace);
        },

        //其它日志=Other
        //option={user: 用户信息, name: 事件名, params: 事件参数, msg: 附加信息}
        other: function (options) {
            var trace = new traceData();
            trace.tracename = 'Other';
            if (options) {
                if (options.user)
                    trace.user = options.user;
                if (options.name)
                    trace.eventname = options.name;
                if (options.params) {
                    trace.eventparams = options.params;
                    if (typeof trace.eventparams == "object")
                        trace.eventparams = querystring.stringify(trace.eventparams);
                }
                if (options.msg) {
                    trace.explain = options.msg;
                    if (typeof trace.explain == "object")
                        trace.explain = JSON.stringify(trace.explain);
                }
            }
            save(trace);
        }
    }
    next();
}
