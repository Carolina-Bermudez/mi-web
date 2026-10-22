// =============================================================
// api.js · Widget «Ahora mismo en GitHub»
// Pide mis datos a la API pública de GitHub (sin clave) y los
// pinta en el hueco <div id="widget"> de la sección «Lo que he hecho».
// Recorrido del dato: abro la web → este fichero pide 2 URLs →
// GitHub devuelve JSON → saco 4 campos → los pinto en el hueco.
// =============================================================

// --- Ajustes (lo único que tocarías normalmente) ---
const USUARIO = "Carolina-Bermudez";   // mi usuario de GitHub
const REPO = "mi-web";                 // el repositorio de esta web
const RECARGA_SEGUNDOS = 300;          // vuelve a pedir los datos cada 5 min; pon 0 para desactivarlo
const ESPERA_MAXIMA_MS = 10000;        // si GitHub tarda más de 10 s, se muestra el error

// --- Las dos direcciones (URLs) de la API que consulto ---
const URL_PERFIL = `https://api.github.com/users/${USUARIO}`;          // repos públicos, seguidores, foto
const URL_REPO = `https://api.github.com/repos/${USUARIO}/${REPO}`;    // fecha del último cambio subido

// --- El hueco del HTML donde se pinta todo ---
const hueco = document.getElementById("widget");

// Convierte una fecha en un texto tipo «hace 2 horas»
function haceCuanto(fechaTexto) {
  const segundos = Math.round((new Date(fechaTexto) - Date.now()) / 1000);
  const formato = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  const tramos = [["year", 31536000], ["month", 2592000], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unidad, tamaño] of tramos) {
    if (Math.abs(segundos) >= tamaño) return formato.format(Math.round(segundos / tamaño), unidad);
  }
  return "hace un momento";
}

// Pide una URL y devuelve el JSON; si tarda demasiado o GitHub dice que no, lanza un error
async function pedir(url) {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), ESPERA_MAXIMA_MS);
  try {
    const respuesta = await fetch(url, { signal: control.signal });
    if (!respuesta.ok) throw new Error(`GitHub respondió ${respuesta.status}`); // p. ej. 403 = límite de 60 peticiones/hora
    return await respuesta.json();
  } finally {
    clearTimeout(temporizador);
  }
}

// Estado 1 · Cargando: se ve mientras llega la respuesta
function pintarCargando() {
  hueco.classList.remove("widget--error");
  hueco.innerHTML = `<p class="gh__cargando">Cargando datos de GitHub…</p>`;
}

// Estado 2 · Datos: la tarjeta con mis números reales
function pintarDatos(perfil, repo) {
  hueco.innerHTML = `
    <div class="gh">
      <img class="gh__avatar" src="${perfil.avatar_url}" alt="Mi foto de perfil en GitHub" width="64" height="64" loading="lazy">
      <div class="gh__datos">
        <p class="gh__titulo">Ahora mismo en GitHub</p>
        <ul class="gh__cifras">
          <li><strong>${perfil.public_repos}</strong> ${perfil.public_repos === 1 ? "repositorio público" : "repositorios públicos"}</li>
          <li><strong>${perfil.followers}</strong> ${perfil.followers === 1 ? "seguidor" : "seguidores"}</li>
        </ul>
        <p class="gh__update">Esta web se actualizó por última vez <time datetime="${repo.pushed_at}">${haceCuanto(repo.pushed_at)}</time>.</p>
      </div>
      <a class="gh__btn" href="${perfil.html_url}" target="_blank" rel="noopener">Ver mi GitHub ↗</a>
    </div>`;
}

// Estado 3 · Error: nunca se queda en «Cargando…» para siempre
function pintarError() {
  hueco.classList.add("widget--error");
  hueco.innerHTML = `<p class="gh__error">GitHub no responde ahora mismo. Puedes ver mi trabajo directamente en
    <a href="https://github.com/${USUARIO}" target="_blank" rel="noopener">github.com/${USUARIO}</a>.</p>`;
}

// Junta todo: muestra «Cargando», pide las 2 URLs a la vez y pinta datos o error
async function cargarWidget() {
  if (!hueco) return;               // si la página no tiene el hueco, no hace nada
  pintarCargando();
  try {
    const [perfil, repo] = await Promise.all([pedir(URL_PERFIL), pedir(URL_REPO)]);
    pintarDatos(perfil, repo);
  } catch (error) {
    console.warn("Widget de GitHub:", error.message); // aviso amarillo, no error rojo
    pintarError();
  }
}

// Arranca al abrir la página y, si está activada, se repite cada RECARGA_SEGUNDOS
cargarWidget();
if (RECARGA_SEGUNDOS > 0) setInterval(cargarWidget, RECARGA_SEGUNDOS * 1000);