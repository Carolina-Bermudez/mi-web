# Carolina Bermúdez · Web personal de marca

Web personal en la que cuento quién soy, qué he hecho y qué me mueve: emprendedora con dos empresas a mis espaldas que ahora aprende a programar para crear negocios digitales.

🔗 **Web en directo:** https://carolina-bermudez.github.io/mi-web/

Proyecto del módulo de Programación del ciclo formativo de Desarrollo de Aplicaciones (IES Simarro), hecho con HTML, CSS y JavaScript puros, sin frameworks, y con ayuda de IA.

---

## Secciones

| Sección | Qué contiene |
|---|---|
| **Cabecera** | Mi nombre, mi lema («Aprender · Emprender · Reinventarse»), una frase con efecto de máquina de escribir, mi foto y dos botones (ver lo que he hecho / contactar). |
| **Sobre mí** | Quién soy en dos párrafos y tres cifras animadas (empresas fundadas, años desde mi primera empresa, lenguajes que aprendo). |
| **Lo que he hecho** | Cronología: mis estudios actuales, mis dos empresas (2008 y 2015) y mi formación. Al final, el widget «Ahora mismo en GitHub» con datos en directo. |
| **Me gusta** | Cuatro tarjetas con iconos SVG propios y una tarjeta «Los retos» con una foto mía escalando. |
| **Contacto** | Correo (se copia con un clic), LinkedIn y GitHub. |
| **Pie** | Mi nombre, el año (automático) y una frase personal. |
| **Alison** | Chatbot flotante que responde dudas sobre mí. |

---

## Ficheros

```
mi-web/
├── index.html          → estructura de la página
├── favicon.svg         → icono de la pestaña (el brote del logo)
├── css/
│   └── style.css       → todos los estilos, con variables de color al principio
├── js/
│   ├── script.js       → menú móvil, efecto de escritura, aparición al hacer scroll,
│   │                     menú activo, copiar el correo y año del pie
│   ├── api.js          → widget «Ahora mismo en GitHub» (API pública de GitHub)
│   ├── chatbot.js      → Alison, el chatbot (incluye su propio CSS)
│   └── contador.js     → cifras animadas de «Sobre mí»
├── img/
│   ├── carolina.jpg    → mi foto de la cabecera (optimizada con Squoosh)
│   └── retos.jpg       → foto escalando, en blanco y negro
├── docs/
│   └── lighthouse.png  → captura de los resultados de Lighthouse
├── prompts/
│   └── semana-1.txt    → órdenes clave que di a la IA la primera semana
├── notas.txt           → notas del widget, ficha del chatbot y sus 10 pruebas trampa
├── .gitignore          → lo que nunca se sube (claves, basura del sistema…)
└── .nojekyll           → publicar la web tal cual, sin el procesador Jekyll
```

---

## Decisiones de arquitectura

### 1. Chatbot sin IA: un árbol de respuestas escritas por mí

- **Situación:** quería un canal de contacto con respuesta automática. Usar un modelo de IA con clave en una web estática es peligroso: cualquiera ve la clave con F12. Los servicios gratuitos sin clave pueden saturarse e inventar datos.
- **Decisión:** Alison funciona con un árbol de decisiones. Busca palabras clave en la pregunta y elige una de las respuestas que he escrito yo. Las preguntas sobre datos privados (dirección, teléfono, edad, familia) tienen prioridad y siempre se rechazan.
- **Consecuencia:** no puede inventar ni filtrar nada que no esté escrito, no usa clave y funciona sin internet. A cambio, no entiende el significado: responde por palabras clave (en las pruebas, un texto con la palabra «Ribera» le hizo hablar de mi empresa Ribera Verde). Lo probé con 10 preguntas trampa; la v1 fallaba en una y la arreglé en la v2 (ver `notas.txt`).

### 2. Widget con la API pública de GitHub, sin clave

- **Situación:** la web tenía que mostrar datos reales de una API externa, y yo quería que tuviera relación con mi marca.
- **Decisión:** `api.js` pide dos URLs de la API pública de GitHub (mi perfil y este repositorio) y muestra mis repositorios públicos, mis seguidores y cuándo se actualizó la web por última vez. Tiene estado de carga, mensaje de error si GitHub no responde en 10 segundos y recarga cada 5 minutos.
- **Consecuencia:** la web se actualiza sola con cada commit, sin tocar nada. La API sin clave permite unas 60 peticiones por hora por IP: si en clase muchas personas abren la web a la vez desde la misma red, puede saltar el mensaje de error. Para eso existe `RECARGA_SEGUNDOS`, que se puede poner a 0.

### 3. Un fichero JavaScript por función

- **Situación:** la web fue creciendo por partes (menú, widget, chatbot, contador) y cada parte la añadí en una rama o un commit distinto.
- **Decisión:** cada función tiene su propio fichero en `js/`, y el chatbot lleva su CSS dentro para no tocar `style.css`.
- **Consecuencia:** puedo quitar o cambiar una función sin romper las demás, y cada commit toca pocos ficheros. A cambio, la página carga cuatro scripts en vez de uno; con el tamaño de esta web, Lighthouse da igualmente 96 de rendimiento.

### 4. CSS legible y sin minificar

- **Situación:** Lighthouse sugiere minificar `style.css` para ahorrar unos 2 KB.
- **Decisión:** lo mantengo legible y comentado. Los colores están en variables al principio (`--night`, `--gold`, `--accent`…) y cada bloque tiene un comentario que dice qué hace.
- **Consecuencia:** puedo leer y retocar mis estilos a mano mientras aprendo. Pierdo 2 KB, pero la nota de rendimiento ya es 96.

### 5. Logo y favicon en SVG propio

- **Situación:** quería una identidad propia que transmitiera fortaleza y resiliencia: primero raíces, luego crecimiento.
- **Decisión:** el logo son mis iniciales en letra Lora, convertidas en trazos, delante de un brote con raíces en segundo plano. Las letras usan `currentColor` y el favicon es el brote solo.
- **Consecuencia:** el logo cambia de color solo (crema sobre la cabecera oscura, marrón sobre fondo claro), no se pixela con el zoom y se ve igual aunque el ordenador no tenga instalada la fuente Lora.

---

## Accesibilidad y rendimiento

- **Lighthouse (escritorio):** 96 en rendimiento y 100 en accesibilidad, sin avisos de imágenes ni vídeo (`docs/lighthouse.png`).
- Todas las animaciones respetan `prefers-reduced-motion`: si el sistema pide menos movimiento, se desactivan.
- Las imágenes tienen texto alternativo (`alt`), y la foto de «Los retos» usa `loading="lazy"`. La foto de la cabecera se optimizó con Squoosh: de 210 KB a 103 KB.

---

## Cómo se publica

- La web se publica con **GitHub Pages** desde la rama `main`, carpeta raíz (`/`).
- El fichero `.nojekyll` desactiva Jekyll para que GitHub publique los ficheros tal cual.
- Todas las rutas son relativas (`css/style.css`, `img/carolina.jpg`…) para que funcionen dentro de `/mi-web/`.
- Las funciones grandes se hicieron en ramas con su Pull Request: el widget (PR #8) y el chatbot (PR #9). El trabajo se planificó con issues.

---

## Créditos

- **Fotos:** propias (`carolina.jpg` y `retos.jpg`).
- **Logo, favicon e iconos:** SVG propios, creados con ayuda de IA.
- **Tipografías:** [Fraunces](https://fonts.google.com/specimen/Fraunces) e [Inter](https://fonts.google.com/specimen/Inter) de Google Fonts; [Lora](https://fonts.google.com/specimen/Lora), convertida a trazos en el logo. Las tres tienen licencia SIL Open Font License.
- **IA:** el código se generó con un asistente de IA a partir de mis peticiones; las órdenes clave están en `prompts/` y `notas.txt`.
