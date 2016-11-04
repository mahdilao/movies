var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')

//detail page
exports.detail = function(req, res) {
	var id = req.params.id

	Movie.findById(id, function(err, movie) {
		Comment.find({movie: id})
			.populate('from', 'name') // 查询到该电影，将from赋值给name，填充回页面
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments){
				console.log('comments: ')
				console.log(comments)
				res.render('detail', {
					title: 'movie ' + movie.title,
					movie: movie,
					comments: comments
				})
		})
	})
}

//admin page
exports.new = function(req, res) {
	Category.find({},function(err, categories){
	res.render('admin', {
		title: 'movie 后台录入页',
		movie: {},
		categories : categories
		})
	})
}

// admin update movie
exports.update = function(req, res) {
	var id = req.params.id
	if (id) {
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			Category.find({},function(err, categories){
				res.render('admin', {
					title: 'movie 后台录入页',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

// admin post movie 接收从后台post来的数据
exports.save = function(req, res) {
	var id = req.body.movie._id //获取传递过来的id
	var movieObj = req.body.movie
	var _movie

	if (id) { // 判断数据id是否存在
		Movie.findById(id, function(err, movie) {
			if (err) {
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie) {
				if(err){
					console.log(err)
				}
				//重定位到详情页
				res.redirect('/movie/' + movie._id)
			})
		})
	} else {
		_movie = new Movie(movieObj)

		var categoryId = _movie.category
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			Category.findById(categoryId, function(err, category){
				category.movies.push(movie._id)
				category.save(function(err, category){
					res.redirect('/movie/' + movie._id)
				})
			})
		})
	}
}

//list page
exports.list = function(req, res) {
	Movie.fetch(function(err, movise) {
		if (err) {
			console.log(err);
		}
		// 渲染数据
		res.render('list', {
			title: 'movie 列表页',
			movies: movise
		})
	})
}

//list delete movie
exports.del = function(req, res) {
	var id = req.query.id

	if (id) {
		Movie.remove({
			_id: id
		}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				})
			}
		})
	}
}