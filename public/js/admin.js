$(function (){
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)
		console.log(target);
		$.ajax({
			type:'DELETE',
			url:'/admin/movie/list?id=' + id
		})
		.done(function(results){
			console.log(results);
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove()
				}
			}
		})
	})
})
