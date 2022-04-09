"use strict";
(function($) {
	"use strict";

	var Core = {},
		Slider = {},
		containers = [];

	var slider = null,
		imageW = null,
		slide_count = 0;

	$(document).ready(function() {
		Core.neu.init();
		Core.Helpers.init();
		if ($('.mk-slider-holder').length > 0) {
			Core.Slider.init();
		}
	});

	$(window).resize(function() {
		Core.Slider.position();
	});

	Core.neu = {
		init: function() {
			Core.neu.identifier();
			$(document).on('click', '.neu-selector', function() {
				Core.neu.selected($(this).parents('.neu-container'));
			});
		},
		identifier: function() {
			$('[data-provider="neu"]').each(function(index, item) {
				$(item).attr('data-neu', index);
				var custom_class = '';
				var selector_text = $(this).attr('data-text');
				if ($(item).attr('class')) {
					custom_class = $(item).attr('class');
				}
				var neu_container = Core.neu.select_template(custom_class, index, selector_text);
				$(neu_container).insertAfter($(item));
				Core.neu.element_grapper($(item));
			});
		},
		element_grapper: function(element) {
			var options = $(element).find('option');
			$.each(options, function(index, item) {
				var row = '<div class="neu-item" data-value="' + $(item).val() + '">' + $(item).html() + '</div>';
				$(row).appendTo($('.neu-container[data-index="' + $(element).attr('data-neu') + '"]'));
			});
		},
		select_template: function(classes, index, selector_text) {
			var template = '<div data-index="' + index + '" class="neu-container ' + classes + '">\
								<div class="neu-selector">' + selector_text + '</div>\
							</div>';
			return template;
		},
		selected: function(neu) {
			if ($(neu).hasClass('active')) {
				$(neu).removeClass('active');
				// $(neu).find('.neu-item').fadeOut('fast');
				$(neu).find('.neu-item').each(function(i, item) {
					var timer = 150 + (i * 15);
					$(item).slideUp(timer);
				});
			} else {
				$(neu).addClass('active');
				$(neu).find('.neu-item').each(function(i, item) {
					var timer = 150 + (i * 15);
					$(item).slideDown(timer);
				});
				// $(neu).find('.neu-item').fadeIn('fast');
			}
		}
	}

	Core.Slider = {
		init: function() {
			slider = $('.mk-slider-holder');
			slide_count = $('.img-container .image').length;
			$('.img-container .image').each(function(i, item) {
				var line = '<div class="line" data-index="' + (i + 1) + '"><div class="line-process"></div></div>';
				$('.line-holder').append(line);
			});
			Core.Slider.position();
			Core.Slider.slide(1);
		},
		position: function() {
			var sHeight = $('.img-container .image:first').height();
			var containerW = $('.image-holder').width();
			$('.img-container .image').css('width', containerW + 'px');
			imageW = containerW; //slider.find('.img-container .image:first').width();
			$('.img-container').css({
				'width': slide_count * imageW + 'px'
			});
			slider.css('height', sHeight);
		},
		slide: function(i) {
			if (i == 1) {
				$('.line-process').each(function(i, item) {
					$(item).css('width', 0);
				});
			}
			$('.line[data-index="' + i + '"] .line-process').animate({
				width: '100%'
			}, 3900);
			setTimeout(function(){
				var containerPosition = $('.img-container').position().left,
					nextPosition = containerPosition - imageW;

				Core.Slider.description_slide(i, slide_count);
				if (i < slide_count) {
					$('.img-container').animate({
						left: nextPosition + 'px',
						easing: "swing"
					},
					{
						queue: false,
						duration: 800,
						complete: function() {
							Core.Slider.slide(i);
						}
					});
					i++;
				} else {
					$('.img-container').animate({
						left: '0px',
						easing: "swing"
					},
					{
						queue: false,
						duration: 800,
						complete: function() {
							Core.Slider.slide(i);
						}
					});
					i = 1;
				}
			}, 4000);
		},
		description_slide: function(index, slide_count) {
			$('.desc_item[data-index="' + (index) + '"]').animate({
				left: '-=25px',
				opacity: 0,
				easing: "swing"
			},
			{
				queue: false,
				complete: function() {
					$(this).animate({
						left: '25px'
					});
					if (index < slide_count) {
						$('.desc_item[data-index="' + (index + 1) + '"]').animate({
							left: 0,
							opacity: 1,
							easing: "swing"
						},
						{
							queue: false
						});
					} else {
						$('.desc_item[data-index="1"]').animate({
							left: 0,
							opacity: 1,
							easing: "swing"
						},
						{
							queue: false
						});
					}
				}
			});


			// .find('.header-top, .slide-title, .main-title, .desc, .buttons')
			// $('.active').animate({
			// 	left: '-50px',
			// 	opacity: 0
			// },{
			// 	queue: false,
			// 	duration: 800,
			// 	complete: function() {
			// 		$(this).addClass('passive').removeClass('active');
			// 		$(this).css('left', 0);
			// 	}
			// });
			// $('.header-top_actived').addClass('header-top_passived').removeClass('header-top_actived');
			// $('.slide-title_actived').addClass('slide-title_passived').removeClass('slide-title_actived');
			// $('.main-title_actived').addClass('main-title_passived').removeClass('main-title_actived');
			// $('.desc_actived').addClass('desc_passived').removeClass('desc_actived');
			// $('.buttons_actived').addClass('buttons_passived').removeClass('buttons_actived');
		}
	}

	Core.Carousel = {
		init: function() {
			$('#carousel-example').on('slide.bs.carousel', function (e) {

			    var $e = $(e.relatedTarget);
			    var idx = $e.index();
			    var itemsPerSlide = 3;
			    var totalItems = $('.carousel-item').length;

			    if (idx >= totalItems-(itemsPerSlide-1)) {
			        var it = itemsPerSlide - (totalItems - idx);
			        for (var i=0; i<it; i++) {
			            if (e.direction=="left") {
			                $('.carousel-item').eq(i).appendTo('.carousel-inner');
			            }
			            else {
			                $('.carousel-item').eq(0).appendTo('.carousel-inner');
			            }
			        }
			    }
			});
		}
	}

	Core.Helpers = {
		init: function() {
			$(document).on('click', '.toggle-search', function() {
				if ($('.search-active').length > 0) {
					$('.search-active').removeClass('search-active').addClass('search-container');
				} else {
					$('.search-container').removeClass('search-container').addClass('search-active');
				}
			});
		}
	}

})(jQuery);
