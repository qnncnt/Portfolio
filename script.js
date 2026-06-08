document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const revealItems = document.querySelectorAll('.reveal');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const designModal = document.getElementById('designModal');
  const designModalImage = document.getElementById('designModalImage');
  const previewButtons = document.querySelectorAll('.design-preview, .project-media');
  const typingText = document.getElementById('typingText');
  const typingRoles = [
    'Computer Science Graduate',
    'Graphic Designer',
    'Aspiring Web Developer',
    'Responsive Web Designer'
  ];

  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  body.dataset.theme = savedTheme || (prefersDark ? 'dark' : 'light');

  const updateThemeLabel = () => {
    const isDark = body.dataset.theme === 'dark';
    themeToggle.textContent = isDark ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
  };

  updateThemeLabel();

  themeToggle.addEventListener('click', () => {
    body.dataset.theme = body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', body.dataset.theme);
    updateThemeLabel();
  });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav') && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, {
    rootMargin: '-38% 0px -52% 0px',
    threshold: 0
  });

  sections.forEach((section) => activeObserver.observe(section));

  if (typingText) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      typingText.textContent = typingRoles[0];
    } else {
      let roleIndex = 0;
      let characterIndex = 0;
      let isDeleting = false;

      const typeNextFrame = () => {
        const currentRole = typingRoles[roleIndex];
        const nextCharacterIndex = isDeleting ? characterIndex - 1 : characterIndex + 1;
        typingText.textContent = currentRole.slice(0, nextCharacterIndex);
        characterIndex = nextCharacterIndex;

        let delay = isDeleting ? 34 : 58;

        if (!isDeleting && characterIndex === currentRole.length) {
          delay = 1350;
          isDeleting = true;
        }

        if (isDeleting && characterIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % typingRoles.length;
          delay = 280;
        }

        window.setTimeout(typeNextFrame, delay);
      };

      typeNextFrame();
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formNote.textContent = 'Thanks for reaching out. Connect this form to an email service when you are ready.';
      contactForm.reset();
    });
  }

  if (designModal && previewButtons.length) {
    let lastFocusedElement = null;

    const closeDesignModal = () => {
      designModal.classList.remove('open');
      designModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    };

    previewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const image = button.querySelector('img');
        if (!image) return;

        lastFocusedElement = document.activeElement;
        designModalImage.src = image.src;
        designModalImage.alt = image.alt || 'Expanded design preview';
        designModal.classList.add('open');
        designModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        designModal.querySelector('.design-modal-close').focus();
      });
    });

    designModal.addEventListener('click', (event) => {
      if (event.target.matches('[data-close-design]')) {
        closeDesignModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && designModal.classList.contains('open')) {
        closeDesignModal();
      }
    });
  }
});
