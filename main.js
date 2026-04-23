/* ═══ ИМЯ ГОСТЯ из URL (?name=Иван+и+Мария) ═══ */
(function () {
    var raw    = new URLSearchParams(location.search).get('name');
    var prefix = 'Дорогой';
    var guest  = 'гость';

    if (raw) {
        if (raw.charAt(0) == '1') {
            prefix = 'Дорогой';
            guest  = raw.slice(1);
        } else if (raw.charAt(0) == '2') {
            prefix = 'Дорогая';
            guest  = raw.slice(1);
        } else {
            prefix = 'Дорогие';
            guest  = raw;
        }
        document.querySelector('.greet-pre').textContent = prefix;
        document.getElementById('guestName').textContent = guest;
    } else {
        document.querySelector('.greet-pre').style.display = 'none';
        document.getElementById('guestName').style.display = 'none';
    }
})();

/* ═══ АНИМАЦИИ + НАВИГАЦИЯ (Swiper) ═══ */
var screens = Array.from(document.querySelectorAll('.screen'));
var dots    = Array.from(document.querySelectorAll('.nav-dot'));

function activateSlide(idx) {
    var slide = screens[idx];
    if (!slide) return;
    slide.querySelectorAll('[data-anim]').forEach(function (el) {
        el.classList.add('in');
    });
    dots.forEach(function (d) { d.classList.remove('on'); });
    if (dots[idx]) dots[idx].classList.add('on');
}

var swiper = new Swiper('.swiper', {
    direction: 'vertical',
    slidesPerView: 1,
    speed: 700,
    resistance: true,
    resistanceRatio: 0,
    mousewheel: true,
    keyboard: { enabled: true },
    on: {
        slideChange: function () { activateSlide(this.activeIndex); }
    }
});

activateSlide(0);

dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
        swiper.slideTo(parseInt(dot.dataset.to, 10));
    });
});

/* ═══ ТАЙМЕР ОБРАТНОГО ОТСЧЁТА ═══ */
var WEDDING_DATE = new Date('2026-04-25T18:00:00');

function pad(n) { return String(n).padStart(2, '0'); }

var countdownInterval;

function updateCountdown() {
    var now  = new Date();
    var diff = WEDDING_DATE - now;

    if (diff <= 0) {
        document.getElementById('cd-days').textContent    = '00';
        document.getElementById('cd-hours').textContent   = '00';
        document.getElementById('cd-minutes').textContent = '00';
        document.getElementById('cd-seconds').textContent = '00';
        clearInterval(countdownInterval);
        return;
    }

    var days    = Math.max(0, Math.floor(diff / 86400000));
    var hours   = Math.max(0, Math.floor((diff % 86400000) / 3600000));
    var minutes = Math.max(0, Math.floor((diff % 3600000)  / 60000));
    var seconds = Math.max(0, Math.floor((diff % 60000)    / 1000));

    document.getElementById('cd-days').textContent    = days;
    document.getElementById('cd-hours').textContent   = pad(hours);
    document.getElementById('cd-minutes').textContent = pad(minutes);
    document.getElementById('cd-seconds').textContent = pad(seconds);
}

updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);

/* ═══ МУЗЫКА (YouTube iframe) ═══ */
var YT_VIDEO_ID = 'ZoVcKf16Gbk';  // ← ID видео с YouTube

var ytPlayer  = document.getElementById('ytPlayer');
var musicBtn  = document.getElementById('musicBtn');
var iconPlay  = document.getElementById('iconPlay');
var iconPause = document.getElementById('iconPause');
var playing   = false;
var loaded    = false;

function ytCmd(func) {
    ytPlayer.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: func, args: [] }),
        '*'
    );
}

function loadPlayer() {
    if (loaded) return;
    loaded = true;
    ytPlayer.src = 'https://www.youtube.com/embed/' + YT_VIDEO_ID
        + '?autoplay=1&loop=1&playlist=' + YT_VIDEO_ID
        + '&controls=0&enablejsapi=1&origin=' + location.origin;
}

function setPlaying(state) {
    playing = state;
    musicBtn.classList.toggle('off', !state);
    iconPlay.style.display  = state ? 'none' : '';
    iconPause.style.display = state ? '' : 'none';
}

/* ═══ ЗАСТАВКА ═══ */
var intro    = document.getElementById('intro');
var introBtn = document.getElementById('introBtn');

introBtn.addEventListener('click', function () {
    /* Запустить музыку — это явный клик пользователя, браузер разрешит */
    loadPlayer();
    setPlaying(true);

    /* Скрыть заставку */
    intro.classList.add('hide');
    setTimeout(function () { intro.style.display = 'none'; }, 950);
});

/* ═══ КНОПКА МУЗЫКИ (пауза/возобновление) ═══ */
musicBtn.addEventListener('click', function () {
    if (playing) {
        ytCmd('pauseVideo');
        setPlaying(false);
    } else {
        if (!loaded) loadPlayer();
        else ytCmd('playVideo');
        setPlaying(true);
    }
});
