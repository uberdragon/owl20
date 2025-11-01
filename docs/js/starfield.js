// Starfield Configuration and Logic
const STARFIELD_CONFIG = {
    COUNT: 170,
    MIN_ACTIVE: 1,
    MAX_ACTIVE: 3,
    MIN_DELAY: 450,
    MAX_DELAY: 1700,
    MIN_DURATION: 1300,
    MAX_DURATION: 2600,
    NEBULA_COUNT: 3,  // Beautiful cosmic nebulae
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

function initNebulae() {
    if (document.body.dataset.nebulaeInit === 'true') {
        return;
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (reduceMotionQuery && reduceMotionQuery.matches) {
        document.body.dataset.nebulaeInit = 'skipped';
        return;
    }

    const starfield = document.querySelector('.starfield');
    if (!starfield) {
        return;
    }

    // Define nebula color schemes based on real nebulae
    const nebulaPalettes = [
        // Purple-blue nebula
        [
            'rgba(180, 120, 220, 0.4)',
            'rgba(120, 140, 220, 0.3)',
            'rgba(80, 100, 180, 0.2)'
        ],
        // Blue-pink nebula
        [
            'rgba(200, 180, 255, 0.4)',
            'rgba(255, 160, 200, 0.3)',
            'rgba(180, 140, 255, 0.2)'
        ],
        // Red-orange nebula
        [
            'rgba(255, 180, 150, 0.4)',
            'rgba(255, 140, 100, 0.3)',
            'rgba(255, 100, 80, 0.2)'
        ]
    ];

    for (let i = 0; i < STARFIELD_CONFIG.NEBULA_COUNT; i++) {
        const nebula = document.createElement('div');
        nebula.className = 'nebula';
        
        const width = (Math.random() * 250 + 300).toFixed(0); // 300-550px wide
        const height = (Math.random() * 250 + 300).toFixed(0); // 300-550px tall
        const left = (Math.random() * 100).toFixed(2) + '%';
        const top = (Math.random() * 100).toFixed(2) + '%';
        const rotation = (Math.random() * 360).toFixed(0);
        const palette = nebulaPalettes[i % nebulaPalettes.length];
        const blur = (Math.random() * 30 + 40).toFixed(0); // 40-70px blur for soft look
        
        nebula.style.left = left;
        nebula.style.top = top;
        nebula.style.width = width + 'px';
        nebula.style.height = height + 'px';
        nebula.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        nebula.style.filter = `blur(${blur}px)`;
        nebula.style.opacity = '0.6';
        
        // Create multi-layered gradient for depth
        nebula.style.background = `
            radial-gradient(ellipse 80% 100% at 20% 50%, ${palette[0]} 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 80% 50%, ${palette[1]} 0%, transparent 70%),
            radial-gradient(ellipse 60% 100% at 50% 50%, ${palette[2]} 0%, transparent 80%)
        `;
        
        starfield.appendChild(nebula);
    }

    document.body.dataset.nebulaeInit = 'true';

    function handleReduceMotionChangeNebulae(event) {
        if (event.matches) {
            document.querySelectorAll('.nebula').forEach(n => n.remove());
            document.body.dataset.nebulaeInit = 'skipped';
        } else if (document.body.dataset.nebulaeInit === 'skipped') {
            document.body.dataset.nebulaeInit = 'false';
            initNebulae();
        }
    }

    if (reduceMotionQuery) {
        if (reduceMotionQuery.addEventListener) {
            reduceMotionQuery.addEventListener('change', handleReduceMotionChangeNebulae);
        } else if (reduceMotionQuery.addListener) {
            reduceMotionQuery.addListener(handleReduceMotionChangeNebulae);
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
