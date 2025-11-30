// Starfield Configuration and Logic
const STARFIELD_CONFIG = {
    COUNT: 170,
    MIN_ACTIVE: 1,
    MAX_ACTIVE: 3,
    MIN_DELAY: 450,
    MAX_DELAY: 1700,
    MIN_DURATION: 1300,
    MAX_DURATION: 2600,
    CONSTELLATION_COUNT: 6  // Star constellations
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

    // Remove any existing starfield to ensure fresh stars on each page load
    const existingStarfield = document.querySelector('.starfield');
    if (existingStarfield) {
        existingStarfield.remove();
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

function initConstellations() {
    if (document.body.dataset.constellationsInit === 'true') {
        return;
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (reduceMotionQuery && reduceMotionQuery.matches) {
        document.body.dataset.constellationsInit = 'skipped';
        return;
    }

    // Remove any existing constellations first to ensure fresh ones on each page load
    const existingConstellations = document.querySelectorAll('.constellation');
    existingConstellations.forEach(c => c.remove());

    const starfield = document.querySelector('.starfield');
    if (!starfield) {
        // If starfield doesn't exist yet, try again after a short delay
        setTimeout(function() {
            if (document.body.dataset.constellationsInit !== 'true') {
                initConstellations();
            }
        }, 100);
        return;
    }

    // Define recognizable constellation patterns based on real star positions
    const constellationPatterns = [
        // Big Dipper / Ursa Major (7 main stars)
        [
            {x: 10, y: 20},  // Dubhe
            {x: 25, y: 15},  // Merak
            {x: 35, y: 10},  // Phecda
            {x: 45, y: 8},   // Megrez
            {x: 55, y: 12},  // Alioth
            {x: 60, y: 18},  // Mizar
            {x: 65, y: 28}   // Alkaid
        ],
        // Orion (the Hunter)
        [
            {x: 40, y: 80},  // Betelgeuse
            {x: 60, y: 85},  // Bellatrix
            {x: 45, y: 90},  // Mintaka
            {x: 50, y: 90},  // Alnilam
            {x: 55, y: 90},  // Alnitak
            {x: 45, y: 95},  // Saiph
            {x: 48, y: 100}  // Rigel
        ],
        // Cassiopeia (W-shape)
        [
            {x: 20, y: 30},  // Gamma Cassiopeiae
            {x: 35, y: 25},  // Schedar
            {x: 50, y: 30},  // Navi
            {x: 65, y: 35},  // Ruchbah
            {x: 80, y: 30}   // Caph
        ],
        // Leo (the Lion)
        [
            {x: 30, y: 40},  // Regulus
            {x: 38, y: 45},  // Algieba
            {x: 50, y: 50},  // Algenubi
            {x: 42, y: 55},  // Zosma
            {x: 35, y: 60}   // Denebola
        ],
        // Cygnus (Northern Cross)
        [
            {x: 60, y: 25},  // Deneb
            {x: 65, y: 35},  // Sadr
            {x: 70, y: 45},  // Gienah
            {x: 55, y: 45},  // Delta Cygni
            {x: 68, y: 55}   // Albireo
        ],
        // Scorpius (the Scorpion)
        [
            {x: 75, y: 75},  // Antares
            {x: 78, y: 78},  // Graffias
            {x: 82, y: 80},  // Dschubba
            {x: 85, y: 82},  // Sargas
            {x: 88, y: 85},  // Shaula
            {x: 87, y: 88}   // Lesath
        ]
    ];

    // Shuffle constellation patterns for variety on each page load
    const shuffledPatterns = [...constellationPatterns].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < STARFIELD_CONFIG.CONSTELLATION_COUNT; i++) {
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        
        // Pick a random pattern and add random offset to position it differently each time
        const pattern = shuffledPatterns[i % shuffledPatterns.length];
        const offsetX = Math.random() * 20 - 10; // Random offset between -10% and +10%
        const offsetY = Math.random() * 20 - 10; // Random offset between -10% and +10%
        
        let starsHTML = '';
        for (let j = 0; j < pattern.length; j++) {
            // Apply random offset to each star position
            const x = Math.max(0, Math.min(100, pattern[j].x + offsetX));
            const y = Math.max(0, Math.min(100, pattern[j].y + offsetY));
            const starSize = '4'; // Bright white stars for testing - 4px
            
            starsHTML += `<span class="constellation-star" style="left: ${x}%; top: ${y}%; width: ${starSize}px; height: ${starSize}px;"></span>`;
        }
        
        constellation.innerHTML = starsHTML;
        
        starfield.appendChild(constellation);
    }

    document.body.dataset.constellationsInit = 'true';

    function handleReduceMotionChangeConstellations(event) {
        if (event.matches) {
            document.querySelectorAll('.constellation').forEach(c => c.remove());
            document.body.dataset.constellationsInit = 'skipped';
        } else if (document.body.dataset.constellationsInit === 'skipped') {
            document.body.dataset.constellationsInit = 'false';
            initConstellations();
        }
    }

    if (reduceMotionQuery) {
        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChangeConstellations);
        } else if (reduceMotionQuery.addListener) {
            reduceMotionQuery.addListener(handleReduceMotionChangeConstellations);
        }
    }
}
