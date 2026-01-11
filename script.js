// Controles
const inputArchivo = document.getElementById('inputArchivo');
const btnAgregarArchivo = document.getElementById('btn-agregar-archivo');
const inputUrl = document.getElementById('inputUrl');
const btnAgregarUrl = document.getElementById('btn-agregar-url');
const btnEliminar = document.getElementById('btn-eliminar');
const galeria = document.getElementById('galeria');

// Agrega una imagen a la galería desde una URL o blob URL
function agregarMedia(url, alt = 'Media'){
    const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

    const wrapper = document.createElement('div');
    wrapper.className = 'media-card fade-in';

    let el;
    if (isVideo){
        el = document.createElement('video');
        el.src = url;
        el.controls = true;
        el.playsInline = true;
        el.preload = 'metadata';
        el.setAttribute('aria-label', alt);
    } else {
        el = document.createElement('img');
        el.src = url;
        el.alt = alt;
        el.loading = 'lazy';
    }

    el.className = 'media-item';
    el.tabIndex = 0;

    // Botón overlay para seleccionar (útil en video donde click puede iniciar reproducción)
    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.className = 'select-btn';
    selectBtn.setAttribute('aria-label', 'Seleccionar elemento');
    selectBtn.innerText = '✓';

    // Selección por botón
    selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const items = galeria.querySelectorAll('.media-card');
        items.forEach(i => i.classList.remove('seleccionada'));
        wrapper.classList.add('seleccionada');
    });

    // Selección por click en media (toca seleccionar y detener propagación)
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        const items = galeria.querySelectorAll('.media-card');
        items.forEach(i => i.classList.remove('seleccionada'));
        wrapper.classList.add('seleccionada');
    });

    // Soporte teclado: Enter selecciona
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            el.click();
        }
    });

    // Manejo de error en carga
    el.addEventListener('error', () => {
        wrapper.classList.add('fade-out');
        setTimeout(() => wrapper.remove(), 300);
        console.warn('No se pudo cargar:', url);
    });

    wrapper.appendChild(el);
    wrapper.appendChild(selectBtn);
    galeria.appendChild(wrapper);
}

// Habilitar/deshabilitar botón según inputUrl
inputUrl.addEventListener('input', () => {
    const val = inputUrl.value.trim();
    btnAgregarUrl.disabled = val === '';
});

// Agregar por URL (botón)
btnAgregarUrl.addEventListener('click', () => {
    const url = inputUrl.value.trim();
    if (!url) return;
    agregarMedia(url, url);
    inputUrl.value = '';
    btnAgregarUrl.disabled = true;
});

// Agregar por URL con Enter
inputUrl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        btnAgregarUrl.click();
    }
});

// Agregar desde archivo
btnAgregarArchivo.addEventListener('click', () => {
    const archivo = inputArchivo.files[0];
    if (!archivo) return alert('Selecciona un archivo de imagen');
    const url = URL.createObjectURL(archivo);
    agregarMedia(url, archivo.name);
    inputArchivo.value = '';
});

// Eliminar imagen seleccionada (con animación)
btnEliminar.addEventListener('click', () => {
    const seleccionada = galeria.querySelector('.media-card.seleccionada');
    if (!seleccionada) return alert('No hay elemento seleccionado');
    seleccionada.classList.add('fade-out');
    setTimeout(() => seleccionada.remove(), 240);
});

// Tecla Supr/Backspace para eliminar selección
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace'){
        const seleccionada = galeria.querySelector('.media-card.seleccionada');
        if (seleccionada){
            seleccionada.classList.add('fade-out');
            setTimeout(() => seleccionada.remove(), 240);
        }
    }
});

// Accesibilidad: permitir deseleccionar clickeando en área vacía
document.addEventListener('click', (e) => {
    if (!e.target.closest('#galeria')){
        const items = galeria.querySelectorAll('.media-card.seleccionada');
        items.forEach(i => i.classList.remove('seleccionada'));
    }
});

// Cargar medios por defecto (archivos dentro de assets/)
function cargarPorDefecto(){
    const defaults = [
        'assets/imagenes/img1.jpg',
        'assets/imagenes/img3.jpg',
        'assets/imagenes/caterin.jpg',
        'assets/imagenes/houskeeping.jpg',
        'assets/imagenes/transporte.jpg',
        'assets/imagenes/logo-sosermin.jpg',
        'assets/videos/video-sosermin.mp4'
    ];

    defaults.forEach(p => {
        agregarMedia(p, p.split('/').pop());
    });
}

window.addEventListener('DOMContentLoaded', cargarPorDefecto);
