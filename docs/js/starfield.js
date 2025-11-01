// Starfield Configuration and Logic
const STARFIELD_CONFIG = {
    COUNT: 170,
    MIN_ACTIVE: 1,
    MAX_ACTIVE: 3,
    MIN_DELAY: 450,
    MAX_DELAY: 1700,
    MIN_DURATION: 1300,
    MAX_DURATION: 2600,
    PLANET_COUNT: 3,  // Add a few distant planets
    GALAXY_COUNT: 2,  // Distant galaxies
    CONSTELLATION_COUNT: 4  // Star constellations
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

function initPlanets() {
    if (document.body.dataset.planetsInit === 'true') {
        return;
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (reduceMotionQuery && reduceMotionQuery.matches) {
        document.body.dataset.planetsInit = 'skipped';
        return;
    }

    const starfield = document.querySelector('.starfield');
    if (!starfield) {
        return;
    }

    const planetColors = [
        'rgba(180, 160, 220, 0.15)',  // Purple planet
        'rgba(160, 200, 255, 0.12)',  // Blue planet  
        'rgba(255, 200, 160, 0.15)'   // Orange planet
    ];

    for (let i = 0; i < STARFIELD_CONFIG.PLANET_COUNT; i++) {
        const planet = document.createElement('div');
        planet.className = 'planet';
        const size = (Math.random() * 80 + 40).toFixed(0); // 40-120px planets
        const left = (Math.random() * 100).toFixed(2) + '%';
        const top = (Math.random() * 100).toFixed(2) + '%';
        const color = planetColors[i % planetColors.length];
        const blur = (Math.random() * 20 + 30).toFixed(0); // 30-50px blur
        const driftDuration = (Math.random() * 80 + 160).toFixed(0); // 160-240s drift
        
        planet.style.left = left;
        planet.style.top = top;
        planet.style.width = size + 'px';
        planet.style.height = size + 'px';
        planet.style.backgroundColor = color;
        planet.style.filter = `blur(${blur}px)`;
        planet.style.setProperty('--planet-drift-duration', driftDuration + 's');
        
        starfield.appendChild(planet);
    }

    document.body.dataset.planetsInit = 'true';

    function handleReduceMotionChangePlanets(event) {
        if (event.matches) {
            document.querySelectorAll('.planet').forEach(p => p.remove());
            document.body.dataset.planetsInit = 'skipped';
        } else if (document.body.dataset.planetsInit === 'skipped') {
            document.body.dataset.planetsInit = 'false';
            initPlanets();
        }
    }

    if (reduceMotionQuery) {
        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChangePlanets);
        } else if (reduceMotionQuery.addListener) {
            reduceMotionQuery.addListener(handleReduceMotionChangePlanets);
        }
    }
}

function initGalaxies() {
    if (document.body.dataset.galaxiesInit === 'true') {
        return;
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (reduceMotionQuery && reduceMotionQuery.matches) {
        document.body.dataset.galaxiesInit = 'skipped';
        return;
    }

    const starfield = document.querySelector('.starfield');
    if (!starfield) {
        return;
    }

    for (let i = 0; i < STARFIELD_CONFIG.GALAXY_COUNT; i++) {
        const galaxy = document.createElement('div');
        galaxy.className = 'galaxy';
        
        const size = (Math.random() * 150 + 200).toFixed(0); // 200-350px galaxies
        const left = (Math.random() * 100).toFixed(2) + '%';
        const top = (Math.random() * 100).toFixed(2) + '%';
        const rotation = (Math.random() * 360).toFixed(0); // Random rotation
        const blur = (Math.random() * 20 + 25).toFixed(0); // 25-45px blur for visible galaxies
        
        galaxy.style.left = left;
        galaxy.style.top = top;
        galaxy.style.width = size + 'px';
        galaxy.style.height = size + 'px';
        galaxy.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        galaxy.style.filter = `blur(${blur}px)`;
        galaxy.style.opacity = '0.15';
        
        starfield.appendChild(galaxy);
    }

    document.body.dataset.galaxiesInit = 'true';

    function handleReduceMotionChangeGalaxies(event) {
        if (event.matches) {
            document.querySelectorAll('.galaxy').forEach(g => g.remove());
            document.body.dataset.galaxiesInit = 'skipped';
        } else if (document.body.dataset.galaxiesInit === 'skipped') {
            document.body.dataset.galaxiesInit = 'false';
            initGalaxies();
        }
    }

    if (reduceMotionQuery) {
        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChangeGalaxies);
        } else if (reduceMotionQuery.addListener) {
            reduceMotionQuery.addListener(handleReduceMotionChangeGalaxies);
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

    const starfield = document.querySelector('.starfield');
    if (!starfield) {
        return;
    }

    // Define recognizable constellation patterns
    const constellationPatterns = [
        // Big Dipper / Ursa Major
        [
            {x: 0, y: 0}, {x: 15, y: 5}, {x: 30, y: 8}, {x: 45, y: 12},
            {x: 30, y: 25}, {x: 50, y: 30}, {x: 65, y: 35}
        ],
        // Orion's Belt
        [
            {x: 0, y: 0}, {x: 40, y: 0}, {x: 80, y: 0},
            {x: 20, y: -30}, {x: 60, y: -30}
        ],
        // Cassiopeia (W-shape)
        [
            {x: 0, y: 0}, {x: 25, y: 20}, {x: 50, y: 0},
            {x: 75, y: 20}, {x: 100, y: 0}
        ],
        // Leo (sickle shape)
        [
            {x: 0, y: 0}, {x: 25, y: 15}, {x: 50, y: 20},
            {x: 65, y: 35}, {x: 80, y: 50}
        ]
    ];

    for (let i = 0; i < STARFIELD_CONFIG.CONSTELLATION_COUNT; i++) {
        const constellation = document.createElement('div');
        constellation.className = 'constellation';
        
        const centerX = Math.random() * 70 + 15; // Keep away from edges
        const centerY = Math.random() * 60 + 20;
        const pattern = constellationPatterns[i % constellationPatterns.length];
        const constellationOpacity = '0.6'; // More visible
        
        let starsHTML = '';
        for (let j = 0; j < pattern.length; j++) {
            const x = centerX + pattern[j].x * 0.3; // Scale down the pattern
            const y = centerY + pattern[j].y * 0.3;
            const starSize = (Math.random() * 0.5 + 2).toFixed(2); // 2-2.5px stars
            
            starsHTML += `<span class="constellation-star" style="left: ${x}%; top: ${y}%; width: ${starSize}px; height: ${starSize}px;"></span>`;
        }
        
        constellation.innerHTML = starsHTML;
        constellation.style.opacity = constellationOpacity;
        
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
