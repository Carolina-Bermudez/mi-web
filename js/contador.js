// =============================================================
// contador.js · Cifras animadas de «Sobre mí»
// Cada número sube de 0 a su valor en 1 segundo cuando aparece
// en pantalla (una sola vez). Si el visitante tiene activada la
// preferencia de «menos movimiento», se muestra el número final
// directamente, sin animación.
// =============================================================

(function () {
  const cifras = document.querySelectorAll(".cifra__numero");
  if (!cifras.length) return;

  const DURACION_MS = 1000;   // cuánto tarda en contar
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Calcula el valor final de cada cifra.
  // data-objetivo="2" → cuenta hasta 2
  // data-desde="2008" → cuenta los años desde 2008 hasta hoy (se actualiza solo cada año)
  function valorFinal(el) {
    if (el.dataset.desde) return new Date().getFullYear() - Number(el.dataset.desde);
    return Number(el.dataset.objetivo);
  }

  // Anima un número de 0 a su valor final
  function contar(el) {
    const fin = valorFinal(el);
    if (menosMovimiento) { el.textContent = fin; return; }
    const inicio = performance.now();
    function paso(ahora) {
      const progreso = Math.min((ahora - inicio) / DURACION_MS, 1);
      const suave = 1 - Math.pow(1 - progreso, 3);          // empieza rápido y frena al final
      el.textContent = Math.round(fin * suave);
      if (progreso < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  // Empieza a contar solo cuando la cifra entra en pantalla, y solo una vez
  const observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        contar(entrada.target);
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.6 });

  cifras.forEach(el => {
    el.textContent = menosMovimiento ? valorFinal(el) : 0;
    observador.observe(el);
  });
})();