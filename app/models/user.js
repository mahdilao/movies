// 加载工具模块
var mongoose = require('mongoose')
// 引入模式文件
var UserSchema = require('../schemas/user')
// 编译生成User模型
var User = mongoose.model('User', UserSchema)

// 将构造函数导出
module.exports = User