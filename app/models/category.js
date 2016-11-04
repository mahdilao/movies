// 加载工具模块
var mongoose = require('mongoose')
// 引入模式文件
var CategorySchema = require('../schemas/category')
// 编译生成Category模型
var Category = mongoose.model('Category', CategorySchema)

// 将构造函数导出
module.exports = Category