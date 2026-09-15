// ===== Configurable Resume / Result PDF URL =====
// You can update DEFAULT_RESUME_URL here, set window.RESUME_URL, or pass ?resumeUrl=https://... in the browser URL
const urlParams = new URLSearchParams(window.location.search);
const DEFAULT_RESUME_URL = "https://drive.google.com/file/d/1xfg6OyvaytkXQuqjgVhSyRAWkr4_91C1/view?usp=sharing";
const RESUME_URL = urlParams.get('resumeUrl') || window.RESUME_URL || localStorage.getItem('resumeUrl') || DEFAULT_RESUME_URL;

// Helper to convert shareable cloud links (Google Drive, Dropbox, etc.) into iframe preview URLs
function getPdfPreviewUrl(url) {
  if (!url) return '';
  // Google Drive sharing link conversion to embeddable preview
  if (url.includes('drive.google.com')) {
    if (url.includes('/view')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    if (!url.includes('/preview')) {
      return url + '/preview';
    }
  }
  // Dropbox link conversion
  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'raw=1');
  }
  return url;
}

// Helper to convert Google Drive view URLs to direct download URLs
function getPdfDownloadUrl(url) {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  return url;
}

// ===== Typed.js for Animated Hero Text =====
document.addEventListener("DOMContentLoaded", function () {
  // Bind configured Resume URL to download and external links
  const downloadBtn = document.getElementById("download-resume-btn");
  const modalDownloadBtn = document.getElementById("modal-download-btn");
  const modalExternalBtn = document.getElementById("modal-external-btn");

  if (downloadBtn) downloadBtn.setAttribute("href", getPdfDownloadUrl(RESUME_URL));
  if (modalDownloadBtn) modalDownloadBtn.setAttribute("href", getPdfDownloadUrl(RESUME_URL));
  if (modalExternalBtn) modalExternalBtn.setAttribute("href", RESUME_URL);

  // ===== PDF Resume Modal Preview Logic =====
  const pdfModal = document.getElementById("pdf-modal");
  const viewResumeBtn = document.getElementById("view-resume-btn");
  const closePdfModalBtn = document.getElementById("close-pdf-modal");
  const pdfFrame = document.getElementById("pdf-frame");

  function openPdfModal() {
    if (pdfModal && pdfFrame) {
      pdfFrame.src = getPdfPreviewUrl(RESUME_URL);
      pdfModal.style.display = "block";
      pdfModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closePdfModal() {
    if (pdfModal && pdfFrame) {
      pdfModal.style.display = "none";
      pdfModal.setAttribute("aria-hidden", "true");
      pdfFrame.src = "";
      document.body.style.overflow = "";
    }
  }

  if (viewResumeBtn) {
    viewResumeBtn.addEventListener("click", openPdfModal);
  }

  if (closePdfModalBtn) {
    closePdfModalBtn.addEventListener("click", closePdfModal);
  }

  if (pdfModal) {
    pdfModal.addEventListener("click", function (e) {
      if (e.target === pdfModal) {
        closePdfModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && pdfModal && pdfModal.style.display === "block") {
      closePdfModal();
    }
  });

  if (window.Typed) {
    new Typed('#element', {
      strings: [
        'Web Designer',
        'Cybersecurity Enthusiast',
        'Python Programmer',
        'Frontend Developer'
      ],
      typeSpeed: 100,
      backSpeed: 50,
      loop: true
    });
  }

  // ===== Menu Toggle Functionality =====
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".Right");
  const navLinks = document.querySelectorAll("nav ul li a");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      menu.classList.toggle("active");
      menuToggle.classList.toggle("open");
    });

    // Auto close mobile menu when a navigation link is clicked
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (menu.classList.contains("active")) {
          menu.classList.remove("active");
          menuToggle.classList.remove("open");
        }
      });
    });
  }

  // ===== Header Glass Transition & Scrollspy Active Link =====
  const navbar = document.querySelector("nav");
  const sections = document.querySelectorAll("section[id], header[id]");

  function onScrollHandlers() {
    // Glass navbar height & shadow transition
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Scrollspy active section highlighting
    let currentSectionId = "home";
    const scrollPosition = window.scrollY + 120;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", onScrollHandlers);
  onScrollHandlers();

  // ===== Scroll-to-Top Button Logic =====
  const scrollToTopButton = document.createElement("button");
  scrollToTopButton.innerText = "↑";
  scrollToTopButton.className = "scroll-to-top";
  document.body.appendChild(scrollToTopButton);

  scrollToTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollToTopButton.style.display = "block";
    } else {
      scrollToTopButton.style.display = "none";
    }
  });

  // ===== Contact Form Validation & Submission =====
  const form = document.getElementById("contact-form");
  const statusText = document.getElementById("form-status");
  if (form && statusText) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const response = await fetch("https://formspree.io/f/mnndjpkj", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });
        if (response.ok) {
          form.reset();
          statusText.style.color = "green";
          statusText.textContent = "✅ Message sent successfully!";
        } else {
          statusText.style.color = "red";
          statusText.textContent = "❌ Failed to send. Try again later.";
        }
      } catch (error) {
        statusText.style.color = "red";
        statusText.textContent = "❌ Error: Network problem.";
      }
    });
  }

  // ===== Theme Toggle (Light/Dark Mode) =====
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  // Restore saved theme from localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    html.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    html.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme = html.getAttribute("data-theme");
      if (currentTheme === "dark") {
        html.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
      }
      themeToggle.blur();
    });
  }

  // ===== Dynamic Footer Year & Domain =====
  const copyrightYearEl = document.getElementById("copyright-year");
  const footerDomainEl = document.getElementById("footer-domain");

  if (copyrightYearEl) {
    copyrightYearEl.textContent = new Date().getFullYear();
  }
  if (footerDomainEl) {
    // Automatically use window.location.hostname or fallback to current domain
    const hostDomain = window.location.hostname || "sandyPortfolio.ct.ws";
    footerDomainEl.textContent = hostDomain;
  }
});

