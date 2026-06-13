// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if(savedTheme){ root.setAttribute('data-theme', savedTheme); }
else if(window.matchMedia('(prefers-color-scheme: light)').matches){ root.setAttribute('data-theme','light'); }

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  if(next === 'dark'){ root.removeAttribute('data-theme'); } else { root.setAttribute('data-theme','light'); }
  localStorage.setItem('theme', next);
});

// Navbar scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Tab switching
const allPanels = document.querySelectorAll('.tab-panel');
const navTabLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function switchTab(hash) {
  const target = document.querySelector(hash);
  if (!target || !target.classList.contains('tab-panel')) return;

  allPanels.forEach(p => p.classList.remove('active'));
  target.classList.add('active');

  // Reveal all scroll-reveal elements in this panel immediately
  target.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

  navTabLinks.forEach(a => a.classList.remove('tab-active'));
  const activeLink = document.querySelector(`.nav-links a[href="${hash}"]`);
  if (activeLink) activeLink.classList.add('tab-active');

  window.scrollTo(0, 0);
  history.pushState(null, null, hash);
}

navTabLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchTab(link.getAttribute('href'));
    navLinks.classList.remove('open');
  });
});

// Internal anchor links outside the nav (hero buttons, etc.)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (link.closest('.nav-links')) return;
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target && target.classList.contains('tab-panel')) {
      e.preventDefault();
      switchTab(href);
    }
  });
});

// Browser back/forward navigation
window.addEventListener('popstate', () => {
  switchTab(location.hash || '#home');
});

// Initial tab from URL hash
switchTab(location.hash || '#home');

// Particle background
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function getAccentColor(){
  const theme = root.getAttribute('data-theme');
  return theme === 'light' ? '47,127,214' : '94,184,255';
}

class Particle{
  constructor(){ this.reset(); }
  reset(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random()-0.5)*0.3;
    this.vy = (Math.random()-0.5)*0.3;
    this.r = Math.random()*1.8 + 0.5;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${getAccentColor()}, 0.5)`;
    ctx.fill();
  }
}

const PARTICLE_COUNT = Math.min(70, Math.floor(window.innerWidth/20));
for(let i=0;i<PARTICLE_COUNT;i++) particles.push(new Particle());

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < 120){
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${getAccentColor()}, ${0.12 * (1-dist/120)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}
animate();
