'use strict';

// ==========================================================================
// THEME AND REDUCED-MOTION PREFERENCES
// ==========================================================================
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const theme = document.querySelector('#theme');
try {
    if (localStorage.getItem('upadesh-theme') === 'light') root.dataset.theme = 'light';
} catch {}

function themeLabel() {
    theme.setAttribute('aria-label', root.dataset.theme === 'light' ? 'Switch to dark theme' :
        'Switch to light theme');
}
themeLabel();
theme.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    themeLabel();
    try {
        localStorage.setItem('upadesh-theme', root.dataset.theme);
    } catch {}
});

// ==========================================================================
// MOBILE NAVIGATION
// ==========================================================================
const menu = document.querySelector('#menu'),
    navigation = document.querySelector('#navigation');

function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeMenu();
        if (document.activeElement.closest('.nav-links')) menu.focus();
    }
});
matchMedia('(min-width:761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

// ==========================================================================
// SCROLL PROGRESS AND ACTIVE NAVIGATION
// ==========================================================================
const progress = document.querySelector('#progress');
const sections = [...document.querySelectorAll('header[id],section[id],#documents')];
let scrollQueued = false;

function scrollUpdate() {
    const limit = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (limit ? scrollY / limit * 100 : 0) + '%';
    let active = 'home';
    sections.forEach(s => {
        if (s.getBoundingClientRect().top < innerHeight * .4) active = s.id;
    });
    navigation.querySelectorAll('a').forEach(a => {
        const selected = a.hash === '#' + active;
        a.classList.toggle('active', selected);
        if (selected) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
    });
    scrollQueued = false;
}
addEventListener('scroll', () => {
    if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(scrollUpdate);
    }
}, {
    passive: true
});
scrollUpdate();

// ==========================================================================
// SECTION REVEAL EFFECTS
// ==========================================================================
if (!reduced.matches && 'IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            reveal.unobserve(e.target);
        }
    }), {
        threshold: .08
    });
    document.querySelectorAll('.research-card,.milestones,.software,.thesis,.section-title')
        .forEach(el => {
            el.classList.add('reveal-ready');
            reveal.observe(el);
        });
}

// ==========================================================================
// INTERACTIVE POINTER
// ==========================================================================
const cursor = document.querySelector('#cursor');
if (matchMedia('(pointer:fine)').matches && !reduced.matches) {
    document.addEventListener('pointermove', e => {
        cursor.style.display = 'block';
        cursor.style.transform =
            `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
        cursor.classList.toggle('over', !!e.target.closest('a,button,summary'));
    });
    document.addEventListener('pointerleave', () => cursor.style.display = 'none');
}

// ==========================================================================
// ILLUSTRATIVE FIELD ANIMATION
// ==========================================================================
// A deliberately illustrative analytical scalar field, not research output.
const canvas = document.querySelector('#field'),
    ctx = canvas.getContext('2d');
const motion = document.querySelector('#motion');
let paused = reduced.matches,
    visible = true,
    frame = 0,
    last = 0,
    time = 0,
    px = .5,
    py = .5,
    targetX = .5,
    targetY = .5;
const W = 320,
    H = 286;
canvas.width = W;
canvas.height = H;
const pixels = ctx.createImageData(W, H);
const seeds = Array.from({
    length: 25
}, (_, i) => ({
    x: ((Math.sin(i * 127.1 + 1) * 43758.5453) % 1 + 1) % 1,
    y: ((Math.sin(i * 311.7 + 2) * 23758.5453) % 1 + 1) % 1
}));
const nearest = new Float32Array(W * H),
    boundary = new Float32Array(W * H);
for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
        let a = 9,
            b = 9;
        for (const seed of seeds) {
            const d = Math.hypot(x / W - seed.x, y / H - seed.y);
            if (d < a) {
                b = a;
                a = d;
            } else if (d < b) b = d;
        }
        nearest[y * W + x] = a;
        boundary[y * W + x] = b - a;
    }

function draw() {
    px += (targetX - px) * .13;
    py += (targetY - py) * .13;
    for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
            const n = y * W + x,
                nx = x / W,
                ny = y / H;
            const d = nearest[n],
                edge = boundary[n];
            const wave = Math.sin(nx * 14 + ny * 8 + Math.sin(ny * 12 - nx * 5) * 1.6 + time * .36);
            const contours = Math.pow(.5 + .5 * Math.cos(d * 135 + wave * 2.7 - time * .6), 16);
            const grain = Math.exp(-edge * 170);
            const focus = Math.exp(-((nx - px) ** 2 + (ny - py) ** 2) * 8);
            const envelope = Math.max(.08, 1 - Math.hypot(nx - .48, ny - .5) * 1.05);
            const v = (contours * .55 + grain * .9) * envelope;
            const glow = focus * .16;
            const k = n * 4;
            pixels.data[k] = 12 + v * 100 + glow * 32;
            pixels.data[k + 1] = 24 + v * 162 + glow * 75;
            pixels.data[k + 2] = 29 + v * 142 + glow * 67;
            pixels.data[k + 3] = 255;
        }
    ctx.putImageData(pixels, 0, 0);
    ctx.strokeStyle = 'rgba(158,233,210,.10)';
    ctx.lineWidth = .5;
    for (let i = 0; i < W; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
    }
    for (let i = 0; i < H; i += 32) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
        ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(198,255,233,.6)';
    ctx.beginPath();
    ctx.arc(px * W, py * H, 9, 0, Math.PI * 2);
    ctx.moveTo(px * W - 15, py * H);
    ctx.lineTo(px * W + 15, py * H);
    ctx.moveTo(px * W, py * H - 15);
    ctx.lineTo(px * W, py * H + 15);
    ctx.stroke();
}

function animate(now) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (now - last > 45) {
        time += .045;
        draw();
        last = now;
    }
    frame = requestAnimationFrame(animate);
}

function start() {
    if (!frame && !paused && visible && !document.hidden) frame = requestAnimationFrame(animate);
}

function updateMotion() {
    motion.textContent = paused ? 'Play ▷' : 'Pause Ⅱ';
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', paused ? 'Play field animation' : 'Pause field animation');
}
motion.addEventListener('click', () => {
    paused = !paused;
    updateMotion();
    start();
});
canvas.addEventListener('pointermove', e => {
    const b = canvas.getBoundingClientRect();
    targetX = (e.clientX - b.left) / b.width;
    targetY = (e.clientY - b.top) / b.height;
    if (paused && !reduced.matches) draw();
});
canvas.addEventListener('pointerleave', () => {
    targetX = .5;
    targetY = .5;
});
new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    start();
}).observe(canvas);
document.addEventListener('visibilitychange', start);
reduced.addEventListener('change', () => {
    paused = reduced.matches;
    updateMotion();
    cursor.style.display = 'none';
    start();
});
updateMotion();
draw();
start();


// PROFILE PHOTO: preserve the layout if assets/profile.jpg is not yet uploaded.
const profilePhoto = document.querySelector('.profile-photo');

function showProfileFallback() {
    if (!profilePhoto || !profilePhoto.isConnected) return;
    const initials = document.createElement('span');
    initials.className = 'profile-initials';
    initials.textContent = 'US';
    initials.setAttribute('role', 'img');
    initials.setAttribute('aria-label', 'Upadesh Subedi');
    profilePhoto.replaceWith(initials);
}
if (profilePhoto) {
    profilePhoto.addEventListener('error', showProfileFallback, {
        once: true
    });
    if (profilePhoto.complete && profilePhoto.naturalWidth === 0) showProfileFallback();
}
