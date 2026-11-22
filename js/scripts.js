$(document).ready(function () {

    /***************** Waypoints ******************/

    $('.wp1').waypoint(function () {
        $('.wp1').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp2').waypoint(function () {
        $('.wp2').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp3').waypoint(function () {
        $('.wp3').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp4').waypoint(function () {
        $('.wp4').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp5').waypoint(function () {
        $('.wp5').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp6').waypoint(function () {
        $('.wp6').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });
    $('.wp7').waypoint(function () {
        $('.wp7').addClass('animated fadeInUp');
    }, {
        offset: '75%'
    });
    $('.wp8').waypoint(function () {
        $('.wp8').addClass('animated fadeInLeft');
    }, {
        offset: '75%'
    });
    $('.wp9').waypoint(function () {
        $('.wp9').addClass('animated fadeInRight');
    }, {
        offset: '75%'
    });

    /***************** Initiate wedding photo carousel ******************/
    var $photoCarousel = $('#eng-pics .photo-carousel');
    var photoSlideshowEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function initializePhotoCarousel() {
        if (!$photoCarousel.length || $photoCarousel.data('flexslider')) {
            return;
        }

        $photoCarousel.flexslider({
            animation: 'slide',
            animationSpeed: 700,
            controlNav: true,
            directionNav: true,
            pauseOnHover: true,
            slideshow: photoSlideshowEnabled,
            slideshowSpeed: 4500
        });
    }

    document.addEventListener('wedding:pagechange', function (event) {
        if (event.detail.pageId === 'eng-pics') {
            initializePhotoCarousel();
            if (photoSlideshowEnabled && $photoCarousel.data('flexslider')) {
                $photoCarousel.flexslider('play');
            }
        } else if ($photoCarousel.data('flexslider')) {
            $photoCarousel.flexslider('pause');
        }
    });

    if ($('#eng-pics').hasClass('is-active')) {
        initializePhotoCarousel();
    }

    /***************** Initiate Fancybox ******************/

    $('.single_image').fancybox({
        padding: 4
    });

    $('.fancybox').fancybox({
        padding: 4,
        width: 1000,
        height: 800
    });

    /***************** Tooltips ******************/
    $('[data-toggle="tooltip"]').tooltip();

    /***************** Nav Transformicon ******************/

    /* When user clicks the Icon */
    $('.nav-toggle').click(function () {
        $(this).toggleClass('active');
        $('.header-nav').toggleClass('open');
        event.preventDefault();
    });
    /* When user clicks a link */
    $('.header-nav li a').click(function () {
        $('.nav-toggle').toggleClass('active');
        $('.header-nav').toggleClass('open');

    });

    /***************** Wedding event carousel ******************/

    var petalLayer = document.querySelector('.falling-petals');
    if (petalLayer) {
        var petalColors = ['#cf7886', '#df8b8b', '#d8a53d', '#e1ba76'];
        for (var petalIndex = 0; petalIndex < 16; petalIndex += 1) {
            var petal = document.createElement('span');
            var fallDuration = 8 + Math.random() * 9;
            var swayA = (Math.random() * 100 - 50).toFixed(0);
            var swayB = (Math.random() * 100 - 50).toFixed(0);

            petal.className = 'falling-petal';
            petal.style.setProperty('--petal-color', petalColors[Math.floor(Math.random() * petalColors.length)]);
            petal.style.setProperty('--petal-left', (Math.random() * 100).toFixed(2) + 'vw');
            petal.style.setProperty('--petal-width', (8 + Math.random() * 7).toFixed(0) + 'px');
            petal.style.setProperty('--petal-height', (12 + Math.random() * 10).toFixed(0) + 'px');
            petal.style.setProperty('--petal-opacity', (0.45 + Math.random() * 0.4).toFixed(2));
            petal.style.setProperty('--fall-duration', fallDuration.toFixed(2) + 's');
            petal.style.setProperty('--fall-delay', (-Math.random() * fallDuration).toFixed(2) + 's');
            petal.style.setProperty('--sway-a', swayA + 'px');
            petal.style.setProperty('--sway-b', swayB + 'px');
            petalLayer.appendChild(petal);
        }
    }

    var $eventChoices = $('.event-choice');
    var $eventPanels = $('.event-panel');
    var $eventDots = $('.event-dot');
    var $eventCount = $('.event-count');
    var activeEventIndex = 0;

    if ($eventChoices.length && $eventPanels.length) {
        function showEvent(index, focusChoice) {
            activeEventIndex = (index + $eventChoices.length) % $eventChoices.length;

            $eventChoices.each(function (choiceIndex) {
                var isActive = choiceIndex === activeEventIndex;
                $(this)
                    .toggleClass('is-active', isActive)
                    .attr('aria-selected', isActive ? 'true' : 'false')
                    .attr('tabindex', isActive ? '0' : '-1');
            });

            $eventPanels.each(function (panelIndex) {
                var isActive = panelIndex === activeEventIndex;
                $(this).toggleClass('is-active', isActive).prop('hidden', !isActive);
            });

            $eventDots.each(function (dotIndex) {
                var isActive = dotIndex === activeEventIndex;
                $(this)
                    .toggleClass('is-active', isActive)
                    .attr('aria-pressed', isActive ? 'true' : 'false');
            });

            if ($eventCount.length) {
                var currentNumber = activeEventIndex + 1;
                var totalNumber = $eventChoices.length;
                $eventCount.text(
                    (currentNumber < 10 ? '0' : '') + currentNumber + ' / ' +
                    (totalNumber < 10 ? '0' : '') + totalNumber
                );
            }

            if (focusChoice) {
                $eventChoices.eq(activeEventIndex).trigger('focus');
            }
        }

        $eventChoices.on('click', function () {
            showEvent($eventChoices.index(this), false);
        });

        $eventDots.on('click', function () {
            showEvent($eventDots.index(this), false);
        });

        $('.event-previous').on('click', function () {
            showEvent(activeEventIndex - 1, false);
        });

        $('.event-next').on('click', function () {
            showEvent(activeEventIndex + 1, false);
        });

        $eventChoices.on('keydown', function (event) {
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                event.stopPropagation();
                showEvent(activeEventIndex + 1, true);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                event.stopPropagation();
                showEvent(activeEventIndex - 1, true);
            } else if (event.key === 'Home') {
                event.preventDefault();
                event.stopPropagation();
                showEvent(0, true);
            } else if (event.key === 'End') {
                event.preventDefault();
                event.stopPropagation();
                showEvent($eventChoices.length - 1, true);
            }
        });

        var eventTouchStartX = null;
        $('.event-detail')
            .on('touchstart', function (event) {
                var touch = event.originalEvent.touches[0];
                eventTouchStartX = touch.clientX;
            })
            .on('touchend', function (event) {
                if (eventTouchStartX === null) {
                    return;
                }

                var touch = event.originalEvent.changedTouches[0];
                var swipeDistance = touch.clientX - eventTouchStartX;
                eventTouchStartX = null;

                if (Math.abs(swipeDistance) >= 48) {
                    showEvent(activeEventIndex + (swipeDistance < 0 ? 1 : -1), false);
                }
            });

        showEvent(0, false);
    }

    /***************** Wedding music controls ******************/

    var weddingAudio = document.getElementById('wedding-audio');
    var musicMute = $('#music-mute');
    var musicStatus = $('#music-status');

    if (weddingAudio && musicMute.length) {
        function startWeddingMusic() {
            if (!weddingAudio.paused) {
                return;
            }

            var playback = weddingAudio.play();
            if (playback && typeof playback.catch === 'function') {
                playback.catch(function (error) {
                    if (error.name === 'NotAllowedError') {
                        musicStatus.text('Interact with the page to start the wedding music.');
                        return;
                    }

                    musicStatus.text('Unable to play the wedding song.');
                    console.error('Wedding music playback failed.', error);
                });
            }
        }

        function startMusicOnInteraction() {
            document.removeEventListener('pointerdown', startMusicOnInteraction, true);
            document.removeEventListener('touchstart', startMusicOnInteraction, true);
            document.removeEventListener('keydown', startMusicOnInteraction, true);
            startWeddingMusic();
        }

        musicMute.on('click', function () {
            weddingAudio.muted = !weddingAudio.muted;
            var isMuted = weddingAudio.muted;
            musicMute
                .attr('aria-label', isMuted ? 'Unmute wedding music' : 'Mute wedding music')
                .attr('aria-pressed', isMuted ? 'true' : 'false')
                .find('i')
                .toggleClass('fa-volume-up', !isMuted)
                .toggleClass('fa-volume-off', isMuted);
            musicMute.find('span').text(isMuted ? 'Unmute' : 'Mute');
            musicStatus.text(isMuted ? 'Wedding music muted.' : 'Wedding music unmuted.');
        });

        $(weddingAudio).on('play', function () {
            musicStatus.text('Wedding music playing.');
        });

        $(weddingAudio).on('error', function () {
            musicStatus.text('The wedding song could not be loaded.');
            console.error('Wedding music failed to load.', weddingAudio.error);
        });

        document.addEventListener('pointerdown', startMusicOnInteraction, true);
        document.addEventListener('touchstart', startMusicOnInteraction, true);
        document.addEventListener('keydown', startMusicOnInteraction, true);
        startWeddingMusic();
    }

    /***************** Header BG Scroll ******************/

    $(function () {
        $(window).scroll(function () {
            var scroll = $(window).scrollTop();

            if (scroll >= 20) {
                $('section.navigation').addClass('fixed');
                $('header').css({
                    "border-bottom": "none",
                    "padding": "14px 0"
                });
                $('header .member-actions').css({
                    "top": "22px",
                });
                $('header .navicon').css({
                    "top": "21px",
                });
            } else {
                $('section.navigation').removeClass('fixed');
                $('header').css({
                    "border-bottom": "solid 1px rgba(255, 255, 255, 0.2)",
                    "padding": "14px 0"
                });
                $('header .member-actions').css({
                    "top": "22px",
                });
                $('header .navicon').css({
                    "top": "21px",
                });
            }
        });
    });
    /***************** Smooth Scrolling ******************/

    $(function () {

        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 90
                    }, 2000);
                    return false;
                }
            }
        });

    });

    /********************** Social Share buttons ***********************/
    var share_bar = document.getElementsByClassName('share-bar');
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/platform.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);

    for (var i = 0; i < share_bar.length; i++) {
        var html = '<iframe allowtransparency="true" frameborder="0" scrolling="no"' +
            'src="https://platform.twitter.com/widgets/tweet_button.html?url=' + encodeURIComponent(window.location) + '&amp;text=' + encodeURIComponent(document.title) + '&amp;via=ramswarooppatra&amp;hashtags=ramandantara&amp;count=horizontal"' +
            'style="width:105px; height:21px;">' +
            '</iframe>' +

            '<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURIComponent(window.location) + '&amp;width&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=101094500229731&amp;width=150" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:150px; height:21px;" allowTransparency="true"></iframe>' +

            '<div class="g-plusone" data-size="medium"></div>';

        // '<iframe src="https://plusone.google.com/_/+1/fastbutton?bsv&amp;size=medium&amp;url=' + encodeURIComponent(window.location) + '" allowtransparency="true" frameborder="0" scrolling="no" title="+1" style="width:105px; height:21px;"></iframe>';

        share_bar[i].innerHTML = html;
        share_bar[i].style.display = 'inline-block';
    }

    /********************** Toggle Map Content **********************/
    $('#btn-show-map').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });
    $('#btn-show-content').click(function () {
        $('#map-content').toggleClass('toggle-map-content');
        $('#btn-show-content').toggleClass('toggle-map-content');
    });

});

/********************** Extras **********************/

// Google map
function initMap() {
    var location = {lat: 21.1877888, lng: 72.8236032};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: location,
        scrollwheel: false
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function initBBSRMap() {
    var la_fiesta = {lat: 20.305826, lng: 85.85480189999998};
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 15,
        center: la_fiesta,
        scrollwheel: false
    });

    var marker = new google.maps.Marker({
        position: la_fiesta,
        map: map
    });
}
