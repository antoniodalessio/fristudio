$(document).ready( function() {
	
	var $btnMenu = $(".menu button");
	var $menu = $(".menu .menu__container");
	var $closeMenuBtn = $(".close-icon");

	$btnMenu.on("click", function() {
		$menu.toggleClass("open");
	});

	$closeMenuBtn.on("click", function() {
		$menu.removeClass("open");
	});

	//add click event to menu items
	$('.menu__container nav > ul li').each(function() {
		if ($(this).find('.submenu').length > 0) {
			var $submenu = $(this).find('.submenu');
			
			$(this).find('> a').on('click', function(e) {
				e.preventDefault();
				var open = $submenu.hasClass('open');
				if (open) {
					$submenu.fadeOut().removeClass('open')
				}else{
					$submenu.fadeIn().addClass('open');
				}
			});
		}
	});


	//open submenu when active
	$('.menu__container nav .submenu li').each(function() {
		if ($(this).hasClass('active')){
			var $submenu = $(this).closest('.submenu');
			$submenu.show().addClass('open');
		}
	});

	function animateText($textAnimationContainer, index, tot) {
		$textAnimationContainer
			.delay(1000)
			.animate({
				top: -70 * index
			}, 300, function() {
				animateText($textAnimationContainer, (index + 1 + tot) % tot, tot)
			})
			
	}

	var $textAnimationContainer = $('.text-animation__container');
	var textCount = $textAnimationContainer.find('p').length;
	var index = 0;

	
	animateText($textAnimationContainer, index, textCount)
	

});
