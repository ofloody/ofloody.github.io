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
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Theme Toggle — dark is default, light-theme class enables light mode
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    });

    // Travel carousels — discover images by probing sequentially (trip_0.jpeg, trip_1.jpeg, ...)
    document.querySelectorAll('.travel-carousel').forEach(async carousel => {
        const trip = carousel.dataset.trip;
        if (!trip) return;

        const slidesContainer = carousel.querySelector('.carousel-slides');
        const dotsContainer = carousel.querySelector('.carousel-dots');

        const base = trip.replace(/-/g, '_');
        const images = [];
        for (let i = 0; i < 50; i++) {
            const filename = `${base}_${i}.jpeg`;
            try {
                const r = await fetch(`images/trips/${trip}/${filename}`, { method: 'HEAD' });
                if (!r.ok) break;
                images.push(filename);
            } catch {
                break;
            }
        }

        if (!images.length) return;

        // Build slide elements
        images.forEach((filename, i) => {
            const img = document.createElement('img');
            img.className = 'carousel-slide' + (i === 0 ? ' active' : '');
            img.src = `images/trips/${trip}/${filename}`;
            img.alt = trip;
            slidesContainer.appendChild(img);
        });

        const slides = Array.from(slidesContainer.querySelectorAll('.carousel-slide'));
        let current = 0;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        // Hide nav if only one slide
        if (slides.length === 1) {
            carousel.querySelector('.carousel-prev').style.display = 'none';
            carousel.querySelector('.carousel-next').style.display = 'none';
        }

        function goTo(index) {
            slides[current].classList.remove('active');
            dotsContainer.children[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dotsContainer.children[current].classList.add('active');
        }

        carousel.querySelector('.carousel-prev').addEventListener('click', () => goTo(current - 1));
        carousel.querySelector('.carousel-next').addEventListener('click', () => goTo(current + 1));

        // Swipe support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
        }, { passive: true });
    });
});
