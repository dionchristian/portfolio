(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const header = document.getElementById("main-nav-header");
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const moonIcon = document.getElementById("moon-icon");
    const sunIcon = document.getElementById("sun-icon");
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function resolveTheme() {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      return mediaQuery.matches ? "dark" : "light";
    }

    function applyTheme(theme) {
      root.setAttribute("theme", theme);
      if (moonIcon && sunIcon) {
        moonIcon.style.display = theme === "dark" ? "block" : "none";
        sunIcon.style.display = theme === "dark" ? "none" : "block";
      }
    }

    applyTheme(resolveTheme());

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", function () {
        const nextTheme = root.getAttribute("theme") === "dark" ? "light" : "dark";
        localStorage.setItem("theme", nextTheme);
        applyTheme(nextTheme);
      });
    }

    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
    }

    // Mobile navigation drawer
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const mobileDrawer = document.getElementById("mobile-nav-drawer");

    function setDrawerOpen(isOpen) {
      if (!mobileToggle || !mobileDrawer) return;
      mobileDrawer.classList.toggle("open", isOpen);
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener("click", function () {
        setDrawerOpen(!mobileDrawer.classList.contains("open"));
      });

      mobileDrawer.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          setDrawerOpen(false);
        });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setDrawerOpen(false);
      });

      document.addEventListener("click", function (e) {
        if (header && !header.contains(e.target)) {
          setDrawerOpen(false);
        }
      });
    }

    // Project category filter tabs
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card[data-category]");
    const featuredGrid = document.getElementById("featured-projects-grid");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const filter = btn.getAttribute("data-filter");
        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });

        projectCards.forEach(function (card) {
          const cat = card.getAttribute("data-category");
          const visible = filter === "all" || cat === filter;
          card.hidden = !visible;
          if (visible) card.classList.add("visible");
        });

        if (featuredGrid) {
          const anyFeaturedVisible = Array.from(featuredGrid.querySelectorAll(".project-card")).some(function (c) {
            return !c.hidden;
          });
          featuredGrid.style.display = anyFeaturedVisible ? "" : "none";
        }
      });
    });

    // Copy email action
    const copyBtn = document.getElementById("copy-email-btn");
    const emailLink = document.getElementById("contact-email-btn");
    if (copyBtn && emailLink) {
      copyBtn.addEventListener("click", function () {
        const email = emailLink.textContent.trim();
        function markCopied() {
          copyBtn.textContent = "Copied";
          copyBtn.classList.add("copied");
          setTimeout(function () {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(markCopied).catch(fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          const ta = document.createElement("textarea");
          ta.value = email;
          ta.setAttribute("readonly", "");
          ta.style.position = "absolute";
          ta.style.left = "-9999px";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          markCopied();
        }
      });
    }

    // Scroll reveal with fallback safety timer
    const animated = document.querySelectorAll(".animate-on-scroll");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      animated.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      animated.forEach(function (el) {
        el.classList.add("visible");
      });
    }

    setTimeout(function () {
      document.querySelectorAll(".animate-on-scroll:not(.visible)").forEach(function (el) {
        el.classList.add("visible");
      });
    }, 1200);

    // Smooth anchor navigation with sticky header offset
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = header ? header.offsetHeight : 0;
          const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });
  });
})();
