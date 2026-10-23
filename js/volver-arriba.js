/* =========================================================
   Botón "Volver arriba"
   - Aparece al bajar más de 600 px
   - Abajo a la izquierda (a la derecha está el chat)
   - Subida suave, salvo si el usuario pide menos movimiento
   ========================================================= */
(function () {
  'use strict';

  var UMBRAL = 600; // píxeles de scroll para mostrar el botón

  /* ---------- CSS ---------- */
  var css = `
    .volver-arriba {
      position: fixed;
      left: calc(20px + env(safe-area-inset-left, 0px));
      bottom: calc(20px + env(safe-area-inset-bottom, 0px));
      z-index: 999;
      width: 52px;
      height: 52px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: #e8b25c;
      color: #22170f;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(34, 23, 15, 0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(12px);
      transition: opacity 0.3s ease, transform 0.3s ease,
                  visibility 0.3s, box-shadow 0.2s ease;
    }
    .volver-arriba.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .volver-arriba:hover {
      box-shadow: 0 6px 20px rgba(34, 23, 15, 0.4);
    }
    .volver-arriba:focus-visible {
      outline: 3px solid #22170f;
      outline-offset: 3px;
    }
    .volver-arriba svg {
      width: 24px;
      height: 24px;
      pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .volver-arriba {
        transition: none;
        transform: none;
      }
    }
  `;

  var estilo = document.createElement('style');
  estilo.textContent = css;
  document.head.appendChild(estilo);

  /* ---------- Botón ---------- */
  var boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'volver-arriba';
  boton.setAttribute('aria-label', 'Volver arriba');
  boton.title = 'Volver arriba';
  boton.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(boton);

  /* ---------- Mostrar / ocultar ---------- */
  var pendiente = false;
  function actualizar() {
    pendiente = false;
    var y = window.scrollY || document.documentElement.scrollTop;
    boton.classList.toggle('visible', y > UMBRAL);
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) {
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    }
  }, { passive: true });
  actualizar();

  /* ---------- Subir ---------- */
  var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  boton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: menosMovimiento.matches ? 'auto' : 'smooth'
    });
    // Llevar el foco al inicio para usuarios de teclado / lector de pantalla
    var inicio = document.querySelector('header, main, h1') || document.body;
    if (!inicio.hasAttribute('tabindex')) inicio.setAttribute('tabindex', '-1');
    inicio.focus({ preventScroll: true });
  });
})();