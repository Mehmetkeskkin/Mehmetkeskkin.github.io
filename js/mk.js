"use strict";
(function($) {

    var Mk = {},
        timeOutTimer;

	$(document).ready(function() {
        Mk.core.init();
	});

	Mk.core = {
		init: function() {
            Mk.core.subscribe();
            if($('.support').length > 0) {
                Mk.core.support_filter();
            }
        },
        subscribe: function() {
            $(document).on('submit', '#subscription', function(e) {
                e.preventDefault();
                $.ajax({
                    type: 'POST',
                    url: $(this).attr('action'),
                    dataType: 'JSON',
                    cache: false,
                    data: { _token: $(this).find('input[type="hidden"]').val(), email: $('input[name="sub_email"]').val() },
                    beforeSend: function() {
                        clearTimeout(timeOutTimer);
                        $('#sub_status').html('<i class="fa fa-spinner fa-spin"></i>');
                    },
                    success: function(data) {
                        $('input[name="sub_email"]').val('');
                        $('#sub_status').html(data);
                        timeOutTimer = setTimeout(() => {
                            $('#sub_status').html('');
                        }, 5000);
                    }
                });
            });
        },
        support_filter: function() {
            $(document).on('click', '.btn-filter', function() {
                if ($(this).attr('data-status') == 'deactive') {
                    $(this).attr('data-status', 'active');
                    $(this).removeClass('btn-secondary').addClass('btn-black');
                    $('.btn-filter').not(this).attr('data-status', 'deactive').removeClass('btn-black').addClass('btn-secondary');
                }

                if ($(this).attr('data-type') == 'all') {
                    $('.support .card').fadeIn('fast');
                } else {
                    $('.support .card').fadeOut('fast');
                    var search = $(this).attr('data-type');
                    $('.support .card').each(function(i, item){
                        var filter = JSON.parse($(item).attr('data-filter'));
                        $.each(filter, function(index, fl) {
                            if(fl == search) {
                                $(item).fadeIn('fast');
                            }
                        });
                    });
                }
            });
        }
	}

})(jQuery);
