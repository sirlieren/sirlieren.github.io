/* Progressive enhancement: no scroll hijacking or delayed navigation. */
(() => {
    'use strict';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    let preference = null;
    try {
        const saved = localStorage.getItem('eren-motion');
        if (saved === 'on' || saved === 'off') preference = saved;
    } catch (_) { /* Storage is optional. */ }
    const enabled = () => preference ? preference === 'on' : !reduced.matches;
    const control = document.createElement('button');
    control.className = 'motion-control';
    control.type = 'button';
    document.body.append(control);
    const syncMotion = () => {
        const active = enabled();
        root.classList.toggle('motion-ready', active);
        root.classList.toggle('motion-off', !active);
        root.classList.toggle('motion-override', preference === 'on');
        control.textContent = active ? 'Motion on' : 'Enable motion';
        control.setAttribute('aria-pressed', String(active));
        control.setAttribute('aria-label', active ? 'Disable animations' : 'Enable animations');
    };
    syncMotion();

    const sections = document.querySelectorAll('.case-section');
    sections.forEach(section => section.setAttribute('data-reveal', ''));
    const revealElements = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(({isIntersecting, target}) => {
                if (isIntersecting) { target.classList.add('visible'); observer.unobserve(target); }
            });
        }, {threshold: .08, rootMargin: '0px 0px -24px 0px'});
        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('visible'));
    }

    const introElements = document.querySelectorAll('.hero-eyebrow, .hero-name, .hero-sub, .hero-actions, .hero-proof, .case-eyebrow, .case-title, .case-lede, .case-facts, .case-actions, .case-hero-media');
    const introAnimations = [];
    const playIntro = () => {
        introAnimations.forEach(animation => animation.cancel());
        introAnimations.length = 0;
        if (!enabled() || !Element.prototype.animate) return;
        introElements.forEach((el, index) => {
            const animation = el.animate([
                {opacity: 0, transform: 'translateY(12px)'},
                {opacity: 1, transform: 'translateY(0)'}
            ], {duration: 650, delay: Math.min(index,5) * 65, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both'});
            introAnimations.push(animation);
            animation.onfinish = () => animation.cancel();
        });
    };
    playIntro();

    const ring = document.createElement('div');
    ring.className = 'pointer-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(ring);
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, positioned = false;
    let lastTime = 0;
    const cursorEnabled = () => fine.matches && enabled();
    const step = now => {
        frame = 0;
        const delta = Math.min(now - lastTime || 16, 40);
        lastTime = now;
        const ease = 1 - Math.exp(-delta / 45);
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        ring.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .05) frame = requestAnimationFrame(step);
    };
    const hideRing = () => {
        ring.classList.remove('is-visible', 'is-pressed');
        positioned = false;
        cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    };
    document.addEventListener('pointermove', event => {
        if (!cursorEnabled() || event.pointerType !== 'mouse') return;
        targetX = event.clientX; targetY = event.clientY;
        if (!positioned) { x = targetX; y = targetY; positioned = true; }
        const element = event.target;
        const nativeOnly = element.closest('input, textarea, select, [contenteditable], iframe');
        ring.classList.toggle('is-visible', !nativeOnly);
        ring.classList.toggle('is-link', !!element.closest('a,button'));
        ring.classList.toggle('is-project', !!element.closest('.card-link,a.case-cover'));
        if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(step); }
    }, {passive: true});
    document.addEventListener('pointerdown', event => {
        if (cursorEnabled() && event.pointerType === 'mouse') ring.classList.add('is-pressed');
    }, {passive: true});
    document.addEventListener('pointerup', () => ring.classList.remove('is-pressed'), {passive: true});
    document.documentElement.addEventListener('pointerleave', hideRing);
    window.addEventListener('blur', hideRing);
    window.addEventListener('pagehide', hideRing);
    document.addEventListener('visibilitychange', () => { if (document.hidden) hideRing(); });

    const buttons = document.querySelectorAll('.cta,.nav-pill');
    const resetButton = el => { el.style.removeProperty('--magnet-x'); el.style.removeProperty('--magnet-y'); };
    buttons.forEach(el => {
        el.addEventListener('pointermove', event => {
            if (!cursorEnabled() || event.pointerType !== 'mouse') return;
            const rect = el.getBoundingClientRect();
            el.style.setProperty('--magnet-x', `${((event.clientX - rect.left) / rect.width - .5) * 5}px`);
            el.style.setProperty('--magnet-y', `${((event.clientY - rect.top) / rect.height - .5) * 5}px`);
        }, {passive: true});
        el.addEventListener('pointerleave', () => resetButton(el));
        el.addEventListener('blur', () => resetButton(el));
    });
    const updatePreference = () => {
        syncMotion(); hideRing();
        introAnimations.forEach(animation => animation.cancel());
        buttons.forEach(resetButton);
        if (!enabled()) revealElements.forEach(el => el.classList.add('visible'));
    };
    control.addEventListener('click', () => {
        preference = enabled() ? 'off' : 'on';
        try { localStorage.setItem('eren-motion', preference); } catch (_) { /* Optional. */ }
        updatePreference();
        playIntro();
    });
    reduced.addEventListener('change', updatePreference);
    fine.addEventListener('change', () => { hideRing(); buttons.forEach(resetButton); });

    // Case studies share the navbar treatment without loading home-specific code.
    const navbar = document.querySelector('#navbar');
    if (document.querySelector('.project-main') && navbar) {
        const scroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', scroll, {passive: true}); scroll();
    }
})();
