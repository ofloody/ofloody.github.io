// Page initialization
document.addEventListener('DOMContentLoaded', function() {
    // Highlight active nav link based on current page
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Scroll reveal
    const revealElements = document.querySelectorAll('.project-card, .section-title');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Theme Toggle
    const themeToggles = document.querySelectorAll('.theme-toggle');

    // Check for saved theme preference or default to 'light' mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Add click event to all theme toggle buttons
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');

            // Save the theme preference
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    });
});
