var Movie = require('../models/movie')
var Category = require('../models/Category')
var _ = require('underscore')

//admin page
exports.new = function(req, res) {
	res.render('category_admin', {
		title: 'movie 后台分类录入页',
		category: {}
	})
}

// admin post category 接收从后台post来的数据
exports.save = function(req, res) {
	var _category = req.body.category
	var category = new Category(_category)
	category.save(function(err, category) {
		if (err) {
			console.log(err)
		}
		res.redirect('/admin/category/list')
	})
}

//categorylist page
exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if (err) {
			console.log(err);
		}
		// 渲染数据
		res.render('categorylist', {
			title: 'movie 分类列表页',
			categories: categories
		})
	})
}

//list delete category
exports.del = function(req, res) {
	var id = req.query.id

	if (id) {
		Category.remove({
			_id: id
		}, function(err, category) {
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