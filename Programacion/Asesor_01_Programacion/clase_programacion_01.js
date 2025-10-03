// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Página de Clase - Inicializando...');
  
  // Calcular altura real de la navbar PRIMERO
  const navbarHeight = document.querySelector('.navbar').offsetHeight;
  document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);
  
  // Inicializar sistema de asesores PRIMERO para cargar datos
  inicializarSistemaAsesores();
  
  // Luego inicializar todos los controladores
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
            document.body.style.overflow = '';
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
      '.clase-header, .experiencia-card, .soporte-card, .sala-principal, .alternativas-conexion'
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
    // Efectos hover para elementos interactivos
    const interactiveElements = document.querySelectorAll('.meta-item, .requisito-item');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-3px)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    });
  }
}

// Countdown para la clase - AHORA GLOBAL
class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = targetDate;
    this.countdownElement = document.getElementById('countdown');
    this.intervalId = null;
    
    this.init();
  }
  
  init() {
    if (this.countdownElement) {
      this.updateCountdown();
      this.intervalId = setInterval(() => this.updateCountdown(), 1000);
      console.log('🎯 CountdownTimer inicializado');
    }
  }
  
  updateCountdown() {
    const now = new Date();
    const timeDifference = this.targetDate - now;
    
    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
      
      if (days > 0) {
        this.countdownElement.innerHTML = `
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Días</span>
          <span class="countdown-number">${hours}</span>
          <span class="countdown-label">Horas</span>
        `;
      } else {
        this.countdownElement.innerHTML = `
          <span class="countdown-number">${hours.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Horas</span>
          <span class="countdown-number">${minutes.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Minutos</span>
          <span class="countdown-number">${seconds.toString().padStart(2, '0')}</span>
          <span class="countdown-label">Segundos</span>
        `;
      }
      
      // Efecto visual cuando faltan menos de 10 minutos
      if (hours === 0 && minutes < 10) {
        this.countdownElement.style.color = '#ff6b6b';
        this.countdownElement.style.animation = 'pulse 1s infinite';
      } else {
        this.countdownElement.style.color = '';
        this.countdownElement.style.animation = 'none';
      }
    } else {
      this.countdownElement.innerHTML = `
        <span class="countdown-number">¡AHORA!</span>
      `;
      this.countdownElement.style.color = '#51cf66';
      this.countdownElement.style.animation = 'none';
      
      // Detener el intervalo cuando la clase ya empezó
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }
  
  // Método para actualizar la fecha objetivo
  actualizarFecha(nuevaFecha) {
    this.targetDate = nuevaFecha;
    
    // Reiniciar el intervalo si estaba detenido
    if (!this.intervalId) {
      this.intervalId = setInterval(() => this.updateCountdown(), 1000);
    }
    
    this.updateCountdown();
  }
  
  // Método para detener el countdown
  detener() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Variable global para el countdown
let countdownTimer = null;

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
    
    // Efecto de aparición retardada (SOLO EL BOTÓN, SIN NOTIFICACIÓN)
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
    
    // Cerrar menú al hacer click en un link
    const navLinks = this.navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
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

// Efectos adicionales para mejorar la experiencia
class EnhancedEffects {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupInteractiveElements();
    console.log('🎯 EnhancedEffects inicializado');
  }
  
  setupInteractiveElements() {
    // Efecto de confeti para botones importantes
    const joinButton = document.querySelector('.btn-join');
    if (joinButton) {
      joinButton.addEventListener('click', (e) => {
        if (!e.target.href.includes('#')) {
          this.createConfettiEffect();
        }
      });
    }
  }
  
  createConfettiEffect() {
    const confettiCount = 50;
    const colors = ['#ff6b6b', '#51cf66', '#ffd43b', '#339af0', '#cc5de8'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        top: 50%;
        left: 50%;
        opacity: 1;
        pointer-events: none;
        z-index: 10000;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      `;
      
      document.body.appendChild(confetti);
      
      // Animación
      const angle = Math.random() * Math.PI * 2;
      const velocity = 30 + Math.random() * 30;
      const rotation = Math.random() * 360;
      
      confetti.animate([
        {
          transform: `translate(-50%, -50%) rotate(0deg)`,
          opacity: 1
        },
        {
          transform: `translate(
            ${Math.cos(angle) * velocity}vw,
            ${Math.sin(angle) * velocity}vh
          ) rotate(${rotation}deg)`,
          opacity: 0
        }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      }).onfinish = () => {
        confetti.remove();
      };
    }
  }
}

// =============================================
// SISTEMA DE ASESORES - CONFIGURACIÓN MEJORADA
// =============================================
//==========================================================================================
// Credenciales de acceso
const CREDENCIALES_ASESORES = {
    usuario: "programacion_01",
    password: "prog123@"
};

// Clave para almacenamiento
const STORAGE_KEY = "datos_clase_asesoria_programacion_01";

// Datos por defecto de la clase
const DATOS_CLASE_DEFAULT = {
    titulo: "Programación Avanzada",
    tema: "Desarrollo Web Full Stack",
    subtitulo: "Sesión intensiva de desarrollo web con JavaScript, React y Node.js",
    fecha: "2025-10-11",
    horaInicio: "15:00",
    horaFin: "16:00",
    link: "https://meet.google.com"
};
//============================================================================================================
// Inicializar sistema de asesores
function inicializarSistemaAsesores() {
    // Configurar botón de acceso para asesores
    const btnAccesoAsesores = document.getElementById('btnAccesoAsesores');
    if (btnAccesoAsesores) {
        btnAccesoAsesores.addEventListener('click', function() {
            mostrarModalLogin();
        });
    }
    
    // Cargar datos guardados o usar los por defecto
    cargarDatosClase();
    
    // Configurar eventos para vista previa en tiempo real
    configurarVistaPrevia();
    
    console.log('🎯 Sistema de Asesores inicializado');
}

// Configurar eventos para vista previa en tiempo real
function configurarVistaPrevia() {
    const inputs = [
        'configTitulo', 'configTema', 'configSubtitulo', 
        'configFecha', 'configHoraInicio', 'configHoraFin', 'configEnlace'
    ];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', actualizarVistaPrevia);
            input.addEventListener('change', actualizarVistaPrevia);
        }
    });
}

// Actualizar vista previa en tiempo real
function actualizarVistaPrevia() {
    const titulo = document.getElementById('configTitulo').value;
    const tema = document.getElementById('configTema').value;
    const subtitulo = document.getElementById('configSubtitulo').value;
    const fecha = document.getElementById('configFecha').value;
    const horaInicio = document.getElementById('configHoraInicio').value;
    const horaFin = document.getElementById('configHoraFin').value;
    const enlace = document.getElementById('configEnlace').value;
    
    // Actualizar vista previa
    document.getElementById('previewTitulo').textContent = titulo || '-';
    document.getElementById('previewTema').textContent = tema || '-';
    document.getElementById('previewFecha').textContent = fecha ? formatearFecha(fecha) : '-';
    document.getElementById('previewHorario').textContent = (horaInicio && horaFin) ? `${formatearHora(horaInicio)} - ${formatearHora(horaFin)}` : '-';
    document.getElementById('previewEnlace').textContent = enlace || '-';
    
    // Validación visual mejorada
    const inputs = document.querySelectorAll('.config-input');
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Validar horario
    if (horaInicio && horaFin && horaInicio >= horaFin) {
        document.getElementById('configHoraInicio').style.borderColor = '#dc3545';
        document.getElementById('configHoraFin').style.borderColor = '#dc3545';
    }
}

// Función auxiliar para formatear hora
function formatearHora(hora) {
    if (!hora) return '-';
    const [horas, minutos] = hora.split(':');
    return `${horas}:${minutos}`;
}

// Cargar datos de la clase
function cargarDatosClase() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    const datosClase = datosGuardados ? JSON.parse(datosGuardados) : DATOS_CLASE_DEFAULT;
    
    // Actualizar la página con los datos
    actualizarInterfazConDatos(datosClase);
    
    // Inicializar el countdown con los datos cargados
    inicializarCountdown(datosClase.fecha, datosClase.horaInicio);
}

// Inicializar countdown con fecha y hora específicas
function inicializarCountdown(fecha, hora) {
    const targetDate = new Date(`${fecha}T${hora}:00`);
    
    // Validar que la fecha sea válida
    if (isNaN(targetDate.getTime())) {
        console.error('❌ Fecha u hora inválidas para el countdown');
        mostrarNotificacion('Error: La fecha u hora configurada no es válida', 'error');
        return;
    }
    
    // Detener countdown anterior si existe
    if (countdownTimer) {
        countdownTimer.detener();
    }
    
    // Crear nuevo countdown
    countdownTimer = new CountdownTimer(targetDate);
}

// Actualizar la interfaz con los datos de la clase
function actualizarInterfazConDatos(datos) {
    // Formatear fecha para mostrar
    const fechaFormateada = formatearFecha(datos.fecha);
    const horarioFormateado = `${datos.horaInicio} - ${datos.horaFin}`;
    
    // Actualizar hero section
    const heroTitulo = document.getElementById('heroTitulo');
    if (heroTitulo) {
        heroTitulo.textContent = datos.titulo;
    }
    
    const heroSubtitulo = document.getElementById('heroSubtitulo');
    if (heroSubtitulo) {
        heroSubtitulo.textContent = datos.subtitulo;
    }
    
    // Actualizar tema de la clase
    const claseTema = document.getElementById('claseTema');
    if (claseTema) {
        claseTema.textContent = datos.tema;
    }
    
    // Actualizar fecha
    const fechaElement = document.getElementById('fecha-clase');
    if (fechaElement) {
        fechaElement.textContent = fechaFormateada;
    }
    
    // Actualizar horario
    const horarioElement = document.getElementById('horario-clase');
    if (horarioElement) {
        horarioElement.textContent = horarioFormateado;
    }
    
    // Actualizar link
    const linkElement = document.getElementById('link-clase');
    if (linkElement) {
        linkElement.href = datos.link;
    }
    
    // Actualizar countdown
    inicializarCountdown(datos.fecha, datos.horaInicio);
}

// Formatear fecha de YYYY-MM-DD a DD MMM YYYY en español
function formatearFecha(fechaISO) {
    // Asegurarnos de que la fecha se interprete correctamente
    const [año, mes, dia] = fechaISO.split('-');
    const fecha = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11
    
    if (isNaN(fecha.getTime())) {
        return 'Fecha inválida';
    }
    
    // Mapeo de meses en español
    const meses = [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    
    const diaFormateado = fecha.getDate();
    const mesFormateado = meses[fecha.getMonth()];
    const añoFormateado = fecha.getFullYear();
    
    return `${diaFormateado} ${mesFormateado} ${añoFormateado}`;
}

// Función para mostrar modal de login
function mostrarModalLogin() {
    const modal = document.getElementById('modalLogin');
    modal.style.display = 'block';
    
    // Enfocar el primer campo
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

// Función para mostrar modal de configuración
function mostrarModalConfiguracion() {
    const modal = document.getElementById('modalConfiguracion');
    cargarFormularioConfiguracion();
    actualizarVistaPrevia();
    modal.style.display = 'block';
    
    console.log('📋 Modal de configuración abierto');
}

// Función para cerrar modal
function cerrarModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Limpiar campos del login
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
    
    // Remover estilos de validación
    const inputs = document.querySelectorAll('.config-input');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Función de inicio de sesión
function iniciarSesion() {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    
    if (!usuario || !password) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (usuario === CREDENCIALES_ASESORES.usuario && password === CREDENCIALES_ASESORES.password) {
        localStorage.setItem('sesion_asesor', 'activa');
        cerrarModal();
        mostrarModalConfiguracion();
        mostrarNotificacion('Sesión iniciada correctamente', 'success');
    } else {
        mostrarNotificacion('Usuario o contraseña incorrectos', 'error');
        
        // Efecto de shake en los inputs
        const inputs = document.querySelectorAll('#modalLogin .config-input');
        inputs.forEach(input => {
            input.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        });
    }
}

// Cargar datos actuales en el formulario de configuración
function cargarFormularioConfiguracion() {
    const datosGuardados = localStorage.getItem(STORAGE_KEY);
    const datosClase = datosGuardados ? JSON.parse(datosGuardados) : DATOS_CLASE_DEFAULT;
    
    document.getElementById('configTitulo').value = datosClase.titulo;
    document.getElementById('configTema').value = datosClase.tema;
    document.getElementById('configSubtitulo').value = datosClase.subtitulo;
    document.getElementById('configFecha').value = datosClase.fecha;
    document.getElementById('configHoraInicio').value = datosClase.horaInicio;
    document.getElementById('configHoraFin').value = datosClase.horaFin;
    document.getElementById('configEnlace').value = datosClase.link;
}

// Función para guardar configuración
function guardarConfiguracion() {
    const titulo = document.getElementById('configTitulo').value;
    const tema = document.getElementById('configTema').value;
    const subtitulo = document.getElementById('configSubtitulo').value;
    const fecha = document.getElementById('configFecha').value;
    const horaInicio = document.getElementById('configHoraInicio').value;
    const horaFin = document.getElementById('configHoraFin').value;
    const enlace = document.getElementById('configEnlace').value;
    
    // Validar campos obligatorios
    if (!titulo || !tema || !subtitulo || !fecha || !horaInicio || !horaFin || !enlace) {
        mostrarNotificacion('Por favor completa todos los campos', 'error');
        validarCamposConfiguracion();
        return;
    }
    
    // Validar URL
    if (!validarURL(enlace)) {
        mostrarNotificacion('Por favor ingresa un enlace válido (debe comenzar con http:// o https://)', 'error');
        document.getElementById('configEnlace').style.borderColor = '#dc3545';
        return;
    }
    
    // Validar horario
    if (horaInicio >= horaFin) {
        mostrarNotificacion('La hora de fin debe ser posterior a la hora de inicio', 'error');
        document.getElementById('configHoraInicio').style.borderColor = '#dc3545';
        document.getElementById('configHoraFin').style.borderColor = '#dc3545';
        return;
    }
    
    // Validar que la fecha no sea en el pasado
    const fechaClase = new Date(`${fecha}T${horaInicio}`);
    const ahora = new Date();
    if (fechaClase < ahora) {
        if (!confirm('⚠️ La fecha y hora seleccionadas están en el pasado. ¿Estás seguro de que quieres guardar estos datos?')) {
            return;
        }
    }
    
    const nuevosDatos = {
        titulo: titulo,
        tema: tema,
        subtitulo: subtitulo,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin,
        link: enlace
    };
    
    // Guardar en localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosDatos));
    
    // Actualizar la interfaz
    actualizarInterfazConDatos(nuevosDatos);
    
    mostrarNotificacion('✅ Configuración guardada correctamente. La página se ha actualizado.', 'success');
    
    // Efecto visual de confirmación
    const saveButton = document.querySelector('#modalConfiguracion .btn-primary');
    const originalText = saveButton.innerHTML;
    saveButton.innerHTML = '<i class="fas fa-check"></i> ¡Guardado!';
    saveButton.style.background = '#51cf66';
    
    setTimeout(() => {
        saveButton.innerHTML = originalText;
        saveButton.style.background = '';
    }, 2000);
    
    // Cerrar modal después de guardar
    setTimeout(() => {
        cerrarModal();
    }, 2000);
}

// Función para resetear configuración
function resetearConfiguracion() {
    if (confirm('¿Estás seguro de que quieres restablecer la configuración a los valores por defecto?')) {
        // Restaurar valores por defecto
        document.getElementById('configTitulo').value = DATOS_CLASE_DEFAULT.titulo;
        document.getElementById('configTema').value = DATOS_CLASE_DEFAULT.tema;
        document.getElementById('configSubtitulo').value = DATOS_CLASE_DEFAULT.subtitulo;
        document.getElementById('configFecha').value = DATOS_CLASE_DEFAULT.fecha;
        document.getElementById('configHoraInicio').value = DATOS_CLASE_DEFAULT.horaInicio;
        document.getElementById('configHoraFin').value = DATOS_CLASE_DEFAULT.horaFin;
        document.getElementById('configEnlace').value = DATOS_CLASE_DEFAULT.link;
        
        actualizarVistaPrevia();
        
        mostrarNotificacion('Configuración restablecida a los valores por defecto', 'info');
    }
}

// Función para validar campos de configuración
function validarCamposConfiguracion() {
    const inputs = document.querySelectorAll('#modalConfiguracion .config-input');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#dc3545';
            input.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }
    });
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('sesion_asesor');
    cerrarModal();
    mostrarNotificacion('Sesión cerrada correctamente', 'info');
}

// Validar URLs
function validarURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(notif => notif.remove());
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'exclamation-triangle' : 'info'}"></i>
        <span>${mensaje}</span>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notificacion.parentNode) {
                    notificacion.parentNode.removeChild(notificacion);
                }
            }, 300);
        }
    }, 5000);
}

// Cerrar modal al hacer click fuera
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            cerrarModal();
        }
    });
});

// Manejar tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModal();
    }
});

// Inicializar efectos mejorados
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedEffects();
});

// Manejo de errores global
window.addEventListener('error', (e) => {
    console.error('❌ Error global capturado:', e.error);
});

console.log('✨ Página de Clase cargada correctamente');