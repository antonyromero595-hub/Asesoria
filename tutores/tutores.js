// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Tutores - Inicializando...');
  
  // Calcular altura real de la navbar PRIMERO
  const navbarHeight = document.querySelector('.navbar').offsetHeight;
  document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  
  // Inicializar todos los controladores
  new NavbarController();
  new ScrollAnimations();
  new FloatingElementsController();
  new MenuMobileController();
  
  console.log('✅ Todos los módulos inicializados correctamente');
});

// Control de la navbar dinámica
class NavbarController {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.lastScrollY = window.scrollY;
    this.scrollThreshold = 100;
    this.isAtTop = true;
    this.scrollDirection = 'down';
    
    this.init();
  }
  
  init() {
    // Evento de scroll con throttling
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
    
    // Evento para mostrar al poner cursor en la parte superior
    document.addEventListener('mousemove', this.throttle(this.handleMouseMove.bind(this), 200));
    
    // Mostrar navbar al cargar la página
    this.navbar.classList.add('visible');
    
    // Smooth scroll para enlaces de navegación
    this.setupSmoothScroll();
    
    // Efecto de scroll en navbar
    this.setupScrollEffect();
    
    console.log('🎯 NavbarController inicializado');
  }
  
  handleScroll() {
    const currentScrollY = window.scrollY;
    this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
    
    // Verificar si estamos en la parte superior
    this.isAtTop = currentScrollY < 50;
    
    if (this.isAtTop) {
      this.showNavbar();
      this.navbar.classList.remove('scrolled');
    } else {
      this.navbar.classList.add('scrolled');
      
      if (this.scrollDirection === 'down' && currentScrollY > this.scrollThreshold) {
        this.hideNavbar();
      } else if (this.scrollDirection === 'up') {
        this.showNavbar();
      }
    }
    
    this.lastScrollY = currentScrollY;
  }
  
  handleMouseMove(e) {
    if (e.clientY < 100 && !this.isAtTop) {
      this.showNavbar();
      this.navbar.classList.add('top-hover');
      
      // Remover la clase después de un tiempo
      setTimeout(() => {
        this.navbar.classList.remove('top-hover');
      }, 2000);
    }
  }
  
  hideNavbar() {
    if (!this.navbar.classList.contains('hidden')) {
      this.navbar.classList.remove('visible', 'top-hover');
      this.navbar.classList.add('hidden');
    }
  }
  
  showNavbar() {
    if (!this.navbar.classList.contains('visible')) {
      this.navbar.classList.remove('hidden');
      this.navbar.classList.add('visible');
    }
  }
  
  setupSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - this.navbar.offsetHeight;
          
          // Cerrar menú móvil si está abierto
          const navToggle = document.querySelector('.nav-toggle');
          const navMenu = document.querySelector('.nav-menu');
          if (navToggle && navToggle.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
          }
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  setupScrollEffect() {
    // Efecto de reducción de padding al hacer scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    });
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Animaciones generales al hacer scroll
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll(
      '.beneficio-card, .requisito-card, .impacto-card'
    );
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      this.animateAll();
    }
    
    this.setupHoverEffects();
    
    console.log('🎯 ScrollAnimations inicializado');
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    
    this.animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0) scale(1)';
    element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Agregar clase para tracking
    element.classList.add('animated-in');
  }
  
  animateAll() {
    this.animatedElements.forEach((el, index) => {
      setTimeout(() => {
        this.animateElement(el);
      }, index * 150);
    });
  }
  
  setupHoverEffects() {
    // Efectos hover para botones
    const buttons = document.querySelectorAll('.btn-hero, .btn-whatsapp');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      button.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// Controlador de elementos flotantes (WhatsApp y Back to Top)
class FloatingElementsController {
  constructor() {
    this.backToTopBtn = document.getElementById('backToTop');
    this.whatsappFloat = document.querySelector('.whatsapp-float');
    
    this.init();
  }
  
  init() {
    this.setupBackToTop();
    this.setupWhatsAppFloat();
    console.log('🎯 FloatingElementsController inicializado');
  }
  
  setupBackToTop() {
    if (!this.backToTopBtn) return;
    
    // Mostrar/ocultar botón basado en scroll
    window.addEventListener('scroll', this.throttle(() => {
      if (window.pageYOffset > 300) {
        this.backToTopBtn.classList.add('visible');
      } else {
        this.backToTopBtn.classList.remove('visible');
      }
    }, 100));
    
    // Scroll suave al hacer click
    this.backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  setupWhatsAppFloat() {
    if (!this.whatsappFloat) return;
    
    // Efecto de aparición retardada
    setTimeout(() => {
      this.whatsappFloat.style.opacity = '0';
      this.whatsappFloat.style.display = 'block';
      
      setTimeout(() => {
        this.whatsappFloat.style.transition = 'opacity 0.5s ease';
        this.whatsappFloat.style.opacity = '1';
      }, 100);
    }, 2000);
  }
  
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }
}

// Controlador de menú móvil
class MenuMobileController {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    if (this.navToggle && this.navMenu) {
      this.setupMobileMenu();
      console.log('🎯 MenuMobileController inicializado');
    }
  }
  
  setupMobileMenu() {
    this.navToggle.addEventListener('click', () => {
      this.toggleMenu();
    });
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.navToggle.contains(e.target) && 
          !this.navMenu.contains(e.target)) {
        this.closeMenu();
      }
    });
    
    // Cerrar menú al redimensionar (si se cambia a desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }
  
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
  
  openMenu() {
    this.navToggle.classList.add('active');
    this.navMenu.classList.add('active');
    this.isOpen = true;
    
    // Agregar overlay
    this.createOverlay();
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }
  
  closeMenu() {
    this.navToggle.classList.remove('active');
    this.navMenu.classList.remove('active');
    this.isOpen = false;
    
    // Remover overlay
    this.removeOverlay();
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
  }
  
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    `;
    
    overlay.addEventListener('click', () => this.closeMenu());
    document.body.appendChild(overlay);
  }
  
  removeOverlay() {
    const overlay = document.querySelector('.nav-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// Manejo de errores global
window.addEventListener('error', (e) => {
  console.error('❌ Error global capturado:', e.error);
});

console.log('✨ Página de Tutores cargada correctamente');