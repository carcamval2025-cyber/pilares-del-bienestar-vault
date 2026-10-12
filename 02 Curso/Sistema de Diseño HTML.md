---
tags: [curso, diseno, html]
---

# Sistema de Diseño — Materiales HTML

Aplica a Guías, Resúmenes y Repasos en HTML (nunca a Foro, Control, Ikigai, Propósito de
vida o Workbook — esos son siempre trabajo personal de Navas, no un archivo que Claude
entregue), y al sitio publicado en `docs/`.

**Identidad: "Bento Brutal" v2** (reemplaza la estética griega anterior, "Acrópolis del
Bienestar"). Neo-brutalismo + bento grid: tiles de color plano y saturado, bordes de 3 px,
sombras duras desplazadas sin desenfoque, titulares condensados y pesadísimos en mayúsculas,
y motion design abundante pero nunca bloqueante.

## Fuente única y build

- `tools/design/brutal.css` — tokens, componentes, láminas SVG y keyframes.
- `tools/design/portal.css` — estilos exclusivos del portal (`docs/index.html`).
- `tools/design/motion.js` — motion design (vanilla, sin dependencias).
- `node tools/apply-design.mjs` — inyecta esos archivos dentro de cada página de `docs/`
  entre los marcadores `/*DESIGN:START*/ … /*DESIGN:END*/` y `/*MOTION:START*/ … /*MOTION:END*/`.
  Es idempotente. **Nunca editar el CSS/JS de diseño dentro de una página de `docs/`**: edita
  `tools/design/*` y vuelve a correr el script.
- `tests/site-smoke.mjs` falla si alguna página quedó con el CSS o el JS desactualizado.
- Cada página sigue siendo un solo `.html` autocontenido (CSS y JS incrustados): se puede abrir
  suelto o copiar fuera del repo.

## Tipografía

**Una sola familia: Archivo (variable, ejes de ancho y peso).** El contraste sale del ancho y del
peso, no de emparejar dos fuentes parecidas:

- Titulares (`h1`–`h4`), botones y etiquetas fuertes: `font-stretch:78–84%`, peso 800–900, `h1`/`h2`
  en mayúsculas, interletrado entre `-.01em` y `-.025em` (nunca más apretado que `-.04em`).
- Cuerpo: ancho 100%, peso 420, 1.0625 rem, interlínea 1.62, medida ≤ 68 ch (`text-wrap: pretty`).
- Etiquetas cortas: 700, mayúsculas, `letter-spacing:.05em`. Sin monoespaciada (no es un sitio técnico).
- Dentro de las láminas SVG antiguas el texto se remapea por CSS al mismo Archivo, con
  `font-stretch` más estrecho donde antes había una serif condensada.

Un solo `@import` de Google Fonts, al inicio del `<style>` (un `@import` después de otras reglas
lo ignora el navegador; así fue como Cinzel nunca cargó en la versión griega).

## Paleta

Estrategia de color: **paleta completa** (cinco acentos con rol propio) sobre un neutro frío
(no crema/arena).

**Solo modo claro.** Se probó un modo noche (primero invertido, luego "neón sobre tinta") y se
descartó: los acentos saturados no se sostienen bien sobre fondo oscuro y duplicaba el trabajo de
mantenimiento. El sitio declara `color-scheme: light` y no tiene selector de tema.

| Token | Valor | Uso |
|---|---|---|
| `--paper` | `#E8EAEF` | Fondo (con cuadrícula de 48 px) |
| `--card` | `#FFFFFF` | Tiles neutros |
| `--ink` | `#0A0B10` | Texto y bordes neutros |
| `--c-yellow` | `#FFD60A` | Énfasis, título principal |
| `--c-coral` | `#FF5C3D` | Avisos y alertas |
| `--c-blue` | `#6C8BFF` | Acción secundaria |
| `--c-green` | `#2FD68F` | Aciertos, disponible |
| `--c-lilac` | `#B79DFF` | Casos, acento neutro |

**Sistema de acento (`--a`).** Cada tile de color declara solo `--a`; la superficie se deriva sola:
relleno `--a`, borde y sombra de tinta, texto negro (`--a-bg/--a-fg/--a-edge/--a-shd`), y
`--chip-bg/--chip-fg` para etiquetas con contraste garantizado.

Cada `section.unit` rota su acento (`--accent`) entre amarillo, verde, lila, coral y azul.
Contraste verificado con un script (texto normal ≥ 4.5:1, grande ≥ 3:1); los
numerales de contorno del portal son decorativos (`aria-hidden`).

## Layout bento

- **Sin tiles dentro de tiles.** El `.block` es texto abierto sobre una rejilla de 12 columnas:
  párrafos y listas en las columnas 1–7 (≈ 65 ch), `.note` y `blockquote` en 8–12 junto al párrafo
  que las precede, y láminas, `.two`, `.three`, glosarios, preguntas y tarjetas a todo el ancho.
  Las piezas con borde son los tiles; el texto no lleva caja.
- Cabecera (`header.top`): fichas de datos en colores, `h1` como tile amarillo, `.lede` y `.aviso`.
- Portal: hero asimétrico (título 8 / ficha + cita 4), banda de reglas en frase continua (no
  tarjetas de métricas), mosaico de 12 columnas con tiles de ancho distinto (7/5, 4/3/5, 5/3/4,
  3/9): disponibles en color, pendientes punteados, Pilar X en negro a todo el ancho.
- Prohibido: franjas laterales de color (`border-left` > 1 px), `repeating-linear-gradient`
  decorativos, numeración 01/02/03 como andamiaje, etiquetas diminutas en mayúsculas sobre cada
  sección, `border-radius` grande, texto con degradado.

## Láminas SVG

- Planas: los degradados heredados se aplanan por CSS (`stop-color` por sufijo de id: `-gk-clay`,
  `-gk-pine`, `-gk-gold`…) conservando la luminosidad original, para que los textos claros u
  oscuros de cada lámina sigan legibles.
- Trazo `--ink` de 2.2–2.5 px, sin filtros de sombra suave; la sombra dura la pone el `figure`.
- Las clases propias de las láminas del Repaso 2 (`.sv .h .d .m .fpine .fclay .fgold …`) viven
  en `brutal.css`.
- Identificadores únicos por lámina (prefijo exclusivo en `<defs>`) siguen siendo obligatorios.
- Todo diagrama es SVG inline accesible (`role="img"` + `aria-label`); nunca imágenes ni
  capturas de diapositivas.

## Motion design

Todo en `motion.js` + keyframes de `brutal.css`. **Regla de oro: el contenido es visible por
defecto; el motion solo mejora.** Nada se oculta esperando a que corra una animación o un
observer (las animaciones se pausan en pestañas ocultas y en renderizadores sin cabeza).

- Easing: ease-out expo/quart, sin rebote ni elástico. Solo `transform`, `translate`, `scale`,
  `opacity` y `clip-path`; no se animan propiedades de layout.
- Entrada de la cabecera y de los títulos palabra por palabra (máscara + subida con `backwards`).
- Revelado al hacer scroll con CSS `animation-timeline: view()` (solo desplazamiento, sin
  opacidad); sin soporte del navegador, simplemente no se anima.
- Láminas SVG: cada forma "salta" en cascada al entrar en pantalla (propiedad `scale`, no
  `transform`, para no pisar el atributo `transform` de los SVG).
- Cinta de texto en movimiento (`.ticker`), barra de progreso de lectura, TOC con sección activa,
  botones que se levantan al hover y se hunden al pulsar, inclinación 3D de tiles del portal.
- Autoevaluación: acierto = pulso + confeti; error = sacudida; la retroalimentación cae desde
  arriba; el marcador "rebota" al cambiar. Tarjetas de memoria: entran y giran en 3D.
- `prefers-reduced-motion: reduce` apaga todo (animaciones y transiciones).
- Escala de z-index: sticky 100 · progreso 200 · confeti 300.

## Reglas técnicas

- **Sin `<form>`** — eventos JS para cualquier interacción.
- **Sin selector de tema**: nada de `localStorage` ni `data-theme`; el smoke test comprueba que no
  quede código del modo noche. Orden de scripts: contenido de la página y, al final, motion.
- **Cero dependencias externas** salvo las fuentes de Google; abre directo en el navegador,
  sin servidor.
- **Responsive**: ≥ 390 px sin desbordamiento horizontal; objetivos táctiles ≥ 44 px.

## Estructura de página

Cabecera con el nombre de la Unidad + fecha(s) de clase + fuente citada, cuerpo dividido en
secciones por subtema (una por cada PDF/PPTX), y — en un Repaso — autoevaluación con
retroalimentación inmediata, dejando explícito en el propio HTML que es material de estudio
personal, no una simulación del Control real.
