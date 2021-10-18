$(document).ready( function() {

	$('.menu-mobile .hamburger').on('click', function(e) {
		e.preventDefault()
		if ($(this).hasClass('open')) {
			$(this).removeClass('open')
			$('.menu-content').removeClass('open')
		}else{
			$(this).addClass('open')
			$('.menu-content').addClass('open')
		}
	})	
	
});
