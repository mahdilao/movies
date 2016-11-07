var Movie = require('../models/movie')
var Category = require('../models/category')
var Comment = require('../models/comment')
var _ = require('underscore')
var fs = require('fs') // 系统级别的文件读取模块
var path = require('path')  // 读取路径的模块

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

// admin savePoster
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster // 获取文件
	var filePath = posterData.path  //获取缓存地址
	var originalFilename = posterData.originalFilename // 获取文件原始名字
	if(originalFilename){
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now() // 申明一个时间戳
			var type = posterData.type.split('/')[1] // 根据文件的type获取文件格式
			var poster = timestamp + "." + type // 生成新文件地址
			var newPath = path.join(__dirname, "../../" , '/public/upload/' + poster) //将文件上传到服务器中
			fs.writeFile(newPath, data, function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

// admin post movie 接收从后台post来的数据
exports.save = function(req, res) {
	var id = req.body.movie._id //获取传递过来的id
	var movieObj = req.body.movie
	var _movie

	if (req.poster) {
		movieObj.poster = req.poster
	}

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
		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName
		_movie.save(function(err, movie) {
			if (err) {
				console.log(err)
			}
			if(categoryId){
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id)
					category.save(function(err, category){
						res.redirect('/movie/' + movie._id)
					})
				})
			}else{
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function(err, category){
					res.redirect('/movie/' + movie._id)
				})
			}
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