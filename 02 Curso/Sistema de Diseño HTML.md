---
tags: [curso, diseno, html]
---

# Sistema de Diseño — Materiales HTML

Aplica a Guías, Resúmenes y Repasos en HTML (nunca a Foro, Control, Ikigai, Propósito de
vida o Workbook — esos son siempre trabajo personal de Navas, no un archivo que Claude
entregue), y al sitio publicado en `docs/`.

**Identidad: "Bento Brutal"** (reemplaza la estética griega anterior, "Acrópolis del
Bienestar"). Neo-brutalismo + bento grid: bloques de color plano y saturado, bordes de 3 px,
sombras duras desplazadas sin desenfoque, tipografía grotesca pesada en mayúsculas y mucho
movimiento. Cada pieza de contenido es un "tile" con su propio borde y sombra; el layout
es una rejilla de tiles, no una columna de párrafos sueltos.

## Fuente única y build

- `tools/design/brutal.css` — tokens, componentes, láminas SVG y keyframes (compartido).
- `tools/design/portal.css` — estilos exclusivos del portal (`docs/index.html`).
- `tools/design/motion.js` — motion design (vanilla, sin dependencias).
- `node tools/apply-design.mjs` — inyecta esos tres archivos dentro de cada página de `docs/`
  entre los marcadores `/*DESIGN:START*/ … /*DESIGN:END*/` y `/*MOTION:START*/ … /*MOTION:END*/`.
  Es idempotente. **Nunca editar el CSS dentro de una página de `docs/`**: edita
  `tools/design/*` y vuelve a correr el script.
- `tests/site-smoke.mjs` falla si alguna página quedó con el CSS o el JS desactualizado.
- Cada página sigue siendo un solo archivo `.html` autocontenido (el CSS y el JS viajan
  incrustados), así que se puede abrir suelto o copiar fuera del repo.

## Tipografía

- **Archivo** 700/800/900 — títulos (`h1`–`h4`), botones y etiquetas fuertes. `h1`/`h2` en
  mayúsculas, interletrado negativo (`-.035em`).
- **Space Grotesk** 400–700 — cuerpo y componentes de interfaz.
- **JetBrains Mono** 400–700 — metadatos, etiquetas, fechas, citas de fuente.
- **Archivo Narrow** — solo texto corrido dentro de láminas SVG antiguas (sustituye a la
  serif condensada para no desbordar las cajas).

Un solo `@import` de Google Fonts, al inicio del `<style>` (un `@import` después de otras
reglas lo ignora el navegador; así fue como Cinzel nunca cargó en la versión griega).

## Paleta

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `--paper` | `#F3EEE1` | `#0E0E0E` | Fondo (con cuadrícula de 44 px) |
| `--card` | `#FFFFFF` | `#171716` | Tiles de contenido |
| `--ink` | `#0B0B0B` | `#F3EEE1` | Texto, bordes y sombras duras (se invierte en modo noche) |
| `--c-yellow` | `#FFD60A` | igual | Título principal, énfasis, botones |
| `--c-coral` | `#FF6B4A` | igual | Avisos, acento de alerta |
| `--c-blue` | `#7C9CFF` | igual | Preguntas, primario secundario |
| `--c-green` | `#35D88F` | igual | Aciertos, disponible |
| `--c-lilac` | `#C3A6FF` | igual | Casos, acento neutro |

Regla: **todo texto sobre un tile de color es `#0B0B0B`** (`--on-tile`), en ambos modos. Los
colores de acento no cambian entre claro y oscuro; lo que cambia es `--ink`, `--paper` y
`--card`. Cada `section.unit` rota su acento (`--accent`) entre amarillo, verde, lila, coral y
azul.

Los alias heredados (`--bg`, `--text`, `--pine`, `--clay`, `--gold-doric`, `--svg-*`…) siguen
definidos para que los SVG antiguos y el HTML ya escrito rindan en la paleta nueva.

## Layout bento

- Cabecera (`header.top`): rejilla de 12 columnas — fichas de datos (`.plate`) en colores, `h1`
  como tile amarillo, `.lede` y `.aviso` lado a lado.
- `.block` = tile blanco con borde 3 px y sombra 9 px. Dentro: `.two`, `.three` y `dl.glos`
  son sub-rejillas de tiles (franja de color arriba, hover que se levanta).
- Portal: mosaico de 6 columnas; disponibles = tile de color (clicable entero), pendientes =
  tile punteado con rayado, Pilar X = tile negro a todo el ancho.

## Láminas SVG

- Planas: los degradados heredados se aplanan por CSS (`stop-color` por sufijo de id:
  `-gk-clay`, `-gk-pine`, `-gk-gold`…) conservando la luminosidad original, para que los textos
  claros u oscuros de cada lámina sigan legibles.
- Trazo `--ink` de 2.2–2.5 px, sin filtros de sombra suave; la sombra dura la pone el `figure`.
- Las clases propias de las láminas del Repaso 2 (`.sv .h .d .m .fpine .fclay .fgold …`) viven
  en `brutal.css`.
- Identificadores únicos por lámina (prefijo exclusivo en `<defs>`) siguen siendo obligatorios.
- Todo diagrama es SVG inline accesible (`role="img"` + `aria-label`); nunca imágenes ni
  capturas de diapositivas.

## Motion design

Todo en `motion.js` + keyframes de `brutal.css`; respeta `prefers-reduced-motion` y nunca deja
contenido oculto si el JS falla.

- Barra de progreso de lectura (coral) arriba del todo.
- Títulos: entrada palabra por palabra (máscara + subida con rotación).
- Cinta de texto en movimiento (`.ticker`) bajo cada cabecera; dos en el portal.
- Revelado al hacer scroll (`data-rv` → `.in`) con escalonado y rebote; al terminar se devuelve
  el control a los estilos normales para que el hover no herede la transición.
- Láminas SVG: cada forma "salta" en cascada al entrar en pantalla (usa la propiedad CSS
  `scale`, no `transform`, para no pisar el atributo `transform` de los SVG).
- Cinta de advertencia animada (`.stripe`), TOC con sección activa, botones que se levantan al
  hover y se hunden al pulsar.
- Autoevaluación: acierto = rebote + confeti; error = sacudida; la retroalimentación cae desde
  arriba; el marcador "rebota" al cambiar.
- Tarjetas de memoria: entran con rebote y giran en 3D al voltearse.
- Portal: contadores animados, inclinación 3D de los tiles con el puntero, stickers con
  parallax y flotación.
- Cambio de tema: círculo expansivo desde el botón (View Transitions; sin soporte, cambia
  directo).

## Reglas técnicas

- **Sin `<form>`** — eventos JS para cualquier interacción.
- **Tema**: el script del `<head>` lee `localStorage` dentro de `try/catch` (funciona en
  `file://`); `#theme-toggle` comunica su estado con `aria-pressed`. Orden de scripts:
  (1) tema inicial, (2) contenido de la página, (3) `toggleTheme`, (4) motion — el smoke test
  depende de ese orden.
- **Cero dependencias externas** salvo las fuentes de Google; abre directo en el navegador,
  sin servidor.
- **Responsive**: ≥390 px sin desbordamiento horizontal.
- **Contraste**: texto negro sobre tiles de color; en modo noche los tiles conservan el color.

## Estructura de página

Cabecera con el nombre de la Unidad + fecha(s) de clase + fuente citada, cuerpo dividido en
secciones por subtema (una por cada PDF/PPTX), y — en un Repaso — autoevaluación con
retroalimentación inmediata, dejando explícito en el propio HTML que es material de estudio
personal, no una simulación del Control real.
