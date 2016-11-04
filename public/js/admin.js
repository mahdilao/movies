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
	// 调用豆瓣API
	$('#douban').blur(function(){
		var douban = $('#douban')
		var id = douban.val()
		if (id){
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,  // 跨域请求
				jsonp: 'callback',
				success: function(data){
					$('#inputTitle').val(data.title)
					$('#inputDoctor').val(data.directors[0].name)
					$('#inputCountry').val(data.countries[0])
					$('#inputPoster').val(data.images.large)
					$('#inputYear').val(data.year)
					$('#inputSummary').val(data.summary)
				}
			})
		}
	})

})
