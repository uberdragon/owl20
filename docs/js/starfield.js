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
        // Use Math.random() for true randomization on each page load
        const size = (Math.random() * 1.6 + 0.6).toFixed(2);
        const opacity = (Math.random() * 0.3 + 0.15).toFixed(2);
        const twinkleScale = (Math.random() * 1 + 2.4).toFixed(2);
        // Random positions across the entire viewport
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
        // Track retry attempts to prevent infinite loops
        const retryCount = (initConstellations.retryCount || 0) + 1;
        const MAX_RETRIES = 10;
        
        if (retryCount < MAX_RETRIES && document.body.dataset.constellationsInit !== 'true') {
            initConstellations.retryCount = retryCount;
            setTimeout(function() {
                initConstellations();
            }, 100);
        } else {
            // Reset retry count if we've exceeded max retries or already initialized
            initConstellations.retryCount = 0;
        }
        return;
    }
    
    // Reset retry count on successful initialization
    initConstellations.retryCount = 0;

    // Constellation patterns with accurate star positions as seen from Earth.
    // Coordinates are viewport percentages. Sky orientation: north=up, east=left
    // (as seen facing south in the northern hemisphere).
    const constellationPatterns = [
        // Ursa Major — Big Dipper (7 stars)
        // Bowl (rectangle, right side) + handle arcing left and slightly down
        [
            {x: 52, y: 12},  // Dubhe (α)   — top-right of bowl, pointer star
            {x: 55, y: 22},  // Merak (β)   — bottom-right of bowl, pointer star
            {x: 40, y: 26},  // Phecda (γ)  — bottom-left of bowl
            {x: 38, y: 16},  // Megrez (δ)  — top-left of bowl / handle junction (dim)
            {x: 25, y: 14},  // Alioth (ε)  — handle, brightest of the three
            {x: 14, y: 12},  // Mizar (ζ)   — handle middle (has Alcor companion)
            {x: 5,  y: 20}   // Alkaid (η)  — handle tip, arcs slightly downward
        ],
        // Orion — the Hunter (7 stars)
        // Shoulders top, belt horizontal across middle, feet wide apart bottom.
        // East=left in sky: Betelgeuse/Saiph are left; Bellatrix/Rigel are right.
        [
            {x: 35, y: 55},  // Betelgeuse (α) — upper-left shoulder (bright red)
            {x: 62, y: 58},  // Bellatrix  (γ) — upper-right shoulder
            {x: 40, y: 70},  // Alnitak    (ζ) — belt left  (easternmost)
            {x: 49, y: 72},  // Alnilam    (ε) — belt center
            {x: 58, y: 70},  // Mintaka    (δ) — belt right (westernmost)
            {x: 38, y: 88},  // Saiph      (κ) — lower-left foot
            {x: 65, y: 85}   // Rigel      (β) — lower-right foot (brightest in Orion)
        ],
        // Cassiopeia — the Queen (5 stars)
        // Unmistakable W shape: high-low-high-low-high in y (screen coords)
        [
            {x: 66, y: 18},  // Caph   (β) — left end of W,  high
            {x: 72, y: 34},  // Schedar(α) — first dip,      low
            {x: 78, y: 15},  // Gamma  (γ) — center peak,    high (brightest)
            {x: 84, y: 30},  // Ruchbah(δ) — second dip,     low
            {x: 90, y: 14}   // Segin  (ε) — right end of W, high
        ],
        // Leo — the Lion (7 stars)
        // Sickle (backward question-mark) on the right; Denebola tail far left.
        // The sickle curves: Regulus at base → up through Eta → Algieba → top.
        [
            {x: 38, y: 58},  // Regulus  (α) — base/heart of sickle, brightest
            {x: 33, y: 48},  // Eta Leo  (η) — lower sickle
            {x: 26, y: 40},  // Algieba  (γ) — mid-sickle curve
            {x: 22, y: 32},  // Adhafera (ζ) — upper sickle
            {x: 16, y: 28},  // Algenubi (ε) — top of sickle
            {x: 25, y: 55},  // Zosma    (δ) — hindquarters
            {x: 10, y: 62}   // Denebola (β) — tail, far east (left)
        ],
        // Cygnus — Northern Cross (5 stars)
        // Deneb at top, Sadr at center, horizontal arms at same y, Albireo below.
        [
            {x: 55, y: 18},  // Deneb        (α) — top of cross / swan's tail
            {x: 42, y: 38},  // Delta Cygni  (δ) — left arm of cross
            {x: 55, y: 38},  // Sadr         (γ) — center intersection
            {x: 68, y: 38},  // Gienah       (ε) — right arm of cross
            {x: 55, y: 60}   // Albireo      (β) — bottom of cross / swan's head
        ],
        // Scorpius — the Scorpion (7 stars)
        // Head stars ABOVE Antares; tail curves right then hooks back left.
        [
            {x: 70, y: 56},  // Graffias (β) — head, right claws
            {x: 78, y: 53},  // Dschubba (δ) — head, left (north of Antares)
            {x: 74, y: 66},  // Antares  (α) — bright heart/center
            {x: 77, y: 74},  // Tau Sco  (τ) — upper body
            {x: 80, y: 81},  // Sargas   (θ) — lower body
            {x: 85, y: 87},  // Shaula   (λ) — stinger (pair)
            {x: 88, y: 91}   // Lesath   (υ) — stinger tip
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
