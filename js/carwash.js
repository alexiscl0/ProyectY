const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animaciones de scroll
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observar secciones
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-up');
    observer.observe(section);
});

// Observar items de servicios individualmente
document.querySelectorAll('.servicio_item').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Observar paquetes individualmente
document.querySelectorAll('.paquete').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.15}s`;
    observer.observe(item);
});

// Observar beneficios
document.querySelectorAll('.beneficio_item').forEach((item, index) => {
    item.classList.add('fade-up');
    item.style.animationDelay = `${index * 0.1}s`;
    observer.observe(item);
});

// Contador animado en sección de estadísticas
const estadisticasSection = document.querySelector('#estadisticas');
let estadisticasAnimated = false;

const estadisticasObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !estadisticasAnimated) {
            animateestadisticas();
            estadisticasAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (estadisticasSection) {
    estadisticasObserver.observe(estadisticasSection);
}

function animateestadisticas() {
    const statNumbers = document.querySelectorAll('.stat_number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}


// efecto 3d en las cards de servicios
document.querySelectorAll('.servicio_item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

//efecto 3d en las cards de paquetes
document.querySelectorAll('.paquete').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        if (card.classList.contains('destacado')) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05) translateY(-15px)`;
        } else {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('destacado')) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1.05)';
        } else {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        }
    });
});

// Particulas de fondo
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            background: rgba(0, 212, 255, 0.8);
            border-radius: 50%;
            animation: float-particle linear infinite;
        `;
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Cursor personalizado
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
cursor.style.cssText = `
    width: 10px;
    height: 10px;
    border: 2px solid #00d4ff;
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.2s ease;
`;
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'custom-cursor-follower';
cursorFollower.style.cssText = `
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 212, 255, 0.5);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.3s ease;
`;
document.body.appendChild(cursorFollower);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Efecto al hacer hover en elementos clicables
document.querySelectorAll('a, button, .btn_reservar, .btn_register, .btn_paquete').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.backgroundColor = 'rgba(0, 212, 255, 0.3)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.backgroundColor = 'transparent';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Scroll de Progreso
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0088ff, #00d4ff);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
});
