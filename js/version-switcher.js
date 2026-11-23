(function () {
    'use strict';

    var params = new URLSearchParams(window.location.search);
    var isWeddingInvitation = params.get('invite') === 'wedding';

    document.title = isWeddingInvitation
        ? "Harsh & Priyanshi's Wedding"
        : 'Harsh & Priyanshi – Wedding Celebrations';

    document.documentElement.classList.toggle('invitation-version', isWeddingInvitation);

    if (!isWeddingInvitation) {
        document.body.classList.remove('invitation-version');
        return;
    }

    document.body.classList.add('invitation-version');

    var allowedEventNumbers = [3, 4];
    var choices = Array.prototype.slice.call(document.querySelectorAll('.event-choice'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.event-panel'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.event-dot'));

    function eventNumber(element) {
        var match = element.id.match(/(\d+)$/);
        return match ? Number(match[1]) : 0;
    }

    choices.forEach(function (choice) {
        if (allowedEventNumbers.indexOf(eventNumber(choice)) === -1) {
            choice.remove();
        }
    });

    panels.forEach(function (panel) {
        if (allowedEventNumbers.indexOf(eventNumber(panel)) === -1) {
            panel.remove();
        }
    });

    dots.forEach(function (dot) {
        var controlledPanelId = dot.getAttribute('aria-controls') || '';
        var match = controlledPanelId.match(/(\d+)$/);
        var dotEventNumber = match ? Number(match[1]) : 0;
        if (allowedEventNumbers.indexOf(dotEventNumber) === -1) {
            dot.remove();
        }
    });

    var weddingChoices = Array.prototype.slice.call(document.querySelectorAll('.event-choice'));
    var weddingPanels = Array.prototype.slice.call(document.querySelectorAll('.event-panel'));
    var weddingDots = Array.prototype.slice.call(document.querySelectorAll('.event-dot'));

    weddingChoices.forEach(function (choice, index) {
        var displayNumber = index + 1;
        var paddedNumber = displayNumber < 10 ? '0' + displayNumber : String(displayNumber);
        var panelId = 'event-panel-' + (index + 1);
        choice.id = 'event-choice-' + (index + 1);
        choice.setAttribute('aria-controls', panelId);
        choice.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        choice.setAttribute('tabindex', index === 0 ? '0' : '-1');
        choice.classList.toggle('is-active', index === 0);
        choice.querySelector('.event-choice-number').textContent = paddedNumber;
    });

    weddingPanels.forEach(function (panel, index) {
        var choiceId = 'event-choice-' + (index + 1);
        var displayNumber = index + 1;
        panel.id = 'event-panel-' + displayNumber;
        panel.setAttribute('aria-labelledby', choiceId);
        panel.hidden = index !== 0;
        panel.classList.toggle('is-active', index === 0);
    });

    weddingDots.forEach(function (dot, index) {
        var displayNumber = index + 1;
        dot.setAttribute('aria-label', 'Show event ' + displayNumber);
        dot.setAttribute('aria-controls', 'event-panel-' + displayNumber);
        dot.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
        dot.classList.toggle('is-active', index === 0);
    });

    var eventCount = document.querySelector('.event-count');
    if (eventCount) {
        eventCount.textContent = '01 / ' + (weddingChoices.length < 10 ? '0' : '') + weddingChoices.length;
    }
}());
