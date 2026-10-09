// ==========================================================================
// Theme Management (Dark / Light Mode)
// ==========================================================================
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.querySelector('.theme-toggle i');
  const currentTheme = html.getAttribute('data-theme') || 'light';
  
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    localStorage.setItem('theme', 'light');
  }
}

function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
  const icon = document.querySelector('.theme-toggle i');
  
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }
}

// ==========================================================================
// Main Initialization on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      }
    });
  }

  // 2. Animated Stats Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      if (isNaN(target)) return;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateNumber = () => {
        current += increment;
        if (current < target) {
          stat.textContent = Math.ceil(current);
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = target;
        }
      };

      updateNumber();
    });
  };

  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObserver.observe(statsSection);
  }

  // 3. Lightbox Functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');
  const dotsContainer = document.getElementById('lightbox-dots');

  let currentImages = [];
  let currentIndex = 0;

  function updateLightboxImage() {
    if (!lightboxImg || currentImages.length === 0) return;
    lightboxImg.src = currentImages[currentIndex];
    
    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.lightbox-dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Toggle navigation arrows visibility
    if (prevButton && nextButton) {
      const showArrows = currentImages.length > 1;
      prevButton.style.display = showArrows ? 'flex' : 'none';
      nextButton.style.display = showArrows ? 'flex' : 'none';
    }
  }

  function openLightbox(images, startIndex = 0) {
    if (!lightbox || !images || images.length === 0) return;
    currentImages = images;
    currentIndex = startIndex;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      if (currentImages.length > 1) {
        currentImages.forEach((_, idx) => {
          const dot = document.createElement('div');
          dot.classList.add('lightbox-dot');
          if (idx === currentIndex) dot.classList.add('active');
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = idx;
            updateLightboxImage();
          });
          dotsContainer.appendChild(dot);
        });
      }
    }

    updateLightboxImage();
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('visible');
    document.body.style.overflow = '';
  }

  // Gallery cards click
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card) => {
    const image = card.dataset.image;
    if (image) {
      card.style.backgroundImage = `url(${image})`;
    }

    card.addEventListener('click', () => {
      const imagesAttr = card.dataset.images;
      if (imagesAttr) {
        try {
          const parsed = JSON.parse(imagesAttr);
          openLightbox(parsed, 0);
        } catch (e) {
          openLightbox([image], 0);
        }
      } else if (image) {
        openLightbox([image], 0);
      }
    });
  });

  // Product screenshots click (Allow enlarging screenshots with gallery navigation per system)
  document.querySelectorAll('.system-screenshots').forEach((showcase) => {
    const cards = showcase.querySelectorAll('.screenshot-card');
    const images = Array.from(cards)
      .map((c) => c.querySelector('.screenshot-image img')?.src)
      .filter(Boolean);

    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(images, idx);
      });
    });
  });

  // Lightbox Controls
  if (prevButton) {
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 1) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 1) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
      }
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('visible')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight' && currentImages.length > 1) {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateLightboxImage();
    } else if (e.key === 'ArrowLeft' && currentImages.length > 1) {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateLightboxImage();
    }
  });

  // 4. Back to Top Button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Contact Form Submission Handling
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim() || '';
      const email = document.getElementById('contactEmail')?.value.trim() || '';
      const message = document.getElementById('contactMessage')?.value.trim() || '';

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'يرجى ملء جميع الحقول المطلوبة.';
          formFeedback.style.display = 'block';
        }
        return;
      }

      // Encode message for WhatsApp direct transfer
      const waText = encodeURIComponent(`مرحباً مهندس أمير،\nأنا: ${name}\nالبريد: ${email}\nالرسالة: ${message}`);
      const waUrl = `https://wa.me/9647831449569?text=${waText}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `
          <strong>تم استلام طلبك بنجاح، شكراً لك يا ${name}!</strong><br>
          سأقوم بمراجعة رسالتك والرد عليك قريباً عبر البريد (${email}).<br>
          <a href="${waUrl}" target="_blank" rel="noreferrer" style="display:inline-block; margin-top:8px; font-weight:600; text-decoration:underline;">
            <i class="fab fa-whatsapp"></i> اضغط هنا لفتح الرسالة في واتساب مباشرة أيضاً
          </a>
        `;
        formFeedback.style.display = 'block';
      }

      contactForm.reset();
    });
  }

  // 6. Section Visibility Animation Observer
  const panels = document.querySelectorAll('.panel');
  if ('IntersectionObserver' in window) {
    const panelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -80px 0px', threshold: 0.1 }
    );

    panels.forEach((panel) => panelObserver.observe(panel));
  }
});
