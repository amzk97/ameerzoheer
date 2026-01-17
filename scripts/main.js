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
  const lightboxImg = lightbox.querySelector('img');
  const closeButton = document.querySelector('.lightbox-close');

  galleryCards.forEach((card) => {
    const image = card.dataset.image;
    if (image) {
      card.style.backgroundImage = `url(${image})`;
    }

    card.addEventListener('click', () => {
      lightboxImg.src = image;
      lightbox.classList.add('visible');
    });
  });

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
