// 加载工具模块
var mongoose = require('mongoose')
// 引入模式文件
var CommentSchema = require('../schemas/comment')
// 编译生成Comment模型
var Comment = mongoose.model('Comment', CommentSchema)

// 将构造函数导出
module.exports = Comment