// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Asesoría Académica - Inicializando...');
  
  // Calcular altura real de la navbar PRIMERO
  const navbarHeight = document.querySelector('.navbar').offsetHeight;
  document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  
  // Inicializar todos los controladores
  new NavbarController();
  new ScrollAnimations();
  new ServiciosAnimations();
  new TutoresAnimations();
  new InfoFloatingAnimations();
  new FloatingElementsController();
  new MenuMobileController();
  new PerformanceOptimizer();
  
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
    this.scrolling = false;
    
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
      '.curso-card, .faq-item, .tutores-benefits li, .info-item, .benefit-icon'
    );
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    this.animationCount = 0;
    
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    } else {
      this.animateAll();
    }
    
    this.setupHoverEffects();
    this.setupScrollProgress();
    
    console.log(`🎯 ScrollAnimations inicializado - ${this.animatedElements.length} elementos a animar`);
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          observer.unobserve(entry.target);
          this.animationCount++;
        }
      });
    }, this.observerOptions);
    
    this.animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
  
  animateElement(element) {
    // Retraso basado en la posición del elemento
    const delay = Array.from(this.animatedElements).indexOf(element) * 100;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) scale(1)';
      element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      
      // Agregar clase para tracking
      element.classList.add('animated-in');
    }, delay);
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
    const buttons = document.querySelectorAll('.btn-servicios, .curso-btn, .btn-tutores-moderno, .cta-button');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
        e.target.style.transform = 'translateY(-3px) scale(1.05)';
      });
      
      button.addEventListener('mouseleave', (e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
      });
      
      // Efecto de ripple
      button.addEventListener('click', (e) => {
        this.createRippleEffect(e);
      });
    });
    
    // Efectos hover para cards
    const cards = document.querySelectorAll('.curso-card, .tutores-card-moderno, .info-floating-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Efectos hover para items de info flotante
    const infoItems = document.querySelectorAll('.info-item');
    
    infoItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
      });
      
      item.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      });
    });
  }
  
  createRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.querySelector('.ripple');
    if (ripple) {
      ripple.remove();
    }
    
    button.appendChild(circle);
    
    // Remover después de la animación
    setTimeout(() => {
      circle.remove();
    }, 600);
  }
  
  setupScrollProgress() {
    // Podría implementarse una barra de progreso de scroll aquí
  }
}

// Animaciones específicas para la sección de servicios
class ServiciosAnimations {
  constructor() {
    this.serviciosSection = document.querySelector('.servicios-diagonal');
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    if (this.serviciosSection) {
      this.setupServiciosAnimations();
      console.log('🎯 ServiciosAnimations inicializado');
    }
  }
  
  setupServiciosAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateServiciosContent();
          this.hasAnimated = true;
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(this.serviciosSection);
  }
  
  animateServiciosContent() {
    const serviciosContent = this.serviciosSection.querySelector('.servicios-content');
    const serviciosImagen = this.serviciosSection.querySelector('.servicios-imagen');
    
    if (serviciosContent) {
      serviciosContent.style.opacity = '0';
      serviciosContent.style.transform = 'translateX(50px)';
      
      setTimeout(() => {
        serviciosContent.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        serviciosContent.style.opacity = '1';
        serviciosContent.style.transform = 'translateX(0)';
      }, 300);
    }
    
    if (serviciosImagen) {
      serviciosImagen.style.opacity = '0';
      serviciosImagen.style.transform = 'scale(1.1)';
      
      setTimeout(() => {
        serviciosImagen.style.transition = 'all 1s ease';
        serviciosImagen.style.opacity = '1';
        serviciosImagen.style.transform = 'scale(1)';
      }, 600);
    }
  }
}

// Animaciones específicas para la sección de tutores
class TutoresAnimations {
  constructor() {
    this.tutoresSection = document.querySelector('.tutores-moderno');
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    if (this.tutoresSection) {
      this.setupTutoresAnimations();
      console.log('🎯 TutoresAnimations inicializado');
    }
  }
  
  setupTutoresAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateTutoresContent();
          this.hasAnimated = true;
        }
      });
    }, { 
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(this.tutoresSection);
  }
  
  animateTutoresContent() {
    const leftContent = this.tutoresSection.querySelector('.tutores-content-left');
    const rightCard = this.tutoresSection.querySelector('.tutores-card-moderno');
    const benefits = this.tutoresSection.querySelectorAll('.tutores-benefits li');
    
    // Animación contenido izquierdo
    if (leftContent) {
      leftContent.style.opacity = '0';
      leftContent.style.transform = 'translateX(-50px)';
      
      setTimeout(() => {
        leftContent.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        leftContent.style.opacity = '1';
        leftContent.style.transform = 'translateX(0)';
      }, 300);
    }
    
    // Animación tarjeta derecha
    if (rightCard) {
      rightCard.style.opacity = '0';
      rightCard.style.transform = 'translateX(50px) rotateY(10deg)';
      
      setTimeout(() => {
        rightCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        rightCard.style.opacity = '1';
        rightCard.style.transform = 'translateX(0) rotateY(0)';
      }, 500);
    }
    
    // Animación escalonada de beneficios
    benefits.forEach((benefit, index) => {
      benefit.style.opacity = '0';
      benefit.style.transform = 'translateX(30px)';
      
      setTimeout(() => {
        benefit.style.transition = 'all 0.5s ease';
        benefit.style.opacity = '1';
        benefit.style.transform = 'translateX(0)';
      }, 700 + (index * 100));
    });
  }
}

// Animaciones específicas para el bloque informativo flotante
class InfoFloatingAnimations {
  constructor() {
    this.infoFloating = document.querySelector('.info-block-floating');
    this.hasAnimated = false;
    
    this.init();
  }
  
  init() {
    if (this.infoFloating) {
      this.setupFloatingAnimations();
      console.log('🎯 InfoFloatingAnimations inicializado');
    }
  }
  
  setupFloatingAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateFloatingCard();
          this.hasAnimated = true;
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '-50px 0px' 
    });
    
    observer.observe(this.infoFloating);
  }
  
  animateFloatingCard() {
    const card = this.infoFloating.querySelector('.info-floating-card');
    const items = this.infoFloating.querySelectorAll('.info-item');
    
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px) scale(0.98)';
      
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, 150);
    }
    
    // Animación escalonada más rápida para los items
    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(15px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, 300 + (index * 80));
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
    
    // Efecto de vibración ocasional
    this.setupOccasionalShake();
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
    
    // Tracking de clicks (podría integrarse con Google Analytics)
    const whatsappLink = this.whatsappFloat.querySelector('a');
    if (whatsappLink) {
      whatsappLink.addEventListener('click', () => {
        console.log('📞 Click en WhatsApp flotante');
        // Aquí podrías agregar tracking de eventos
      });
    }
  }
  
  setupOccasionalShake() {
    // Hacer vibrar el botón ocasionalmente para llamar la atención
    setInterval(() => {
      if (this.backToTopBtn.classList.contains('visible') && Math.random() > 0.7) {
        this.backToTopBtn.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          this.backToTopBtn.style.animation = '';
        }, 500);
      }
    }, 30000); // Cada 30 segundos
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
    
    // Prevenir scroll cuando el menú está abierto
    this.navMenu.addEventListener('touchmove', (e) => {
      if (this.isOpen) {
        e.preventDefault();
      }
    }, { passive: false });
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

// Optimizador de rendimiento
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupLazyLoading();
    this.setupPerformanceMonitoring();
    this.preventFOUC();
    console.log('🎯 PerformanceOptimizer inicializado');
  }
  
  setupLazyLoading() {
    // Lazy loading para imágenes fuera del viewport
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[data-src]');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
  
  setupPerformanceMonitoring() {
    // Monitorear performance (podría integrarse con analytics)
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`📊 Tiempo de carga: ${loadTime}ms`);
      
      if (loadTime > 3000) {
        console.warn('⚠️  Tiempo de carga elevado, considerar optimizaciones');
      }
    });
    
    // Monitorear cambios de visibilidad (para pausar animaciones cuando no es visible)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('🔍 Página en segundo plano');
      } else {
        console.log('🔍 Página en primer plano');
      }
    });
  }
  
  preventFOUC() {
    // Prevenir Flash of Unstyled Content
    document.documentElement.style.visibility = 'hidden';
    
    window.addEventListener('load', () => {
      document.documentElement.style.visibility = 'visible';
    });
    
    // Fallback si load nunca se dispara
    setTimeout(() => {
      document.documentElement.style.visibility = 'visible';
    }, 3000);
  }
}

// Utilitarios globales
class AppUtils {
  static debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  
  static isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  static getScrollPercentage() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    return (scrollTop) / (docHeight - winHeight) * 100;
  }
}

// Manejo de errores global
window.addEventListener('error', (e) => {
  console.error('❌ Error global capturado:', e.error);
});

// Exportar para uso global (si es necesario)
window.AppControllers = {
  NavbarController,
  ScrollAnimations,
  ServiciosAnimations,
  TutoresAnimations,
  InfoFloatingAnimations,
  FloatingElementsController,
  MenuMobileController,
  PerformanceOptimizer,
  AppUtils
};

console.log('✨ Aplicación de Asesoría Académica cargada correctamente');