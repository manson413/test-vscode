
document.addEventListener("DOMContentLoaded", function() {

    //init filters
    let $grid = $('.sort-body').isotope({
        itemSelector: '.sort-item-wrap'
    });
    $('.sort-head').on('click', 'button', function () {
        let filterValue = $(this).attr('data-filter');
        $grid.isotope({filter: filterValue});
    });

    //team members
    $('.additional-photo-item').on('click', function(e){
        e.preventDefault();
        let src = $(this).find('.photo').attr('src');
        $(this).closest('.user-info-wrap').find('.user-info-img img').attr('src', src);

        let name = $(this).find('.img-title').text();
        $(this).closest('.user-info').find('.user-info-title').text(name);

        let description = $(this).find('.img-description').text();
        $(this).closest('.user-info').find('.user-info-text').text(description);
    });

    //menu scroll
    $('.main-menu a[href*="#"]').click(function() {
        let elementClick = $(this).attr("href");
        let destination = $(elementClick).offset().top;
        $('html, body').stop().animate({
            scrollTop: destination
        }, 400);
        if($(window).outerWidth() < 992){
            $('#mobile-menu-check').prop('checked', false);
        }
        return false;
    });

    //init fancybox
    $('[data-fancybox="images"]').fancybox({
        loop : true,
        protect: true,
        transitionEffect : 'circular',
        transitionDuration : 500,
        thumbs : {
            autoStart   : false,
            hideOnClose : false
        },
        buttons : ['close']
    });

//fixed header
    $(window).scroll(function() {
        let height = $(window).scrollTop();

        if(height > 30){
            $('.header').addClass('header-fixed');
        } else{
            $('.header').removeClass('header-fixed');
        }

    });

    // header is-hidden
    let header = document.getElementsByClassName('header');

    if (header) {
        let headerHeight = $(header).height(),
            scrolling = false,
            previousTop = 0,
            currentTop = 0,
            scrollDelta = 10,
            scrollOffset = 150;

        function headerScroll() {
            if( !scrolling ) {
                scrolling = true;
                (!window.requestAnimationFrame)
                    ? setTimeout(autoHideHeader, 250)
                    : requestAnimationFrame(autoHideHeader);
            }
        }

        function autoHideHeader() {
            let currentTop = $(window).scrollTop();

            //there's no secondary nav or secondary nav is below primary nav
            if (previousTop - currentTop > scrollDelta) {
                //if scrolling up...
                $(header).removeClass('is-hidden');
            } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
                //if scrolling down...
                $(header).addClass('is-hidden');
            }

            previousTop = currentTop;
            scrolling = false;
        }

        $(window).on('scroll', headerScroll);
    }

});