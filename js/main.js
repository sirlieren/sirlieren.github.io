/* main.js — Eren Sırlı Portfolio */

(function () {
    'use strict';
    const motionReduced = () => !document.documentElement.classList.contains('motion-ready');

    /* ── Navbar scroll effect ─────────────────────── */
    const navbar = document.getElementById('navbar');

    const onScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Active nav link ──────────────────────────── */
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(navLinks)
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    const setActive = () => {
        const y = window.scrollY + window.innerHeight * 0.35;
        let active = null;
        sections.forEach(s => {
            if (s.offsetTop <= y) active = s.id;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + active);
        });
    };

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

    /* ── Smooth, interruptible scroll for section links ── */
    let scrollFrame = 0;
    const cancelScroll = () => {
        if (!scrollFrame) return;
        cancelAnimationFrame(scrollFrame);
        scrollFrame = 0;
    };
    ['wheel', 'touchstart', 'pointerdown'].forEach(type => {
        window.addEventListener(type, cancelScroll, { passive: true });
    });
    window.addEventListener('keydown', event => {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) cancelScroll();
    });

    const scrollToSection = target => {
        cancelScroll();
        const start = window.scrollY;
        const destination = start + target.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '0');
        const distance = destination - start;
        if (motionReduced() || Math.abs(distance) < 1) {
            window.scrollTo(0, destination);
            return;
        }
        const duration = Math.min(1050, Math.max(420, Math.abs(distance) * 0.58));
        const startTime = performance.now();
        const tick = now => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            window.scrollTo(0, start + distance * eased);
            if (progress < 1) scrollFrame = requestAnimationFrame(tick);
            else scrollFrame = 0;
        };
        scrollFrame = requestAnimationFrame(tick);
    };

    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            history.pushState(null, '', a.getAttribute('href'));
            scrollToSection(target);

            // Close mobile menu if open
            const mm = document.getElementById('mobileMenu');
            const burger = document.querySelector('.burger');
            if (mm && burger && mm.classList.contains('open')) {
                mm.classList.remove('open');
                burger.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    /* ── Mobile burger ────────────────────────────── */
    const burger = document.querySelector('.burger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('open');
            burger.classList.toggle('open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
        });
    }

    /* ── Reveal on scroll ─────────────────────────── */
    // Shared reveals are handled by motion.js.

    /* ── Animated number counter ─────────────────── */
    const counters = document.querySelectorAll('[data-count]');

    const countObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = motionReduced() ? 0 : 900;
                const startTime = performance.now();

                const tick = (now) => {
                    const elapsed = now - startTime;
                    const progress = motionReduced() || duration === 0 ? 1 : Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
                countObserver.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => countObserver.observe(el));

})();

