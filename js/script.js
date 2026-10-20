// ===== 1. Año automático en el pie =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== 2. Menú móvil =====
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

toggle.addEventListener("click", () => {
  const abierto = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", abierto);
});

// Cerrar el menú al pulsar un enlace
menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// ===== 3. Línea bajo la navegación al hacer scroll =====
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 20);
});

// ===== 4. Efecto máquina de escribir en la frase del hero =====
const typed = document.querySelector(".typed");
const palabras = typed.dataset.words.split("|");
let palabraActual = 0;
let letra = 0;
let borrando = false;

function escribir() {
  const texto = palabras[palabraActual];
  typed.textContent = texto.slice(0, letra);

  if (!borrando && letra < texto.length) {
    letra++;
    setTimeout(escribir, 80);
  } else if (!borrando && letra === texto.length) {
    borrando = true;
    setTimeout(escribir, 1800); // pausa con la palabra completa
  } else if (borrando && letra > 0) {
    letra--;
    setTimeout(escribir, 40);
  } else {
    borrando = false;
    palabraActual = (palabraActual + 1) % palabras.length;
    setTimeout(escribir, 300);
  }
}

// Si el usuario prefiere menos movimiento, mostramos la primera frase sin animar
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typed.textContent = palabras[0];
} else {
  escribir();
}

// ===== 5. Aparición de secciones al hacer scroll =====
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 },
);
document.querySelectorAll(".reveal").forEach((el) => observador.observe(el));

// ===== 6. Resaltar en el menú la sección que se está viendo =====
const enlacesMenu = document.querySelectorAll(".nav__menu a");
const secciones = document.querySelectorAll("section[id]");

const observadorMenu = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        enlacesMenu.forEach((a) =>
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + entrada.target.id,
          ),
        );
      }
    });
  },
  { rootMargin: "-50% 0px -50% 0px" },
);
secciones.forEach((s) => observadorMenu.observe(s));

// ===== 7. Copiar el correo con un clic =====
const botonEmail = document.querySelector(".contact__email");
const toast = document.querySelector(".toast");

botonEmail.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(botonEmail.dataset.email);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  } catch {
    // Si el navegador no permite copiar, abrimos el programa de correo
    window.location.href = "mailto:" + botonEmail.dataset.email;
  }
});
