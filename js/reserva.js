let currentStep = 1;
const totalSteps = 4;
let reservaData = {
    paquete: '',
    precio: 0,
    fecha: '',
    hora: '',
    nombre: '',
    telefono: '',
    email: '',
    vehiculo: '',
    modelo: '',
    comentarios: ''
};

// Elementos del DOM
const form = document.getElementById('reservaForm');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnSubmit = document.getElementById('btnSubmit');
const modalSuccess = document.getElementById('modalSuccess');

// Patículas de fondo
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-bg';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Navegación entre pasos
function showStep(step) {
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    updateProgressBar(step);
    updateButtons(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar(step) {
    document.querySelectorAll('.puntos_de_progreso').forEach((s, index) => {
        const stepNumber = index + 1;
        s.classList.remove('active', 'completed');
        
        if (stepNumber < step) {
            s.classList.add('completed');
        } else if (stepNumber === step) {
            s.classList.add('active');
        }
    });

    document.querySelectorAll('.linea_de_progreso').forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

function updateButtons(step) {
    if (step === 1) {
        btnPrev.style.display = 'none';
    } else {
        btnPrev.style.display = 'flex';
    }
    if (step === totalSteps) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'flex';
    } else {
        btnNext.style.display = 'flex';
        btnSubmit.style.display = 'none';
    }
}

// Selección de Paquete
document.querySelectorAll('.paquete-card').forEach(card => {
    const btnSeleccionar = card.querySelector('.btn-seleccionar');
    
    btnSeleccionar.addEventListener('click', function(e) {
        e.stopPropagation();
        selectPaquete(card);
    });

    card.addEventListener('click', function() {
        selectPaquete(card);
    });
});

function selectPaquete(card) {
    document.querySelectorAll('.paquete-card').forEach(c => {
        c.classList.remove('selected');
    });
    card.classList.add('selected');

    reservaData.paquete = card.dataset.paquete;
    reservaData.precio = parseInt(card.dataset.precio);

    btnNext.disabled = false;
}

// Fecha y Hora
const fechaInput = document.getElementById('fecha');

const today = new Date();
fechaInput.min = today.toISOString().split('T')[0];

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 3);
fechaInput.max = maxDate.toISOString().split('T')[0];

fechaInput.addEventListener('change', function() {
    reservaData.fecha = this.value;
    checkStep2Completion();
});

document.querySelectorAll('.time').forEach(slot => {
    slot.addEventListener('click', function() {
        document.querySelectorAll('.time').forEach(s => {
            s.classList.remove('selected');
        });
        this.classList.add('selected');
        reservaData.hora = this.dataset.time;
        
        checkStep2Completion();
    });
});

function checkStep2Completion() {
    if (reservaData.fecha && reservaData.hora) {
        btnNext.disabled = false;
    }
}

// Datos del Cliente
const inputs = {
    nombre: document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    email: document.getElementById('email'),
    vehiculo: document.getElementById('vehiculo'),
    modelo: document.getElementById('modelo'),
    comentarios: document.getElementById('comentarios')
};

Object.keys(inputs).forEach(key => {
    if (inputs[key] && key !== 'comentarios') {
        inputs[key].addEventListener('input', function() {
            validateInput(this);
            checkStep3Completion();
        });
    }
});

function validateInput(input) {
    const value = input.value.trim();
    
    switch(input.id) {
        case 'nombre':
            return value.length >= 3;
        case 'telefono':
            return /^[\d\s\+\-\(\)]+$/.test(value) && value.length >= 9;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'vehiculo':
            return value !== '';
        case 'modelo':
            return value.length >= 3;
        default:
            return true;
    }
}

function checkStep3Completion() {
    const allValid = ['nombre', 'telefono', 'email', 'vehiculo', 'modelo'].every(key => {
        return validateInput(inputs[key]);
    });

    btnNext.disabled = !allValid;
}

// Confirmacion
function updateResumen() {
    document.getElementById('resumen-paquete').textContent = reservaData.paquete.charAt(0).toUpperCase() + reservaData.paquete.slice(1);
    document.getElementById('resumen-precio').textContent = `S/ ${reservaData.precio}`;

    const fechaObj = new Date(reservaData.fecha + 'T00:00:00');
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opciones);
    document.getElementById('resumen-fecha').textContent = fechaFormateada;

    const [hora, minutos] = reservaData.hora.split(':');
    const horaNum = parseInt(hora);
    const periodo = horaNum >= 12 ? 'PM' : 'AM';
    const hora12 = horaNum > 12 ? horaNum - 12 : (horaNum === 0 ? 12 : horaNum);
    document.getElementById('resumen-hora').textContent = `${hora12}:${minutos} ${periodo}`;

    document.getElementById('resumen-nombre').textContent = reservaData.nombre;
    document.getElementById('resumen-telefono').textContent = reservaData.telefono;
    document.getElementById('resumen-email').textContent = reservaData.email;
    
    const vehiculoTexto = inputs.vehiculo.options[inputs.vehiculo.selectedIndex].text;
    document.getElementById('resumen-vehiculo').textContent = `${vehiculoTexto} - ${reservaData.modelo}`;
    document.getElementById('total-precio').textContent = `S/ ${reservaData.precio}`;
}

// Checkbox de políticas
const checkboxPoliticas = document.getElementById('acepto-politicas');
if (checkboxPoliticas) {
    checkboxPoliticas.addEventListener('change', function() {
        btnSubmit.disabled = !this.checked;
    });
}

// Navegación de botones
btnPrev.addEventListener('click', () => {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
});

btnNext.addEventListener('click', () => {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            if (currentStep === 3) {
                saveStep3Data();
            }
            
            currentStep++;
            showStep(currentStep);
            
            if (currentStep === 4) {
                updateResumen();
            }
        }
    }
});

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            if (!reservaData.paquete) {
                alert('Por favor selecciona un paquete');
                return false;
            }
            return true;
        
        case 2:
            if (!reservaData.fecha) {
                alert('Por favor selecciona una fecha');
                return false;
            }
            if (!reservaData.hora) {
                alert('Por favor selecciona una hora');
                return false;
            }
            return true;
        
        case 3:
            const camposRequeridos = ['nombre', 'telefono', 'email', 'vehiculo', 'modelo'];
            for (let campo of camposRequeridos) {
                if (!validateInput(inputs[campo])) {
                    alert(`Por favor completa correctamente: ${campo}`);
                    inputs[campo].focus();
                    return false;
                }
            }
            return true;
        
        default:
            return true;
    }
}

function saveStep3Data() {
    reservaData.nombre = inputs.nombre.value.trim();
    reservaData.telefono = inputs.telefono.value.trim();
    reservaData.email = inputs.email.value.trim();
    reservaData.vehiculo = inputs.vehiculo.value;
    reservaData.modelo = inputs.modelo.value.trim();
    reservaData.comentarios = inputs.comentarios.value.trim();
}

// Envio del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!checkboxPoliticas.checked) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }
    btnSubmit.textContent = 'Procesando...';
    btnSubmit.disabled = true;
    setTimeout(() => {
        console.log('Datos de reserva:', reservaData);
        
        const codigoReserva = 'RSV-' + Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        document.getElementById('codigoReserva').textContent = codigoReserva;
        
        modalSuccess.classList.add('show');
        enviarReserva(reservaData);
        
    }, 2000);
});

// Cursor personalizado
function createCustomCursor() {
    const cursor = document.createElement('div');
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

    const follower = document.createElement('div');
    follower.style.cssText = `
        width: 40px;
        height: 40px;
        border: 1px solid rgba(0, 212, 255, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.3s ease;
    `;
    document.body.appendChild(follower);

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
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }

    animateFollower();
    document.querySelectorAll('button, a, input, select, .paquete-card, .time').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.backgroundColor = 'rgba(0, 212, 255, 0.3)';
            follower.style.transform = 'scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.backgroundColor = 'transparent';
            follower.style.transform = 'scale(1)';
        });
    });
}


// Inicalización
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createCustomCursor();
    showStep(1);
    btnNext.disabled = true;
    btnSubmit.disabled = true;
});

// Prevenir fechas pasadas y domingos
fechaInput.addEventListener('input', function() {
    const selectedDate = new Date(this.value + 'T00:00:00');
    const dayOfWeek = selectedDate.getDay();
    
    if (dayOfWeek === 0) {
        alert('Los domingos tenemos horario limitado (9 AM - 3 PM)');
        document.querySelectorAll('.time').forEach(slot => {
            const hora = parseInt(slot.dataset.time.split(':')[0]);
            if (hora < 9 || hora > 15) {
                slot.classList.add('disabled');
            } else {
                slot.classList.remove('disabled');
            }
        });
    } else {
        document.querySelectorAll('.time').forEach(slot => {
            slot.classList.remove('disabled');
        });
    }
});


async function enviarReserva(data) {
    try {
        const response = await fetch('http://127.0.0.1:5000/reservar', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Reserva enviada:', result);
            return result;
        }
    } catch (error) {
        console.error('Error al enviar reserva:', error);
    }
}

