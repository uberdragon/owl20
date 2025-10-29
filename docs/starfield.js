// Starfield Configuration and Logic
const STARFIELD_CONFIG = {
    COUNT: 170,
    MIN_ACTIVE: 1,
    MAX_ACTIVE: 3,
    MIN_DELAY: 450,
    MAX_DELAY: 1700,
    MIN_DURATION: 1300,
    MAX_DURATION: 2600
};

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function initStarfield() {
    if (document.body.dataset.starfieldInit === 'true') {
        return;
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (reduceMotionQuery && reduceMotionQuery.matches) {
        document.body.dataset.starfieldInit = 'skipped';
        return;
    }

    const starfield = document.createElement('div');
    starfield.className = 'starfield';

    const stars = [];
    for (let i = 0; i < STARFIELD_CONFIG.COUNT; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        const size = (Math.random() * 1.6 + 0.6).toFixed(2);
        const opacity = (Math.random() * 0.3 + 0.15).toFixed(2);
        const twinkleScale = (Math.random() * 1 + 2.4).toFixed(2);
        star.style.left = (Math.random() * 100).toFixed(3) + '%';
        star.style.top = (Math.random() * 100).toFixed(3) + '%';
        star.style.setProperty('--size', size + 'px');
        star.style.setProperty('--opacity', opacity);
        star.style.setProperty('--twinkle-scale', twinkleScale);
        starfield.appendChild(star);
        stars.push(star);
    }

    if (stars.length === 0) {
        return;
    }

    document.body.appendChild(starfield);
    document.body.dataset.starfieldInit = 'true';

    const activeStars = new Set();
    let twinkleTimeoutId = null;

    function pickAvailableStar() {
        if (activeStars.size === stars.length) {
            return null;
        }
        let candidate = null;
        let attempts = 0;
        while (!candidate && attempts < 8) {
            const potential = stars[Math.floor(Math.random() * stars.length)];
            if (!activeStars.has(potential)) {
                candidate = potential;
            }
            attempts++;
        }
        if (!candidate) {
            candidate = stars.find(star => !activeStars.has(star)) || null;
        }
        return candidate;
    }

    function activateStar() {
        const star = pickAvailableStar();
        if (!star) {
            return false;
        }
        activeStars.add(star);
        star.classList.add('star--twinkle');
        const duration = randomBetween(STARFIELD_CONFIG.MIN_DURATION, STARFIELD_CONFIG.MAX_DURATION);
        setTimeout(function() {
            star.classList.remove('star--twinkle');
            activeStars.delete(star);
            ensureMinimumTwinkles();
        }, duration);
        return true;
    }

    function ensureMinimumTwinkles() {
        while (activeStars.size < STARFIELD_CONFIG.MIN_ACTIVE) {
            if (!activateStar()) {
                break;
            }
        }
    }

    function triggerTwinkle() {
        if (activeStars.size < STARFIELD_CONFIG.MAX_ACTIVE) {
            activateStar();
        }
        scheduleNextTwinkle();
    }

    function scheduleNextTwinkle() {
        const needsImmediate = activeStars.size < STARFIELD_CONFIG.MIN_ACTIVE;
        const delay = needsImmediate ? 120 : randomBetween(STARFIELD_CONFIG.MIN_DELAY, STARFIELD_CONFIG.MAX_DELAY);
        twinkleTimeoutId = setTimeout(triggerTwinkle, delay);
    }

    ensureMinimumTwinkles();
    scheduleNextTwinkle();

    function handleReduceMotionChange(event) {
        if (event.matches) {
            if (twinkleTimeoutId) {
                clearTimeout(twinkleTimeoutId);
                twinkleTimeoutId = null;
            }
            activeStars.forEach(function(star) {
                star.classList.remove('star--twinkle');
            });
            activeStars.clear();
            starfield.remove();
            document.body.dataset.starfieldInit = 'skipped';
        } else if (!twinkleTimeoutId) {
            document.body.dataset.starfieldInit = 'false';
            initStarfield();
        }
    }

    if (reduceMotionQuery) {
        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChange);
        } else if (reduceMotionQuery.addListener) {
            reduceMotionQuery.addListener(handleReduceMotionChange);
        }
    }
}
