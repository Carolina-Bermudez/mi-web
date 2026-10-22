// =============================================================
// chatbot.js · Alison, la asistente de la web de Carolina
// Bot SIN IA (vía 1 del tutorial): un árbol de decisiones.
// No genera nada: busca palabras clave en la pregunta y elige
// una de las respuestas que Carolina ha escrito. Por eso no puede
// inventar ni filtrar datos: lo que no está escrito aquí, no lo sabe.
// No usa internet ni ninguna clave: funciona incluso sin wifi.
// =============================================================

(function () {

  // ---------------------------------------------------------------
  // EDITA SOLO ESTE BLOQUE (viene de notas.txt · ## Mi chatbot)
  // Cada rama: palabras clave (en minúscula y sin tildes) + respuesta literal.
  // El orden importa: si dos ramas empatan, gana la que está más arriba.
  // ---------------------------------------------------------------
  const CORREO = "marbermon5@alu.edu.gva.es";

  const RAMAS = [
    { // Lo privado va PRIMERO: si aparece, gana siempre (regla de seguridad)
      tema: "privado",
      claves: ["direccion", "donde vive", "vive", "telefono", "movil", "whatsapp", "dni", "edad", "cuantos anos", "familia", "madre", "padre", "hijo", "hija", "pareja", "marido", "sobrina", "novio", "casa"],
      respuesta: `Eso es privado y no lo sé (ni quiero saberlo 🙈). Si necesitas algo de Carolina, lo mejor es escribirle a ${CORREO}.`
    },
    { // Intentos de «ignora tus instrucciones»
      tema: "trampa",
      claves: ["instrucciones", "ignora", "olvida", "prompt", "sistema", "reglas", "codigo secreto"],
      respuesta: "Buen intento 😄 Pero yo no tengo instrucciones secretas que contar: solo respuestas que Carolina ha escrito una a una."
    },
    {
      tema: "busca",
      claves: ["busca", "buscas", "proyecto", "project", "colabor", "practicas", "contratar", "trabajar con", "oferta", "freelance", "encargo", "reto"],
      respuesta: `Ahora mismo Carolina busca proyectos y retos nuevos, sobre todo en el mundo digital. Si tienes uno entre manos, escríbele a ${CORREO} y lo habláis.`
    },
    {
      tema: "contacto",
      claves: ["contact", "correo", "email", "mail", "escribirle", "linkedin", "github", "hablar con", "localizar"],
      respuesta: `Puedes escribirle a ${CORREO}. También la encuentras en LinkedIn y en GitHub: tienes los enlaces en la sección «Contacto», al final de la página.`
    },
    {
      tema: "estudios",
      claves: ["estudi", "curso", "instituto", "simarro", "dam", "aprend", "lenguaje", "java", "html", "css", "programa", "clase"],
      respuesta: "Carolina estudia Desarrollo de Aplicaciones en el IES Simarro. Está aprendiendo HTML, CSS, JavaScript y Java, y esta web es uno de sus primeros proyectos (le está quedando apañada, ¿eh?)."
    },
    {
      tema: "empresas",
      claves: ["empresa", "negocio", "emprend", "ribera", "punt rec", "reciclaje", "jardin", "experiencia", "fundadora", "trayectoria"],
      respuesta: "Ha fundado dos empresas: Ribera Verde, de jardinería, en 2008, y Punt Rec recuperaciones, de reciclaje, en 2015. Gestión, clientes, marketing… un poco de todo. Ahora quiere llevar esa experiencia al mundo digital."
    },
    { // NUEVO en v2 (prueba trampa 1): antes no sabía qué decir del horario
      tema: "horario",
      claves: ["horario", "atiende", "disponib", "a que hora", "horas"],
      respuesta: `Yo estoy disponible las 24 horas, ¡no necesito café! ☕ Para hablar con Carolina, escríbele a ${CORREO} y te contestará en cuanto pueda.`
    },
    {
      tema: "formacion",
      claves: ["marketing", "contabilidad", "derecho", "filosofia", "formacion", "carrera"],
      respuesta: "Antes de programar estudió marketing, contabilidad, derecho y filosofía. Una mezcla rara, sí, pero muy útil: le ayuda a pensar un producto entero, desde a quién se vende hasta por qué existe."
    },
    {
      tema: "motivo",
      claves: ["por que programa", "por que empez", "empez", "motiv", "tarde", "cambio", "reinvent"],
      respuesta: "Porque quiere crear negocios digitales sin depender de nadie para la parte técnica. Y porque nunca es tarde para aprender algo que te asusta un poco. 💪"
    },
    {
      tema: "gustos",
      claves: ["gusta", "aficion", "hobby", "tiempo libre", "escalad", "escalar", "montana", "escribir", "leer"],
      respuesta: "Le encanta escribir, crear empresas y los retos: de hecho, escala montaña. Su truco: concentrarse en el siguiente paso… y sin darse cuenta, llegar a la cima. 🧗‍♀️"
    },
    {
      tema: "web",
      claves: ["web", "pagina", "hecha", "hiciste", "inteligencia artificial", " ia ", "widget", "api"],
      respuesta: "Carolina ha hecho esta web con ayuda de IA y la ha publicado en GitHub Pages. Tiene un widget que lee sus datos de la API de GitHub… y a mí, que tampoco estoy nada mal. 😉"
    },
    {
      tema: "quien",
      claves: ["quien eres", "que eres", "como te llamas", "alison", "bot", "robot", "te ha creado", "te creo", "te ha hecho", "eres una ia"],
      respuesta: "Soy Alison, la asistente de la web de Carolina Bermúdez. No soy una IA de las que se lo inventan todo: cada respuesta mía la ha escrito Carolina, así que solo digo cosas ciertas. 😄"
    },
    {
      tema: "saludo",
      claves: ["hola", "buenas", "buenos dias", "hey", "que tal"],
      respuesta: "¡Hola! Soy Alison. Puedo contarte qué estudia Carolina, qué empresas ha creado, qué le gusta y cómo contactar con ella. ¿Qué te apetece saber?"
    },
    {
      tema: "despedida",
      claves: ["gracias", "adios", "hasta luego", "chao", "genial", "perfecto"],
      respuesta: "¡A ti! Si te quedas con ganas de más, Carolina estará encantada de leerte. 👋"
    }
  ];

  // Lo que responde si no reconoce nada (siempre remite al contacto real)
  const POR_DEFECTO = `Uy, eso no lo sé. Carolina solo me ha enseñado a hablar de sus estudios, sus empresas, lo que le gusta y cómo contactar. Para lo demás, mejor escríbele a ${CORREO}.`;

  // Botones de pregunta rápida (para que el visitante sepa qué pedir)
  const RAPIDAS = ["¿Qué estudia?", "Sus empresas", "¿Qué busca ahora?", "¿Cómo la contacto?"];

  const SALUDO = "¡Hola! Soy Alison, la asistente de esta web. Pregúntame por Carolina o pulsa uno de los botones. 😊";
  // ------------------- FIN DEL BLOQUE EDITABLE -------------------


  // Normaliza el texto: minúsculas y sin tildes, para comparar fácil
  function normalizar(texto) {
    return " " + texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[¿?¡!.,;:]/g, " ") + " ";
  }

  // El árbol: cuenta cuántas palabras clave de cada rama aparecen.
  // v2: si la pregunta toca varios temas, responde a los 2 con más coincidencias
  // (antes solo respondía a uno y la otra parte de la pregunta se perdía).
  const MAXIMO_TEMAS = 2;
  function elegirRespuesta(pregunta) {
    const texto = normalizar(pregunta);
    const encontradas = [];
    for (const rama of RAMAS) {
      const puntos = rama.claves.filter(clave => texto.includes(clave)).length;
      if (rama.tema === "privado" && puntos > 0) return rama.respuesta; // lo privado manda siempre
      if (puntos > 0) encontradas.push({ rama, puntos });
    }
    if (encontradas.length === 0) return POR_DEFECTO;
    encontradas.sort((x, y) => y.puntos - x.puntos);   // las de más coincidencias, primero
    return encontradas.slice(0, MAXIMO_TEMAS).map(e => e.rama.respuesta).join("\n\n");
  }

  // ---- Estilos del chat (van aquí dentro para no tocar style.css) ----
  const estilos = document.createElement("style");
  estilos.textContent = `
    .bot-burbuja { position: fixed; right: 20px; bottom: 20px; z-index: 50; width: 60px; height: 60px; border-radius: 50%;
      border: 2px solid #e8b25c; background: #22170f; color: #e8b25c; cursor: pointer; display: grid; place-items: center;
      box-shadow: 0 10px 30px rgba(0,0,0,.35); transition: transform .2s; }
    .bot-burbuja:hover { transform: translateY(-2px); }
    .bot-burbuja svg { width: 28px; height: 28px; }
    .bot-burbuja:focus-visible, .bot-panel button:focus-visible, .bot-panel input:focus-visible { outline: 3px solid #e8b25c; outline-offset: 3px; }
    .bot-panel { position: fixed; right: 20px; bottom: 92px; z-index: 50; width: 360px; max-width: calc(100vw - 32px);
      height: 480px; max-height: calc(100vh - 120px); display: none; flex-direction: column; overflow: hidden;
      background: #f6f1e9; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,.35); font-family: "Inter", system-ui, sans-serif; }
    .bot-panel.abierto { display: flex; }
    .bot-cabecera { background: #22170f; color: #f6ecdc; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }
    .bot-cabecera strong { font-family: "Fraunces", Georgia, serif; font-weight: 400; font-size: 1.15rem; color: #e8b25c; }
    .bot-cabecera small { display: block; font-size: .75rem; opacity: .7; }
    .bot-cerrar { background: none; border: none; color: #f6ecdc; font-size: 1.4rem; cursor: pointer; line-height: 1; }
    .bot-historial { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
    .bot-msg { white-space: pre-line; max-width: 85%; padding: 10px 14px; border-radius: 16px; font-size: .92rem; line-height: 1.45; overflow-wrap: anywhere; }
    .bot-msg--alison { background: #ece4d6; color: #23201c; align-self: flex-start; border-bottom-left-radius: 4px; }
    .bot-msg--yo { background: #c2502e; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .bot-escribiendo span { display: inline-block; width: 6px; height: 6px; margin: 0 2px; border-radius: 50%; background: #5e574e; animation: bot-punto 1s infinite; }
    .bot-escribiendo span:nth-child(2) { animation-delay: .15s; } .bot-escribiendo span:nth-child(3) { animation-delay: .3s; }
    @keyframes bot-punto { 0%, 60%, 100% { opacity: .3; } 30% { opacity: 1; } }
    .bot-rapidas { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
    .bot-rapidas button { border: 1px solid #c2502e; background: none; color: #c2502e; border-radius: 999px; padding: 6px 12px; font-size: .8rem; cursor: pointer; }
    .bot-rapidas button:hover { background: #c2502e; color: #fff; }
    .bot-form { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #d9cfbf; }
    .bot-form input { flex: 1; min-width: 0; border: 1px solid #d9cfbf; border-radius: 999px; padding: 10px 14px; font: inherit; font-size: .92rem; background: #fff; }
    .bot-form button { border: none; border-radius: 999px; padding: 10px 16px; background: #22170f; color: #f6ecdc; font: inherit; font-size: .9rem; cursor: pointer; }
    @media (max-width: 480px) { .bot-panel { right: 16px; bottom: 88px; height: 70vh; } .bot-burbuja { right: 16px; bottom: 16px; } }
    @media (prefers-reduced-motion: reduce) { .bot-escribiendo span { animation: none; opacity: .7; } .bot-burbuja { transition: none; } }
  `;
  document.head.appendChild(estilos);

  // ---- La burbuja y el panel ----
  const burbuja = document.createElement("button");
  burbuja.className = "bot-burbuja";
  burbuja.setAttribute("aria-label", "Abrir chat con Alison, la asistente de la web");
  burbuja.setAttribute("aria-expanded", "false");
  burbuja.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/></svg>`;

  const panel = document.createElement("div");
  panel.className = "bot-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat con Alison");
  panel.innerHTML = `
    <div class="bot-cabecera">
      <div><strong>Alison</strong><small>Asistente de la web · respuestas escritas por Carolina</small></div>
      <button class="bot-cerrar" aria-label="Cerrar el chat">×</button>
    </div>
    <div class="bot-historial" aria-live="polite"></div>
    <div class="bot-rapidas"></div>
    <form class="bot-form">
      <label for="bot-pregunta" style="position:absolute;left:-9999px">Escribe tu pregunta</label>
      <input id="bot-pregunta" type="text" maxlength="300" autocomplete="off" placeholder="Escribe tu pregunta…">
      <button type="submit">Enviar</button>
    </form>`;

  document.body.append(burbuja, panel);

  const historial = panel.querySelector(".bot-historial");
  const campo = panel.querySelector("input");
  const formulario = panel.querySelector("form");
  const zonaRapidas = panel.querySelector(".bot-rapidas");

  // Añade un mensaje al historial (textContent: lo que escribe el visitante nunca se ejecuta como código)
  function anadirMensaje(texto, quien) {
    const msg = document.createElement("div");
    msg.className = `bot-msg bot-msg--${quien}`;
    msg.textContent = texto;
    historial.appendChild(msg);
    historial.scrollTop = historial.scrollHeight;
    return msg;
  }

  // Responde: muestra «escribiendo…» un momento y luego la respuesta elegida
  function responder(pregunta) {
    if (!pregunta.trim()) return;
    anadirMensaje(pregunta, "yo");
    campo.value = "";
    const escribiendo = anadirMensaje("", "alison");
    escribiendo.classList.add("bot-escribiendo");
    escribiendo.setAttribute("aria-label", "Alison está escribiendo");
    escribiendo.innerHTML = "<span></span><span></span><span></span>";
    setTimeout(() => {
      escribiendo.remove();
      anadirMensaje(elegirRespuesta(pregunta), "alison");
    }, 600);
  }

  // Botones de pregunta rápida
  RAPIDAS.forEach(texto => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", () => responder(texto));
    zonaRapidas.appendChild(boton);
  });

  // Abrir y cerrar el panel
  let saludado = false;
  function abrir() {
    panel.classList.add("abierto");
    burbuja.setAttribute("aria-expanded", "true");
    if (!saludado) { anadirMensaje(SALUDO, "alison"); saludado = true; }
    campo.focus();
  }
  function cerrar() {
    panel.classList.remove("abierto");
    burbuja.setAttribute("aria-expanded", "false");
    burbuja.focus();
  }
  burbuja.addEventListener("click", () => panel.classList.contains("abierto") ? cerrar() : abrir());
  panel.querySelector(".bot-cerrar").addEventListener("click", cerrar);
  panel.addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

  // Enviar con el botón o con Enter
  formulario.addEventListener("submit", e => { e.preventDefault(); responder(campo.value); });

})();