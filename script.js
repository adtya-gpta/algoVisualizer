// -------------------------------- Carousel Functionality --------------------------------

const carousel = document.querySelector('#carousel-viewport');
const dots = document.querySelectorAll('.indicators li');
const slideCount = dots.length;
const autoScrollDelay = 4000;
let autoScrollTimer;
let boundaryTimer;
let isRepositioning = false;

function setActiveDot(index) {
    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
}

function updateCarousel() {
    const slideWidth = carousel.clientWidth;
    const physicalIndex = Math.round(carousel.scrollLeft / slideWidth);
    clearTimeout(boundaryTimer);

    if (physicalIndex === 0) {
        setActiveDot(slideCount - 1);
        boundaryTimer = setTimeout(() => {
            if (Math.round(carousel.scrollLeft / carousel.clientWidth) !== 0) return;

            isRepositioning = true;
            carousel.scrollLeft = slideCount * carousel.clientWidth;
            requestAnimationFrame(() => {
                isRepositioning = false;
            });
        }, 140);
        return;
    }

    if (physicalIndex === slideCount + 1) {
        setActiveDot(0);
        boundaryTimer = setTimeout(() => {
            if (Math.round(carousel.scrollLeft / carousel.clientWidth) !== slideCount + 1) return;

            isRepositioning = true;
            carousel.scrollLeft = carousel.clientWidth;
            requestAnimationFrame(() => {
                isRepositioning = false;
            });
        }, 140);
        return;
    }

    setActiveDot(physicalIndex - 1);
}

function scheduleAutoScroll() {
    clearTimeout(autoScrollTimer);
    autoScrollTimer = setTimeout(() => {
        const currentIndex = Math.round(carousel.scrollLeft / carousel.clientWidth);
        carousel.scrollTo({
            left: (currentIndex + 1) * carousel.clientWidth,
            behavior: 'smooth'
        });
    }, autoScrollDelay);
}

carousel.addEventListener('scroll', () => {
    if (!isRepositioning) updateCarousel();
    scheduleAutoScroll();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        carousel.scrollTo({
            left: (index + 1) * carousel.clientWidth,
            behavior: 'smooth'
        });
        scheduleAutoScroll();
    });
});

carousel.scrollLeft = carousel.clientWidth;
scheduleAutoScroll();



// -------------------------------- Sidebar Functionality --------------------------------

const hamburger = document.querySelector('.hamburger-btn');
const sidebar = document.querySelector('.sidebar');
const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
});

hamburger.addEventListener('click', () => {
    sidebar.classList.add('is-open');
});
