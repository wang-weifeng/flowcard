/**
 * Created by LXP on 2017/3/23.
 */
"use strict";


module.exports = function (req, res, next) {
  res.locals = {
    // //登录用户，val=JSON，=null清理
    // get user() {
    // 	var user = ''
    //   return user;
    // },
    //获取X-Forwarded-For内的IP
    get ip() {
      return req.headers['x-forwarded-for'] || req.ip;
    },
    //是否微信浏览器
    get isWeChar() {
      return req.headers['user-agent'].indexOf('MicroMessenger') > -1;
    },

    //是否移动客户端
    get isMobileClient() {
      return req.headers['user-agent'].indexOf('Mobile') > -1;
    }
  };
  next();
}