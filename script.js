// ========== BURGER MENU ==========
// Note: Le burger menu est géré par le script inline dans index.html
// Ce code est conservé uniquement pour les autres pages qui utilisent script.js
(function() {
  // Vérifie si le burger n'a pas déjà d'event listener (pour éviter les doublons)
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  
  if (burger && navLinks && !burger.hasAttribute('data-initialized')) {
    burger.setAttribute('data-initialized', 'true');
    burger.addEventListener('click', () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      navLinks.classList.toggle('show');
      burger.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Fermer au clic sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    // Fermer au clic à l'extérieur sur mobile
    if (window.innerWidth <= 900) {
      navLinks.addEventListener('click', (e) => {
        if (e.target === navLinks || e.target.classList.contains('nav-links')) {
          navLinks.classList.remove('show');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }
})();

// ========== DROPDOWN TOGGLES ==========
(function() {
  const dropdownToggles = document.querySelectorAll('.nav-dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdownId = 'dropdown-' + toggle.dataset.dropdown;
      const dropdown = document.getElementById(dropdownId);
      if (!dropdown) return;
      const isOpen = dropdown.classList.contains('show');
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
      document.querySelectorAll('.nav-dropdown-toggle').forEach(t => t.classList.remove('active'));
      if (!isOpen) {
        dropdown.classList.add('show');
        toggle.classList.add('active');
      }
    });
  });

  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => e.stopPropagation());
  });
})();

// ========== NAVBAR SCROLL ==========
(function() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ========== ANIMATIONS ==========
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll('.service-item, .pilier-card');
animatedElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'all 0.6s ease-out';
  observer.observe(element);
});

// ========== GALLERY SLIDER ==========
let slides, dots;
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const sliderContainer = document.querySelector('.slider-container');
const gallerySlider = document.getElementById('gallery-slider');
const sliderDotsContainer = document.getElementById('slider-dots');
let currentSlide = 0;
let autoSlideInterval;

async function loadGallery() {
  if (!gallerySlider || !sliderDotsContainer) {
    return;
  }
  
  try {
    const response = await fetch('gallery.json');
    const data = await response.json();
    gallerySlider.innerHTML = data.images.map((img, index) => `
      <div class="slide ${index === 0 ? 'active' : ''}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" width="1200" height="800">
        <div class="slide-caption">${img.caption}</div>
      </div>
    `).join('');
    sliderDotsContainer.innerHTML = data.images.map((img, index) => `
      <button class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Image ${index + 1}"></button>
    `).join('');
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    initSlider();
  } catch (error) {
    const fallbackImages = [
      { src: 'image/abattage-arbre-1920x1282.jpg', alt: "Abattage d'arbre", caption: 'Abattage contrôlé' },
      { src: 'image/2022-06-03.jpg', alt: 'Élagage', caption: 'Élagage professionnel' },
      { src: 'image/cellaaa.webp', alt: 'Chantier', caption: 'Chantier terminé' }
    ];
    gallerySlider.innerHTML = fallbackImages.map((img, index) => `
      <div class="slide ${index === 0 ? 'active' : ''}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy" width="1200" height="800">
        <div class="slide-caption">${img.caption}</div>
      </div>
    `).join('');
    sliderDotsContainer.innerHTML = fallbackImages.map((img, index) => `
      <button class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Image ${index + 1}"></button>
    `).join('');
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    if (slides.length > 0) {
      initSlider();
    }
  }
}

function initSlider() {
  if (!dots || dots.length === 0) return;
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      stopAutoSlide();
      startAutoSlide();
    });
  });
  startAutoSlide();
  
  let touchStartX = 0;
  let touchEndX = 0;
  if (sliderContainer) {
    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }
  
  function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
      nextSlide();
      stopAutoSlide();
      startAutoSlide();
    }
    if (touchEndX > touchStartX + 50) {
      prevSlide();
      stopAutoSlide();
      startAutoSlide();
    }
  }
}

function showSlide(index) {
  if (!slides || slides.length === 0) return;
  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }
function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 5000); }
function stopAutoSlide() { clearInterval(autoSlideInterval); }

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

if (sliderContainer) {
  sliderContainer.addEventListener('mouseenter', stopAutoSlide);
  sliderContainer.addEventListener('mouseleave', startAutoSlide);
}

if (gallerySlider && sliderDotsContainer) {
  loadGallery();
}

// ========== TESTIMONIALS SLIDER ==========
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentTestimonial = 0;
let testimonialAutoInterval;

function showTestimonial(index) {
  if (index >= testimonialSlides.length) {
    currentTestimonial = 0;
  } else if (index < 0) {
    currentTestimonial = testimonialSlides.length - 1;
  } else {
    currentTestimonial = index;
  }
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  testimonialDots.forEach(dot => dot.classList.remove('active'));
  if (testimonialSlides[currentTestimonial]) {
    testimonialSlides[currentTestimonial].classList.add('active');
  }
  if (testimonialDots[currentTestimonial]) {
    testimonialDots[currentTestimonial].classList.add('active');
  }
}

function nextTestimonial() { showTestimonial(currentTestimonial + 1); }
function startTestimonialAuto() { testimonialAutoInterval = setInterval(nextTestimonial, 6000); }
function stopTestimonialAuto() { clearInterval(testimonialAutoInterval); }

testimonialDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showTestimonial(index);
    stopTestimonialAuto();
    startTestimonialAuto();
  });
});

const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
  testimonialsSlider.addEventListener('mouseenter', stopTestimonialAuto);
  testimonialsSlider.addEventListener('mouseleave', startTestimonialAuto);
  
  let testimonialTouchStartX = 0;
  let testimonialTouchEndX = 0;
  testimonialsSlider.addEventListener('touchstart', (e) => {
    testimonialTouchStartX = e.changedTouches[0].screenX;
  });
  testimonialsSlider.addEventListener('touchend', (e) => {
    testimonialTouchEndX = e.changedTouches[0].screenX;
    handleTestimonialSwipe();
  });
  
  function handleTestimonialSwipe() {
    if (testimonialTouchEndX < testimonialTouchStartX - 50) {
      nextTestimonial();
      stopTestimonialAuto();
    } else if (testimonialTouchEndX > testimonialTouchStartX + 50) {
      showTestimonial(currentTestimonial - 1);
      stopTestimonialAuto();
    }
  }
  
  startTestimonialAuto();
}

// ========== TRANSLATIONS SYSTEM ==========
let currentLang = localStorage.getItem('language') || 'fr';
let translations = {};

async function loadTranslations() {
  try {
    const response = await fetch('translations.json');
    translations = await response.json();
    console.log('✅ Traductions chargées depuis JSON');
    applyTranslations(currentLang);
  } catch (error) {
    console.warn('⚠️ Impossible de charger translations.json, utilisation du fallback');
    translations = {
      "fr": { "nav": { "services": "Services", "realisations": "Réalisations", "about": "À propos", "tarifs": "Tarifs", "contact": "Contact", "faq": "FAQ" } },
      "en": { "nav": { "services": "Services", "realisations": "Projects", "about": "About", "tarifs": "Rates", "contact": "Contact", "faq": "FAQ" } },
      "nl": { "nav": { "services": "Diensten", "realisations": "Realisaties", "about": "Over mij", "tarifs": "Tarieven", "contact": "Contact", "faq": "FAQ" } },
      "de": { "nav": { "services": "Leistungen", "realisations": "Projekte", "about": "Über uns", "tarifs": "Preise", "contact": "Kontakt", "faq": "FAQ" } }
    };
    applyTranslations(currentLang);
  }
}

loadTranslations();

// ========== COUNT UP ANIMATION ==========
function animateCountUp(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  const suffix = element.getAttribute('data-suffix') || '';
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.getAttribute('data-count'));
      animateCountUp(entry.target, target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(stat => {
  statsObserver.observe(stat);
});

// ========== ROADMAP ANIMATION ==========
const roadmapObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.roadmap-step').forEach(step => {
  roadmapObserver.observe(step);
});

// ========== APPLY TRANSLATIONS ==========
function applyTranslations(lang) {
  console.log('🌍 Changement de langue vers:', lang);
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  // Update language display
  const currentLangElement = document.getElementById('current-lang');
  const currentLangMobileElement = document.getElementById('current-lang-mobile');
  if (currentLangElement) currentLangElement.textContent = lang.toUpperCase();
  if (currentLangMobileElement) currentLangMobileElement.textContent = lang.toUpperCase();
  
  // Translate elements
  let updated = 0;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, lang);
    if (translation) {
      element.innerHTML = translation;
      updated++;
    }
  });
  console.log('✅ ' + updated + ' éléments traduits');
  
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = getTranslation(key, lang);
    if (translation) {
      element.placeholder = translation;
    }
  });
  
  // Update active state on language options
  document.querySelectorAll('.lang-option').forEach(option => {
    option.classList.toggle('active', option.getAttribute('data-lang') === lang);
  });
}

function getTranslation(key, lang) {
  const keys = key.split('.');
  let value = translations[lang];
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return null;
    }
  }
  return value;
}

// ========== LANGUAGE SELECTOR - DESKTOP ==========
// Note: Vérifie si pas déjà initialisé (pour éviter les doublons avec le script inline)
(function() {
  const langSelector = document.getElementById('lang-selector');
  const langOptions = document.getElementById('lang-options');

  if (langSelector && langOptions && !langSelector.hasAttribute('data-initialized')) {
    langSelector.setAttribute('data-initialized', 'true');
    langSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      // Fermer l'autre dropdown si ouvert
      const mobileOptions = document.getElementById('lang-options-mobile');
      if (mobileOptions) mobileOptions.classList.remove('show');
      // Toggle le dropdown desktop
      langOptions.classList.toggle('show');
    });
    
    langOptions.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
})();

// ========== LANGUAGE SELECTOR - MOBILE ==========
(function() {
  const langSelectorMobile = document.getElementById('lang-selector-mobile');
  const langOptionsMobile = document.getElementById('lang-options-mobile');
  const langOptions = document.getElementById('lang-options');

  if (langSelectorMobile && langOptionsMobile && !langSelectorMobile.hasAttribute('data-initialized')) {
    langSelectorMobile.setAttribute('data-initialized', 'true');
    langSelectorMobile.addEventListener('click', (e) => {
      e.stopPropagation();
      // Fermer l'autre dropdown si ouvert
      if (langOptions) langOptions.classList.remove('show');
      // Toggle le dropdown mobile
      langOptionsMobile.classList.toggle('show');
    });
    
    langOptionsMobile.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
})();

// ========== CLOSE DROPDOWNS ON OUTSIDE CLICK ==========
(function() {
  const langOptions = document.getElementById('lang-options');
  const langOptionsMobile = document.getElementById('lang-options-mobile');
  
  document.addEventListener('click', () => {
    if (langOptions) langOptions.classList.remove('show');
    if (langOptionsMobile) langOptionsMobile.classList.remove('show');
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('show'));
    document.querySelectorAll('.nav-dropdown-toggle').forEach(t => t.classList.remove('active'));
  });
})();

// ========== LANGUAGE OPTION BUTTONS ==========
(function() {
  const langButtons = document.querySelectorAll('.lang-option');
  const langOptions = document.getElementById('lang-options');
  const langOptionsMobile = document.getElementById('lang-options-mobile');

  langButtons.forEach(button => {
    if (button.hasAttribute('data-initialized')) return;
    button.setAttribute('data-initialized', 'true');
    
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = button.getAttribute('data-lang');
      
      // Appliquer les traductions si la fonction existe
      if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
      } else {
        // Fallback: juste mettre à jour l'affichage
        const currentLangEl = document.getElementById('current-lang');
        const currentLangMobileEl = document.getElementById('current-lang-mobile');
        if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
        if (currentLangMobileEl) currentLangMobileEl.textContent = lang.toUpperCase();
        localStorage.setItem('language', lang);
      }
      
      // Fermer tous les dropdowns
      if (langOptions) langOptions.classList.remove('show');
      if (langOptionsMobile) langOptionsMobile.classList.remove('show');
    });
  });
})();

// ========== EMAILJS CONTACT FORM ==========
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'Cj5r-B8kK3ilWOkBS',
  SERVICE_ID: 'service_x0yag93',
  TEMPLATE_ID: 'template_cqtnzgy'
};

// Initialize EmailJS if available
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitButton = this.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, this)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showNotification('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        contactForm.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }, function(error) {
        console.log('FAILED...', error);
        showNotification("Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement par téléphone.", 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  });
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = 'notification notification-' + type;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <p>${message}</p>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}