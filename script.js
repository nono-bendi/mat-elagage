document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".testimonial-slide");
  let currentIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  if (slides.length > 0) {
    showSlide(currentIndex); // Affiche le premier
    setInterval(nextSlide, 3500); // Change toutes les .. sec
  }
});

const elementsToAnimate = document.querySelectorAll(
  '.service, .reason, .realisations img, .contact-section, .pricing-section, .about, .why-choose-us, .engagement, .testimonial-slide'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

elementsToAnimate.forEach((el) => observer.observe(el));

document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  if (!burger || !navLinks) return;

  // Toggle menu au clic sur le bouton
  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    navLinks.classList.toggle('show');
  });

  // Ferme si clic en dehors du menu ou du bouton
  document.addEventListener('click', function (e) {
    if (
      !navLinks.contains(e.target) &&
      !burger.contains(e.target) &&
      navLinks.classList.contains('show')
    ) {
      navLinks.classList.remove('show');
    }
  });

  // Ferme aussi le menu quand on clique sur un lien
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
});
