document.addEventListener("DOMContentLoaded", () => {
  const fadeTargets = document.querySelectorAll(".fade-up");

  if (fadeTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeTargets.forEach((target) => observer.observe(target));
  }

  const hero = document.querySelector(".hero-modern-copy");
  if (hero) {
    hero.animate(
      [
        { opacity: 0, transform: "translateY(24px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 900,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards"
      }
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = Array.from(document.querySelectorAll(".floating-nav-menu a"));
  if (!navLinks.length) return;

  const sectionTargets = navLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      return document.querySelector(href);
    })
    .filter(Boolean);

  function setCurrentByHash(hash) {
    navLinks.forEach((link) => {
      link.classList.toggle("is-current", link.getAttribute("href") === hash);
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setCurrentByHash(`#${entry.target.id}`);
        }
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.1
    }
  );

  sectionTargets.forEach((target) => observer.observe(target));

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href") || "";
      if (href.startsWith("#")) setCurrentByHash(href);
    });
  });

  setCurrentByHash("#home");
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".project-slider");
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll(".project-hero-slide"));
  const prevBtn = slider.querySelector(".project-slider-arrow.prev");
  const nextBtn = slider.querySelector(".project-slider-arrow.next");
  const dots = Array.from(
    document.querySelectorAll(".project-slider-dots .project-hero-dot")
  );

  if (!slides.length) return;

  let current = 0;
  let isAnimating = false;
  const transitionDuration = 1250;

  function render(index) {
    if (isAnimating) return;
    isAnimating = true;

    const total = slides.length;
    const activeIndex = (index + total) % total;
    const prevIndex = (activeIndex + total - 1) % total;
    const nextIndex = (activeIndex + 1) % total;

    slides.forEach((slide, i) => {
      slide.classList.remove("is-prev", "is-active", "is-next");
      if (i === activeIndex) slide.classList.add("is-active");
      else if (i === prevIndex) slide.classList.add("is-prev");
      else if (i === nextIndex) slide.classList.add("is-next");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === activeIndex);
    });

    current = activeIndex;

    window.setTimeout(() => {
      isAnimating = false;
    }, transitionDuration);
  }

  prevBtn?.addEventListener("click", () => render(current - 1));
  nextBtn?.addEventListener("click", () => render(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => render(i));
  });

  render(0);
});

document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.querySelector(".awards-total-count");
  if (!countEl) return;

  const rawText = countEl.textContent.trim();
  const target = Number(rawText.replace(/\D/g, ""));
  if (!Number.isFinite(target)) return;

  const shouldPad = rawText.startsWith("0");
  const minDigits = rawText.length;
  const formatValue = (value) =>
    shouldPad ? String(value).padStart(minDigits, "0") : String(value);

  countEl.textContent = formatValue(0);

  let hasAnimated = false;

  const animateCount = () => {
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      countEl.textContent = formatValue(current);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCount();
          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -18% 0px",
    }
  );

  observer.observe(countEl);
});
