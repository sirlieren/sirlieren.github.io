// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect (class-based for cleaner styling)
    const navbar = document.querySelector('.navbar');
    const handleScroll = () => {
        const offset = window.scrollY || window.pageYOffset;
        if (offset > 24) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');
        });
    }

    // Projects slider logic
    const projectsTrack = document.querySelector('.projects-track');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    let currentPosition = 0;

    // Calculate how many cards are visible at once
    const cardWidth = 350; // width of one card
    const cardGap = 32; // 2rem gap
    const cardTotal = cardWidth + cardGap;

    if (projectsTrack && scrollLeftBtn && scrollRightBtn) {
        // Initially hide left scroll button
        scrollLeftBtn.style.opacity = '0.3';

        // Function to update scroll buttons visibility
        const updateScrollButtons = () => {
            // Hide left button if at the start
            scrollLeftBtn.style.opacity = currentPosition === 0 ? '0.3' : '1';

            // Hide right button if at the end
            const maxScroll = projectsTrack.children.length * cardTotal - projectsTrack.parentElement.offsetWidth;
            scrollRightBtn.style.opacity = currentPosition >= maxScroll ? '0.3' : '1';
        };

        // Scroll right
        scrollRightBtn.addEventListener('click', () => {
            const maxScroll = projectsTrack.children.length * cardTotal - projectsTrack.parentElement.offsetWidth;
            currentPosition = Math.min(currentPosition + cardTotal, maxScroll);
            projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
            updateScrollButtons();
        });

        // Scroll left
        scrollLeftBtn.addEventListener('click', () => {
            currentPosition = Math.max(currentPosition - cardTotal, 0);
            projectsTrack.style.transform = `translateX(-${currentPosition}px)`;
            updateScrollButtons();
        });

        // Update buttons on window resize
        window.addEventListener('resize', updateScrollButtons);

        // Initial button state
        updateScrollButtons();
    }

    // Reveal-on-scroll animations
    const revealElements = document.querySelectorAll('.section-header, .project-card, .about-content, .contact-card, .availability-card');
    const revealClass = 'reveal-on-scroll';
    const visibleClass = 'is-visible';

    revealElements.forEach((el, index) => {
        el.classList.add(revealClass);
        // Subtle stagger based on index
        el.style.transitionDelay = `${80 + index * 40}ms`;
    });

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(visibleClass);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18
        }
    );

    revealElements.forEach(el => observer.observe(el));

    // Active section indicator
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const setActiveLink = () => {
        const scrollPos = window.scrollY || window.pageYOffset;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const offsetForHighlight = viewportHeight * 0.25;

        let activeId = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollPos - offsetForHighlight;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                activeId = `#${section.id}`;
            }
        });

        navLinks.forEach(link => {
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });
});
