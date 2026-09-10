---
tags: [curso, diseno, html]
---

# Sistema de Diseño — Materiales HTML

Aplica a Guías, Resúmenes y Repasos en HTML (nunca a Foro, Control, Ikigai, Propósito de
vida o Workbook — esos son siempre trabajo personal de Navas, no un archivo que Claude
entregue), y al sitio publicado en `docs/`.

**Identidad intencionalmente distinta** a los otros dos vaults del usuario: navy + rose
(claro) en Contabilidad Financiera, índigo + coral (oscuro) en Modelos Macroeconómicos.
Aquí: **"piedra y musgo"** — tema claro, editorial, con motivo arquitectónico (plano
técnico / lámina de arquitecto) en vez de tarjetas genéricas. Fondo neutro real (sin tinte
cálido tipo crema/arena — ese es el default genérico de interfaces con IA), tinta verde
pino como acento dominante y terracota como acento secundario cálido. Se evita a propósito
la estética genérica de apps de bienestar comercial (nada de verde menta pastel, íconos de
hoja/loto, gradientes, o grillas de tarjetas idénticas).

**Motivo recurrente: la columna.** "Pilares del bienestar" se toma literal — el diagrama
de referencia del sitio (`docs/index.html`) es una fachada de 10 columnas, una por unidad,
con un panel de ficha técnica que se actualiza al pasar el cursor o tocar cada columna.
Reutilizar este motivo (columna, fachada, plano técnico, cajetín de datos tipo lámina de
arquitecto) en diagramas de Panel 1 cuando tenga sentido, en vez de recurrir a íconos de
bienestar genéricos.

## Tipografía

- **Instrument Serif** (Google Fonts) — títulos (`h1`–`h3`). Serif editorial con
  itálicas expresivas; usar la itálica para dar énfasis puntual a una palabra clave
  dentro de un título, no para cuerpos de texto completos.
- **Work Sans** (400/500/600/700) — texto general, cuerpo, componentes de UI.
- **IBM Plex Mono** (500/600) — metadatos (fechas, unidad, badges de estado), cajetines
  tipo lámina técnica, citas de fuente al pie de cada material.

*(Deliberadamente distinta a Fraunces+Inter+JetBrains Mono de Macro y a Playfair+DM Sans
de Contabilidad — mismo principio de pareja tipográfica con contraste serif/sans, fuentes
distintas. La tipografía no cambió en la revisión de color — solo la paleta y la
composición.)*

## Paleta — Piedra y musgo (tema claro)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F5F5F3` | Fondo general — blanco roto neutro, sin tinte cálido de "crema" |
| `--bg-elev` | `#ECECE8` | Superficies elevadas: paneles, fichas, cajetines |
| `--bg-elev2` | `#E2E2DC` | Superficies aún más elevadas / hover |
| `--border` | `#D3D3CC` | Bordes sutiles entre superficies |
| `--text` | `#15181A` | Texto principal — tinta casi negra, no negro puro |
| `--text-dim` | `#43494A` | Texto secundario, cuerpo largo |
| `--text-faint` | `#5F655F` | Metadatos, etiquetas pequeñas en mono |
| `--pine` | `#1F4B3F` | Acento dominante — verde pino: títulos en énfasis, ficha activa, éxito |
| `--moss` | `#2E7A5C` | Verde más claro — enlaces, hover suave |
| `--clay` | `#A54A2A` | Acento secundario — terracota: ejemplo aplicado, hitos de evaluación |
| `--sage` | `#6E8B78` | Acento terciario, uso puntual — unidades IX (ambiental) y X (balance) |
| `--success` | `#1F4B3F` | Respuestas correctas en repasos (mismo verde pino) |
| `--danger` | `#B23347` | Errores, avisos, el sello "nunca evaluaciones publicadas" |

Todos los pares texto/fondo relevantes fueron verificados contra WCAG AA (≥4.5:1 para
texto normal): `--text`/`--bg` = 16.3:1, `--text-dim`/`--bg` = 8.4:1, `--text-dim`/
`--bg-elev` = 7.7:1, `--text-faint`/`--bg` = 5.5:1, `--text-faint`/`--bg-elev` = 5.1:1,
`--pine`/`--bg` = 9.0:1, `--moss`/`--bg` = 4.7:1, `--clay`/`--bg` = 5.8:1, `--clay`/
`--bg-elev` = 5.4:1, `--danger`/`--bg-elev` = 5.1:1. `--moss` y `--clay` se reservan para
texto sobre `--bg`; sobre `--bg-elev` usar `--pine` o `--clay` (ya verificado), no `--moss`
para texto pequeño.

## Cómo se relaciona cada Unidad con un acento (para diagramas y badges)

No se le asigna un color distinto a cada una de las 10 unidades (serían demasiados
acentos y perdería cohesión) — en su lugar, los colores de acento se usan por *función*,
no por unidad:

- **Verde pino** — concepto central / idea principal de cualquier unidad, estado activo.
- **Terracota** — ejemplo aplicado, historia personal, cita de un testimonio, hito de
  evaluación (Control, entrega).
- **Sage** — balance, naturaleza, unidades IX (ambiental) y X (la clave está en el
  balance) cuando se necesite un acento propio.
- **Verde musgo** — enlaces y llamadas a la acción secundarias (solo sobre `--bg`).

## Reglas técnicas (heredadas del resto del sistema del usuario)

- Sin `<form>` — usar eventos JS para cualquier interacción (quiz, repaso, reflexión
  guiada).
- Sin gradientes ni sombras decorativas — superficies planas, profundidad por color de
  fondo (`--bg` → `--bg-elev` → `--bg-elev2`), no por `box-shadow` difuso.
- Sin grillas de tarjetas idénticas como patrón por defecto — preferir un diagrama
  interactivo (como la fachada de columnas) a repetir la misma tarjeta 10 veces.
- Debe abrir directo en el navegador sin servidor ni build (HTML/CSS/JS plano en un solo
  archivo).
- Responsive para escritorio y para el teléfono de Navas — un diagrama ancho (como la
  fachada) puede desplazarse horizontalmente dentro de su propio contenedor en pantallas
  angostas; la página en sí nunca hace scroll horizontal.
- Cualquier diagrama (ej. las 8 dimensiones del bienestar, la pirámide de Maslow, el
  modelo PERMA) siempre como SVG inline etiquetado — nunca una imagen externa ni una
  captura de las diapositivas de la profesora.
- Radios de tarjeta moderados (≤16px) — nunca "insanamente redondeado".
- Nada de iconografía de spa/wellness genérica (lotos, hojas sueltas, manos en posición
  de meditación) — si un ícono ayuda, usar el mismo estilo de línea SVG limpia que en los
  otros dos vaults del usuario, o el motivo de columna/plano técnico propio de este vault.

## Estructura de página sugerida (mientras no haya una razón para desviarse)

Cabecera con el nombre de la Unidad + fecha(s) de clase + fuente citada, cuerpo dividido
en secciones claras por subtema (una por cada PDF/PPTX de esa unidad), y — cuando el
material sea un Repaso — preguntas de autoevaluación con retroalimentación inmediata,
dejando explícito en el propio HTML que es material de estudio personal, no una
simulación del Control real.
