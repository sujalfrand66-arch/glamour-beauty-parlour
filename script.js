/* ════════════════════════════════════════════════
   LUMIÈRE BEAUTY — SCRIPT.JS
   ════════════════════════════════════════════════ */

"use strict";

/* ─── NAVBAR: scroll state + mobile toggle ─── */
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  toggleBackTop();
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

/* ─── ACTIVE NAV LINK on scroll ─── */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach(a => {
          a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-40% 0px -50% 0px" }
);

sections.forEach(s => sectionObserver.observe(s));

/* ─── SCROLL REVEAL ─── */
const revealEls = document.querySelectorAll(".scroll-reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings in the same parent
        const siblings = Array.from(entry.target.parentElement.querySelectorAll(".scroll-reveal"));
        const idx      = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 0.1}s`;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ─── BOOKING FORM ─── */
const bookingForm   = document.getElementById("bookingForm");
const popupOverlay  = document.getElementById("popupOverlay");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Basic validation
  const name    = bookingForm.name.value.trim();
  const phone   = bookingForm.phone.value.trim();
  const service = bookingForm.service.value;
  const date    = bookingForm.date.value;

  if (!name || !phone || !service || !date) {
    shakeForm();
    return;
  }

  // Show success popup
  openPopup();
  bookingForm.reset();
});

function openPopup() {
  popupOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePopup() {
  popupOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Close popup when clicking outside the card
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// Close popup with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePopup();
});

// Expose globally for inline onclick
window.closePopup = closePopup;

function shakeForm() {
  const form = document.querySelector(".appt-form-wrap");
  form.style.animation = "none";
  form.offsetHeight; // reflow
  form.style.animation = "shake 0.5s ease";
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ─── BACK TO TOP ─── */
const backTop = document.getElementById("backTop");

function toggleBackTop() {
  if (window.scrollY > 400) {
    backTop.classList.add("visible");
  } else {
    backTop.classList.remove("visible");
  }
}

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ─── SMOOTH NAV LINK SCROLLING ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ─── PARALLAX: subtle hero background shift ─── */
const heroBg = document.querySelector(".hero-img");

if (heroBg) {
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

/* ─── INPUT: floating label enhancement & date min ─── */
const dateInput = document.getElementById("date");
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

/* ─── TILT EFFECT on service cards ─── */
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width  / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) *  6;

    card.style.transform =
      `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = "transform 0.1s ease, box-shadow 0.35s ease";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform  = "";
    card.style.transition = "all 0.35s cubic-bezier(0.4,0,0.2,1)";
  });
});

/* ─── GALLERY: lightbox-style zoom hint cursor ─── */
document.querySelectorAll(".gallery-item").forEach(item => {
  item.style.cursor = "zoom-in";
});

/* ─── COUNTER ANIMATION on stats ─── */
function animateCounter(el, target, duration = 1500) {
  let start   = 0;
  const step  = target / (duration / 16);

  const tick = () => {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start) + (el.dataset.suffix || "");
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + (el.dataset.suffix || "");
    }
  };
  requestAnimationFrame(tick);
}

const statsSection = document.querySelector(".about-stats");
if (statsSection) {
  let animated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;

      const statNums = document.querySelectorAll(".stat-n");
      const configs  = [
        { target: 5000, suffix: "k+" },
        { target: 30,   suffix: "+"  },
        { target: 98,   suffix: "%"  },
      ];

      statNums.forEach((el, i) => {
        const conf = configs[i];
        if (!conf) return;
        el.dataset.suffix = conf.suffix;
        animateCounter(el, conf.target === 5000 ? 5 : conf.target, 1400);
        if (conf.target === 5000) el.dataset.suffix = "k+";
      });
    }
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
}

/* ─── NAVBAR link active style injection ─── */
const activeStyle = document.createElement("style");
activeStyle.textContent = `
  .nav-links a.active {
    color: var(--rose-light) !important;
  }
  .navbar.scrolled .nav-links a.active {
    color: var(--rose) !important;
  }
`;
document.head.appendChild(activeStyle);

/* ─── INIT on DOMContentLoaded ─── */
document.addEventListener("DOMContentLoaded", () => {
  toggleBackTop();
  console.log("%c✦ Lumière Beauty — Website loaded ✦", "color:#D4607A;font-size:14px;font-weight:bold;");
});