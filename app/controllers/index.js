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
			select: 'title poster',
			categories: categories
		})
	})
}

//search page
exports.search = function(req, res) {
	var catId = req.query.cat
	var page = parseInt(req.query.p, 10)
	var count = 3
	var index = page * count

	Category.find({_id: catId})
	.populate({
		path: 'movies',
		select: 'title poster',
		// options: {limit:count, skip: index}
	}) // options:{limit:5, skip: index} 限制输出条数,并跳到索引位置
	.exec(function(err, categories){
		if (err) {
			console.log(err);
		}
		console.log(categories);
		// 渲染数据
		var category = categories[0] || {}
		var movies = category.movies || []
		var results = movies.slice(index, index + count)
		console.log('category is：')
		console.log(category)
		console.log(Math.ceil(movies.length / count))
		console.log(movies)
		res.render('results', {
			title: 'movie 结果列表页',
			keywoed: category.name,
			currentPage: (page + 1), // 当前页面
			totalPage: Math.ceil(movies.length / count), // 总页数
			query: 'cat=' + catId,
			movies: results
			// category: category
		})
	})
}