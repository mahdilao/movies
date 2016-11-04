var Movie = require('../models/movie')
var Category = require('../models/category')

//index page
exports.index = function(req, res) {
	Category.find({})
	.populate({path: 'movies', options:{limit:6}}) // options:{limit:5} 限制输出条数
	.exec(function(err, categories){
		if (err) {
			console.log(err);
		}
		console.log(categories);
		// 渲染数据
		res.render('index', {
			title: 'movie 首页',
			categories: categories
		})
	})
}