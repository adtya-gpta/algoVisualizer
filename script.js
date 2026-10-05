document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------- Sidebar Controller --------------------------------
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const closeBtn = document.querySelector('.close-btn');
    const sidebar = document.querySelector('.sidebar');

    function toggleSidebar(open) {
        if (!sidebar || !hamburgerBtn) return;
        sidebar.classList.toggle('is-open', open);
        sidebar.setAttribute('aria-hidden', (!open).toString());
        hamburgerBtn.setAttribute('aria-expanded', open.toString());
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => toggleSidebar(true));
    }

    if (closeBtn && sidebar) {
        closeBtn.addEventListener('click', () => toggleSidebar(false));
    }

    // -------------------------------- Carousel Controller --------------------------------
    const carousel = document.querySelector('#carousel-viewport');
    const dots = document.querySelectorAll('.indicators li');
    const slides = document.querySelectorAll('.carousel-image');

    if (!carousel || slides.length === 0 || dots.length === 0) return;

    const slideCount = Math.min(slides.length, dots.length);
    const autoScrollDelay = 4000;
    let autoScrollTimer = null;
    let isUserInteracting = false;
    let rAFPending = false;

    function setActiveDot(index) {
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
        });
    }

    function syncIndex() {
        const slideWidth = carousel.clientWidth;
        if (!slideWidth) return;

        const currentIndex = Math.min(
            Math.max(0, Math.round(carousel.scrollLeft / slideWidth)),
            slideCount - 1
        );
        setActiveDot(currentIndex);
    }

    function scrollToIndex(index) {
        const slideWidth = carousel.clientWidth;
        carousel.scrollTo({
            left: index * slideWidth,
            behavior: 'smooth'
        });
        setActiveDot(index);
    }

    function scheduleAutoScroll() {
        clearTimeout(autoScrollTimer);
        if (isUserInteracting) return;

        autoScrollTimer = setTimeout(() => {
            const slideWidth = carousel.clientWidth;
            const currentIndex = Math.round(carousel.scrollLeft / slideWidth);
            const nextIndex = (currentIndex + 1) % slideCount;
            scrollToIndex(nextIndex);
            scheduleAutoScroll();
        }, autoScrollDelay);
    }

    // Smooth scroll event debouncing with requestAnimationFrame
    carousel.addEventListener('scroll', () => {
        if (!rAFPending) {
            rAFPending = true;
            requestAnimationFrame(() => {
                syncIndex();
                rAFPending = false;
            });
        }
        scheduleAutoScroll();
    }, { passive: true });

    // Pause on finger touches / drag to prevent competing scrolls
    carousel.addEventListener('touchstart', () => {
        isUserInteracting = true;
        clearTimeout(autoScrollTimer);
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        isUserInteracting = false;
        scheduleAutoScroll();
    }, { passive: true });

    // Interactive pagination dots
    dots.forEach((dot, index) => {
        if (index < slideCount) {
            dot.addEventListener('click', () => {
                scrollToIndex(index);
                scheduleAutoScroll();
            });
        }
    });

    // Initialize
    syncIndex();
    scheduleAutoScroll();
});