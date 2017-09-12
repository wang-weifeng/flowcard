/**
 * Created by yr on 2017/7/28.
 */
/**
 * Created by LXP on 2017/3/23.
 */
"use strict";

var log4js = require('log4js');
var path = require('path');
var fs = require('fs');
//不需要再转换为绝对路径
var loggerConfig = fs.readFileSync(path.join(__dirname, "log4js.json"), { encoding: "utf8" });
loggerConfig = JSON.parse(loggerConfig);
for (var i in loggerConfig.appenders) {
    var _t = loggerConfig.appenders[i];
    if (_t.filename)
        _t.filename = path.join(__dirname, _t.filename);
}

//检查日志目录是否存在，不存在创建
try {
    var logsPath = path.resolve(__dirname, "../logs");
    if (!fs.existsSync(logsPath)) {
        // existsSync 测试某个路径下的文件是否存在
        fs.mkdirSync(logsPath);
        fs.mkdirSync(path.join(logsPath, "trace"));
        fs.mkdirSync(path.join(logsPath, "dev"));
    }
}
catch (err) {
    console.error(err);
}
log4js.configure(loggerConfig);
module.exports = log4js.getLogger;
