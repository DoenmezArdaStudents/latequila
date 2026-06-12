/* ============================================
   LA TEQUILA — RESTAURANT MEXICANO
   Main JavaScript
   ============================================ */

/* ---------- NAVIGATION ---------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

/* ---------- INTERNAL LINK NORMALIZATION ---------- */
const currentPath = window.location.pathname;
const basePath = currentPath.endsWith('/')
    ? currentPath
    : currentPath.endsWith('.html')
        ? currentPath.substring(0, currentPath.lastIndexOf('/') + 1)
        : `${currentPath}/`;

document.querySelectorAll('a[href]').forEach(link => {
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;

    const isExternal = /^(https?:\/\/|mailto:|tel:|javascript:|#)/i.test(rawHref);
    if (isExternal || rawHref.startsWith('/')) return;

    const [pathPart, hashPart] = rawHref.split('#');
    const normalizedPath = `${basePath}${pathPart.replace(/^\.\//, '')}`.replace(/\/{2,}/g, '/');
    link.setAttribute('href', hashPart ? `${normalizedPath}#${hashPart}` : normalizedPath);
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ---------- HERO ANIMATION ---------- */
const hero = document.querySelector('.hero');
if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
}

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- TESTIMONIALS SLIDER ---------- */
const cards  = document.querySelectorAll('.testimonial-card');
const dots   = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let current  = 0;
let autoTimer;

function showSlide(index) {
    cards.forEach((c, i) => c.classList.toggle('active', i === index));
    dots.forEach((d, i)  => d.classList.toggle('active', i === index));
    current = index;
}

function nextSlide() { showSlide((current + 1) % cards.length); }
function prevSlide() { showSlide((current - 1 + cards.length) % cards.length); }

function startAuto() {
    autoTimer = setInterval(nextSlide, 5000);
}

function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}

if (cards.length) {
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAuto(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { showSlide(i); resetAuto(); });
    });

    startAuto();
}

/* ---------- GALLERY LIGHTBOX ---------- */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = lightbox?.querySelector('.lightbox-img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxOverlay = lightbox?.querySelector('.lightbox-overlay');

function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src);
    });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxOverlay?.addEventListener('click', closeLightbox);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

/* ---------- MENU TABS ---------- */
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCategories = document.querySelectorAll('.menu-category');

menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        menuTabs.forEach(t => t.classList.remove('active'));
        menuCategories.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetCat = document.getElementById(target);
        if (targetCat) targetCat.classList.add('active');
    });
});

/* ---------- RESERVATION FORM ---------- */
const resForm = document.getElementById('reservationForm');

if (resForm) {
    const dateInput = resForm.querySelector('#date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = resForm.querySelector('button[type="submit"]');
        const original = btn.textContent;

        btn.textContent = 'Anfrage gesendet ✓';
        btn.disabled = true;
        btn.style.background = '#2d7a20';

        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
            btn.style.background = '';
            resForm.reset();
        }, 4000);
    });
}

/* ---------- SMOOTH SCROLL for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ---------- ACTIVE NAV LINK ON SCROLL ---------- */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));
