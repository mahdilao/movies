// 加载工具模块
var mongoose = require('mongoose')
// 引入模式文件
var MovieSchema = require('../schemas/movie')
// 编译生成Movie模型
var Movie = mongoose.model('Movie', MovieSchema)

// 将构造函数导出
module.exports = Movie