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

## Paletas — Acrópolis del Bienestar (Modo Claro y Modo Oscuro)

### Modo Claro — Mármol Pentélico y Musgo

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F5F5F3` | Fondo general — blanco roto neutro de mármol pulido |
| `--bg-elev` | `#ECECE8` | Superficies elevadas: paneles, sillares de piedra, fichas |
| `--bg-elev2` | `#E2E2DC` | Superficies aún más elevadas / hover de relieve |
| `--border` | `#D3D3CC` | Bordes y junturas de cantería |
| `--text` | `#15181A` | Texto principal — tinta de inscripción sobre piedra |
| `--text-dim` | `#43494A` | Texto secundario, descripciones analíticas |
| `--text-faint` | `#5F655F` | Metadatos y etiquetas técnicas en mono |
| `--pine` | `#1F4B3F` | Acento dominante — verde pino: conceptos axiales, éxito |
| `--moss` | `#2E7A5C` | Verde claro — enlaces, acentos de follaje |
| `--clay` | `#A54A2A` | Acento secundario — terracota: ejemplos, hitos evaluativos |
| `--gold` | `#B8934A` | Oro ceremonial — distinciones académicas, coronas de lámina |
| `--danger` | `#B23347` | Errores, alertas críticas |

### Modo Oscuro — Basalto Volcánico y Bronce Patinado (`[data-theme="dark"]`)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#110F0D` | Fondo general — basalto nocturno cálido |
| `--bg-elev` | `#191613` | Superficies elevadas: losas de pórfido y piedra volcánica |
| `--bg-elev2` | `#25201A` | Superficies destacadas / hover nocturno |
| `--border` | `#3A332A` | Bordes en bronce envejecido y juntas sombreadas |
| `--text` | `#F5EFE6` | Texto principal — papiro marfil iluminado |
| `--text-dim` | `#C8C0B2` | Texto secundario de alta legibilidad nocturna |
| `--text-faint` | `#8C8273` | Metadatos y citas en mono |
| `--pine` | `#4E9B79` | Verde esmeralda luminoso |
| `--clay` | `#E07A5F` | Terracota suave iluminado |
| `--gold` | `#DFC07A` | Oro brillante ceremonial |
| `--danger` | `#E57373` | Alertas nocturnas |

## Reglas técnicas (Arquitectura visual y estándares web)

- **Sin `<form>`** — usar eventos JS para cualquier interacción (cuestionarios, repasos interactivos).
- **Relieve arquitectónico y volumen pétreo**: en lugar de sombras difusas indiscriminadas,
  se emplean bordes cincelados y gradientes vectoriales controlados en SVG inline para dar volumen
  de cantería clásica, adaptables dinámicamente entre luz solar y luz de antorcha mediante variables CSS.
- **Identificadores únicos por lámina**: todo elemento `<defs>` (filtros, gradientes, patrones,
  máscaras) dentro de un SVG debe llevar un prefijo exclusivo de su lámina (ej. `l01-`, `l02-`) para
  prevenir colisiones o referencias cruzadas cuando múltiples diagramas conviven en una misma página.
- **Tolerancia y accesibilidad en el selector de tema**: el script de tema en el `<head>` debe
  encapsular la lectura de `localStorage` en un bloque seguro (`try/catch`) para funcionar sin
  excepciones al abrirse como archivo local `file://` o en contextos con almacenamiento restringido.
  El botón de tema (`#theme-toggle`) debe comunicar su estado mediante `aria-pressed`.
- **Cero dependencias externas**: debe abrir directo en el navegador sin servidor ni build step.
- **Responsive**: diseño adaptado a pantallas de escritorio y dispositivos móviles (≥390px) sin
  desbordamiento horizontal.
- **Diagramas vectoriales**: cada figura conceptual es un SVG inline etiquetado y semántico; nunca
  imágenes rasterizadas externas ni capturas de diapositivas.
- **Cero estética de spa comercial**: sin flores de loto genéricas, sin degradados multicolores
  pastel y sin clisés de marketing "wellness". Motivos basados en orden dórico/jónico, metopas,
  grecas y cantería clásica.

## Estructura de página sugerida (mientras no haya una razón para desviarse)

Cabecera con el nombre de la Unidad + fecha(s) de clase + fuente citada, cuerpo dividido
en secciones claras por subtema (una por cada PDF/PPTX de esa unidad), y — cuando el
material sea un Repaso — preguntas de autoevaluación con retroalimentación inmediata,
dejando explícito en el propio HTML que es material de estudio personal, no una
simulación del Control real.
