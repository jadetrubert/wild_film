document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".site-nav a");
    const faqButtons = document.querySelectorAll(".faq-question");
    const revealItems = document.querySelectorAll("[data-reveal]");

    const syncHeaderState = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const closeMenu = () => {
        header.classList.remove("menu-open");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
    };

    const openMenu = () => {
        header.classList.add("menu-open");
        document.body.classList.add("menu-open");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Fechar menu");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = header.classList.contains("menu-open");

        if (isOpen) {
            closeMenu();
            return;
        }

        openMenu();
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!header.classList.contains("menu-open")) {
            return;
        }

        if (!header.contains(event.target)) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && header.classList.contains("menu-open")) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            const shouldOpen = !item.classList.contains("is-open");

            faqButtons.forEach((otherButton) => {
                otherButton.setAttribute("aria-expanded", "false");
                otherButton.closest(".faq-item").classList.remove("is-open");
            });

            if (shouldOpen) {
                item.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    if (faqButtons[0]) {
        faqButtons[0].click();
    }

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
});
