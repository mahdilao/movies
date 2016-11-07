$(function() {
	$('#addComment').click(function(e) {
		var comment = {
			movie: $('#comment-movie').val(),
			from: $('#comment-from').val(),
			content: $('#comment-content').val()
		}
		$.ajax({
			url: '/user/comment',
			type: 'post',
			dataType: 'jsonp',
			crossDomain: false,  // øÁ”Ú
			jsonp: 'callback',
			success: function(data){
				$('#comment-content').val("")
			}
		})
	})
})