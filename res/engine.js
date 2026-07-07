document.addEventListener("DOMContentLoaded", () => {
    initCarousels();
});

function initCarousels() {
    const carousels = document.querySelectorAll(".carousel-wrapper");

    carousels.forEach(wrapper => {
        const viewport = wrapper.querySelector(".carousel-viewport");
        const prevBtn = wrapper.querySelector(".carousel-btn.prev");
        const nextBtn = wrapper.querySelector(".carousel-btn.next");
        const indicatorsContainer = wrapper.querySelector(".carousel-indicators");
        const cards = wrapper.querySelectorAll(".carousel-card");
        const totalItems = cards.length;

        if (totalItems === 0) return;

        // Генерация точек управления
        indicatorsContainer.innerHTML = "";
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement("div");
            dot.classList.add("carousel-dot");
            if (i === 0) dot.classList.add("active");
            
            dot.addEventListener("click", () => {
                scrollToIndex(i);
                resetAutoplay();
            });
            indicatorsContainer.appendChild(dot);
        }
        const dots = indicatorsContainer.querySelectorAll(".carousel-dot");

        function scrollToIndex(index) {
            if (index < 0 || index >= totalItems) return;
            const targetCard = cards[index];
            viewport.scrollTo({
                left: targetCard.offsetLeft - viewport.offsetLeft,
                behavior: "smooth"
            });
        }

        let activeIndex = 0;
        const observerOptions = {
            root: viewport,
            threshold: 0.6
        };

        // Отслеживание активного слайда
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(cards).indexOf(entry.target);
                    activeIndex = index;
                    
                    dots.forEach((dot, idx) => {
                        dot.classList.toggle("active", idx === activeIndex);
                    });
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));

        // Кнопки навигации
        nextBtn.addEventListener("click", () => {
            if (activeIndex < totalItems - 1) {
                scrollToIndex(activeIndex + 1);
            } else {
                scrollToIndex(0);
            }
            resetAutoplay();
        });

        prevBtn.addEventListener("click", () => {
            if (activeIndex > 0) {
                scrollToIndex(activeIndex - 1);
            } else {
                scrollToIndex(totalItems - 1);
            }
            resetAutoplay();
        });

        // Таймер автопрокрутки (5 секунд)
        let autoplayTimer = setInterval(() => {
            if (activeIndex < totalItems - 1) {
                scrollToIndex(activeIndex + 1);
            } else {
                scrollToIndex(0);
            }
        }, 5000);

        function resetAutoplay() {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => {
                if (activeIndex < totalItems - 1) {
                    scrollToIndex(activeIndex + 1);
                } else {
                    scrollToIndex(0);
                }
            }, 5000);
        }

        viewport.addEventListener("touchstart", () => clearInterval(autoplayTimer), {passive: true});
        viewport.addEventListener("touchend", () => resetAutoplay(), {passive: true});
    });
}
