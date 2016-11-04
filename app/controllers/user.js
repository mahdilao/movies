var User = require('../models/user')
	//signup page
exports.signup = function(req, res) {
	// console.log('进入注册验证')
	// req.body 直接获取传递的对象
	var _user = req.body.user
		// 直接获取传递的对象
		// req.param('user')
		// /user/singup/:userid
		// 接收传递的变量
		// req.params.userid
		// /user/singup/1111?userid=2222
		// req.query.userid
	User.findOne({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err)
		}
		if (user) {
			return res.redirect('/signin')
		} else {
			var user = new User(_user)
			user.save(function(err, user) {
				if (err) {
					console.log(err)
				}
				console.log('添加成功');
				res.redirect('/')
			})
		}
	})
}

//signin page
exports.signin = function(req, res) {
	var _user = req.body.user
	var name = _user.name
	var password = _user.password
	// console.log('进入登录验证')
	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err)
		}
		if (!user) {
			return res.redirect('/signup')
		}
		// 密码加密验证方法
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				console.log(err)
			}
			if (isMatch) {
				// 将数据存到内存
				req.session.user = user
				console.log('password is matched');
				return res.redirect('/')
			} else {
				return res.redirect('/signin')
			}
		})
	})
}

// showSignin
exports.showSignin = function (req, res) {
	res.render('signin',{
		title: 'movie 登录页面'
	})
}

// showSignup
exports.showSignup = function (req, res) {
		res.render('signup',{
		title: 'movie 注册页面'
	})
}

//signout page
exports.logout = function(req, res) {
		delete req.session.user
		// delete app.locals.user
		res.redirect('/')
}
//userlist page
exports.list = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		// 渲染数据
		res.render('userlist', {
			title: 'movie 用户列表页',
			users: users
		})
	})
}

// signinRequired
exports.signinRequired = function(req, res, next){
	var user = req.session.user
	if(!user){
		return res.redirect('/signin')
	}
	next()

}

// adminRequired
exports.adminRequired = function(req, res, next){
	var user = req.session.user
	if(user.role < 10){
		return res.redirect('/signin')
	}
	next()
}