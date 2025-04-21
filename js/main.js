// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'transparent';
    }
});

// Mobile menu toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
});

document.addEventListener('DOMContentLoaded', () => {
    const projectsTrack = document.querySelector('.projects-track');
    const scrollLeftBtn = document.querySelector('.scroll-left');
    const scrollRightBtn = document.querySelector('.scroll-right');
    let currentPosition = 0;

    // Calculate how many cards are visible at once
    const cardWidth = 350; // width of one card
    const cardGap = 32; // 2rem gap
    const cardTotal = cardWidth + cardGap;

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
});
