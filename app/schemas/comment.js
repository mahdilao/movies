// 引入工具模块
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId

// 定义字段及字段类型
var CommentSchema = new Schema({
	movie: {
		type : ObjectId,
		ref: 'Movie'
	},
	from: {
		type : ObjectId,
		ref : 'User'
	},
	reply: [{
		from: {type: ObjectId, ref : 'User'},
		to: {type: ObjectId, ref : 'User'},
		content: String
	}],
	content: String,
	meta: {
		createAt:{
			type: String,
			default: Date().toLocaleString() // 输入默认值 当前时间
		},
		updateAt:{
			type: String,
			default: Date().toLocaleString()
		}
	}
})

// 每次存储数据时都会调用这个方法
CommentSchema.pre('save',function (next) {
	if(this.isNew) {	// 判断数据是否是新加的
		this.meta.createAt = this.meta.updateAt = Date().toLocaleString()  // 将创建时间更新时间都设置为当前时间
	}else{
		this.meta.updateAt = Date().toLocaleString()  // 否者只修改更新时间
	}
	next()
})

CommentSchema.statics = {
	fetch: function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},   //取出数据库中所有数据
	findById: function(id, cb){
		return this
		.findOne({_id: id})
		.exec(cb)
	}   //取出单条数据
}

// 导出模式
module.exports = CommentSchema