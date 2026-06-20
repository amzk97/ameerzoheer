// وظيفة تبديل الوضع الليلي/النهاري
function toggleTheme() {
  const html = document.documentElement;
  const icon = document.querySelector('.theme-toggle i');
  const currentTheme = html.getAttribute('data-theme');
  
  if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'dark');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'light');
  }
}

// تحميل الوضع المحفوظ
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const icon = document.querySelector('.theme-toggle i');
  
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedTheme();

  // وظيفة العداد المتحرك
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats');
  let statsAnimated = false;

  const animateStats = () => {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute('data-target'));
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

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          animateStats();
          statsAnimated = true;
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeButton = document.querySelector('.lightbox-close');
  const prevButton = document.querySelector('.lightbox-prev');
  const nextButton = document.querySelector('.lightbox-next');
  const dotsContainer = document.getElementById('lightbox-dots');

  let currentImages = [];
  let currentIndex = 0;

  function updateLightboxImage() {
    lightboxImg.src = currentImages[currentIndex];
    
    // Update dots
    const dots = dotsContainer.querySelectorAll('.lightbox-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  galleryCards.forEach((card) => {
    const image = card.dataset.image;
    if (image) {
      card.style.backgroundImage = `url(${image})`;
    }

    card.addEventListener('click', () => {
      const imagesAttr = card.dataset.images;
      if (imagesAttr) {
        currentImages = JSON.parse(imagesAttr);
        currentIndex = 0;
        lightbox.classList.add('has-multiple');
        
        // Generate dots
        dotsContainer.innerHTML = '';
        currentImages.forEach((_, idx) => {
          const dot = document.createElement('div');
          dot.classList.add('lightbox-dot');
          if (idx === 0) dot.classList.add('active');
          dot.addEventListener('click', () => {
            currentIndex = idx;
            updateLightboxImage();
          });
          dotsContainer.appendChild(dot);
        });
      } else {
        currentImages = [image];
        currentIndex = 0;
        lightbox.classList.remove('has-multiple');
        dotsContainer.innerHTML = '';
      }
      
      updateLightboxImage();
      lightbox.classList.add('visible');
    });
  });

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 1) {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
      }
    });

    nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentImages.length > 1) {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
      }
    });
  }

  closeButton.addEventListener('click', () => {
    lightbox.classList.remove('visible');
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove('visible');
    }
  });

  const panels = document.querySelectorAll('.panel');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -120px 0px', threshold: 0.15 }
  );

  panels.forEach((panel) => observer.observe(panel));
});
