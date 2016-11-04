//////////////
// 入口文件 //
//////////////
// 引入express
var express = require('express')
//引入path
var path = require('path')

var bodyParser = require('body-parser')
// 引入 serve-static模块 用来设置静态资源目录
var serveStatic = require('serve-static')
//启用cookie控制模块
var cookieParser = require('cookie-parser')
var session = require('express-session')
var connect = require('connect')
// 引入 mongoose
var mongoose = require('mongoose')
// 引入 connect-mongo
var mongoStore = require('connect-mongo')(session)
// 引入 debug 信息模块
var morgan = require('morgan')
var logger = morgan('dev')

// 设置端口
var port = process.env.PORT || 3000
// 启动一个app服务器
var app = express()
var dbUrl = 'mongodb://localhost/movies'

mongoose.Promise = global.Promise
// 启用本地数据库
mongoose.connect(dbUrl)

//服务器连接测试
mongoose.connection.on('connected', function(){
    console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
    console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
    console.log('Connection disconnected');
});

// 设置模版根目录
app.set('views', './app/views/pages')
// 设置默认文本引擎
app.set('view engine', 'jade')
// 将表单中提交的数据格式化
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
// 设置资源路径 __dirname根目录
app.use(serveStatic(path.join(__dirname, 'public')))
// 引入cookie模块
app.use(cookieParser())
app.use(session({
	secret: 'moviedemo',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}))
// 设置dubug信息
if('development' === app.get('env')){
	app.set('showStackError', true) // 打印相关错误
	app.use(logger)	// method 请求类型 url 请求地址 status 请求建立状态
	app.locals.pretty = true 	// html非压缩模式
	mongoose.set('debug', true)	// mongoose debug 模式开启
}

// 引入路由设置
require('./config/routes')(app)
// 引入moment模块
app.locals.moment = require('moment')
// 监听端口
app.listen(port)

console.log('movieDemo started on port ' + port)