/* main.js — Eren Sırlı Portfolio */

(function () {
    'use strict';

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

    /* ── Smooth scroll for all anchor links ──────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });

            // Close mobile menu if open
            const mm = document.getElementById('mobileMenu');
            const burger = document.querySelector('.burger');
            if (mm.classList.contains('open')) {
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
    const revealEls = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Animated number counter ─────────────────── */
    const counters = document.querySelectorAll('[data-count]');

    const countObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                const duration = 1200;
                const startTime = performance.now();

                const tick = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
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

