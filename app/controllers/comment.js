var Comment = require('../models/comment')

// admin post movie 接收从后台post来的数据
exports.save = function(req, res) {
	var _comment = req.body.comment
	// var _comment = req.query.comment
	// console.log(_comment)
	var movieId = _comment.movie


	if(_comment.cid){
		Comment.findById(_comment.cid, function(err, comment){
			if(err){
				console.log(err)
			}
			var reply = {
				from: _comment.from,
				to: _comment.tid,
				content: _comment.content
			}
			console.log(reply);
			comment.reply.push(reply)

			comment.save(function(err, comment) {
				if (err) {
					console.log(err)
				}
				res.redirect('/movie/' + movieId)
			})
		})
	}else{
		var comment = new Comment(_comment)

		comment.save(function(err, comment) {
			if (err) {
				console.log(err)
			}
			res.redirect('/movie/' + movieId)
			// res.json({success:1})
		})
	}
}