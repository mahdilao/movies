// 引入工具模块
var mongoose = require('mongoose')

// 引入密码加密模块
var  bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10;
// 定义字段及字段类型
var UserSchema = new mongoose.Schema({
	name: {
		unqiue: true, // 设置唯一字段
		type: String
	},
	password: String,
	// 用户权限字段
	// 0：nomal user
	// 1: verfied user
	// 2: porfessnoal user
	// >10: admin
	// >50: super admin
	role: {
		type: Number,
		default: 0
	},
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
UserSchema.pre('save',function (next) {
	var user = this
	if(this.isNew) {	// 判断数据是否是新加的
		this.meta.createAt = this.meta.updateAt = Date().toLocaleString()  // 将创建时间更新时间都设置为当前时间
	}else{
		this.meta.updateAt = Date().toLocaleString()  // 否者只修改更新时间
	}

	// 生成一个随机盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err)
		bcrypt.hash(user.password, salt, null, function(err, hash){
			if(err) return next(err)
			user.password = hash
			next()
		})
	})
})

// 密码加密验证
UserSchema.methods = {
	comparePassword:function(_password, cb) {
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if(err){
				return cb(err)
			}
			cb(null, isMatch)
		})
	}
}

UserSchema.statics = {
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
module.exports = UserSchema