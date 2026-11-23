(function () {
    'use strict';

    var pages = Array.prototype.slice.call(document.querySelectorAll('#wedding-pages > .wedding-page'));
    var previousButton = document.getElementById('page-back');
    var nextButton = document.getElementById('page-next');
    var indicator = document.getElementById('page-indicator');
    var navigation = document.querySelector('.navigation');
    var activeIndex = 0;

    if (!pages.length || !previousButton || !nextButton || !indicator || !navigation) {
        return;
    }

    document.body.classList.add('page-stepper-ready');

    function indexFromHash() {
        var id = decodeURIComponent(window.location.hash.slice(1));
        var target = id === 'top' ? pages[0] : document.getElementById(id);
        var page = target && (target.classList.contains('wedding-page') ? target : target.closest('.wedding-page'));
        return pages.indexOf(page);
    }

    function showPage(index, updateHash) {
        if (index < 0 || index >= pages.length) {
            return;
        }

        activeIndex = index;
        document.body.classList.toggle('falling-flowers-active', activeIndex > 0);
        document.body.classList.toggle('on-welcome-page', activeIndex === 0);
        pages.forEach(function (page, pageIndex) {
            var isActive = pageIndex === activeIndex;
            page.classList.toggle('is-active', isActive);
            page.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            page.inert = !isActive;
            if (isActive) {
                page.scrollTop = 0;
            }
        });

        var activePage = pages[activeIndex];
        var pageName = activePage.getAttribute('data-page-label') || 'Section';
        var currentNumber = String(activeIndex + 1).padStart(2, '0');
        var totalNumber = String(pages.length).padStart(2, '0');
        indicator.textContent = currentNumber + ' / ' + totalNumber;
        indicator.setAttribute('aria-label', 'Page ' + (activeIndex + 1) + ' of ' + pages.length + ': ' + pageName);
        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === pages.length - 1;
        navigation.classList.toggle('fixed', activeIndex !== 0);

        if (updateHash && window.location.hash !== '#' + activePage.id) {
            window.location.hash = activePage.id;
        }
    }

    function handlePageLink(event) {
        var target = event.target.nodeType === 1 ? event.target : event.target.parentElement;
        var link = target.closest('a[href^="#"]');
        if (!link) {
            return;
        }

        var id = decodeURIComponent(link.getAttribute('href').slice(1));
        if (!id) {
            return;
        }

        var destination = id === 'top' ? pages[0] : document.getElementById(id);
        var page = destination && (destination.classList.contains('wedding-page') ? destination : destination.closest('.wedding-page'));
        var index = pages.indexOf(page);
        if (index === -1) {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        showPage(index, true);
    }

    previousButton.addEventListener('click', function () {
        showPage(activeIndex - 1, true);
    });

    nextButton.addEventListener('click', function () {
        showPage(activeIndex + 1, true);
    });

    document.addEventListener('click', handlePageLink, true);

    window.addEventListener('popstate', function () {
        var index = indexFromHash();
        if (index !== -1) {
            showPage(index, false);
        }
    });

    window.addEventListener('hashchange', function () {
        var index = indexFromHash();
        if (index !== -1 && index !== activeIndex) {
            showPage(index, false);
        }
    });

    document.addEventListener('keydown', function (event) {
        var target = event.target;
        var isTyping = target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName);
        if (isTyping || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('.modal.in, .fancybox-overlay')) {
            return;
        }

        if (event.key === 'ArrowRight' && activeIndex < pages.length - 1) {
            event.preventDefault();
            showPage(activeIndex + 1, true);
        } else if (event.key === 'ArrowLeft' && activeIndex > 0) {
            event.preventDefault();
            showPage(activeIndex - 1, true);
        }
    });

    var pageSwipeStart = null;

    document.addEventListener('touchstart', function (event) {
        if (event.touches.length !== 1) {
            pageSwipeStart = null;
            return;
        }

        var target = event.target;
        if (target.closest('.event-detail, .music-player, input, textarea, select, a, button')) {
            pageSwipeStart = null;
            return;
        }

        pageSwipeStart = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    }, { passive: true });

    document.addEventListener('touchend', function (event) {
        if (!pageSwipeStart || event.changedTouches.length !== 1) {
            pageSwipeStart = null;
            return;
        }

        var touch = event.changedTouches[0];
        var distanceX = touch.clientX - pageSwipeStart.x;
        var distanceY = touch.clientY - pageSwipeStart.y;
        pageSwipeStart = null;

        if (Math.abs(distanceX) < 70 || Math.abs(distanceX) < Math.abs(distanceY) * 1.25) {
            return;
        }

        if (distanceX < 0 && activeIndex < pages.length - 1) {
            showPage(activeIndex + 1, true);
        } else if (distanceX > 0 && activeIndex > 0) {
            showPage(activeIndex - 1, true);
        }
    }, { passive: true });

    var initialIndex = indexFromHash();
    showPage(initialIndex === -1 ? 0 : initialIndex, false);
}());
