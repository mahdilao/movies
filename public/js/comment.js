$(function() {
	$('#addComment').click(function(e) {
		var comment = {
			movie: $('#comment-movie').val(),
			from: $('#comment-from').val(),
			content: $('#comment-content').val()
		}
		$.ajax({
				type: 'POST',
				data: comment,
				url: '/user/comment',
				contentType: 'application/json',
				dataType: 'json',
				async: false,
				cache: false,
				timeout: 5000,
				success: function(data){
					var datas = JSON.parse(data)
					alert(data.message)
				}
			})
		.done(function(results) {
				console.log(results)
				if (results.success === 1) {
					$('#comment-content').val("")
					$('ul').eq(0).append("<li class='media'><div class='pull-left'></div><img src='#' class='media-object' style='width: 64px; height: 64px;'><div class='media-body'><h4 class='media-heading'>" + $('#comment-from').val() + "</h4><p>" + $('#comment-content').val() + "</p></div><hr></li>")
				}
			})
	})
})