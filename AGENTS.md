# AGENTS.md — Vault Pilares del Bienestar

Este archivo es el punto de entrada agnóstico de herramienta: cualquier agente de IA
(Claude, Antigravity, Codex, Cursor, Aider, etc.) que abra esta carpeta debe leerlo
primero. A diferencia de `00 Inicio/00 Inicio.md` (pensado para Obsidian: usa
`[[wikilinks]]` y bloques Dataview que solo se renderizan con esos plugins), este
documento usa únicamente markdown plano y rutas de archivo relativas, para que
funcione igual sin Obsidian.

## Qué es esto

Base de conocimiento persistente para **Pilares del Bienestar** (ESEN, Ciclo III/2026,
profesora Ing. Gabriela Carranza — gcarranza@esen.edu.sv). Estudiante: Carlos Navas.

A diferencia de Modelos Macroeconómicos y Contabilidad Financiera, este curso **todavía
no tiene un Claude Project separado** con instrucciones maestras propias — este vault es,
por ahora, la única fuente escrita de reglas y contexto del curso para cualquier sesión de
IA. Todo lo que aparece en las reglas de abajo viene directamente del Programa del curso
(`Programa_Pilares_del_bienestar_2026_Gabriela_Carranza.pdf`, cargado el 2026-09-10). Si
Navas crea más adelante un Project dedicado a este curso, esa nota se vuelve la autoridad
y este archivo debe actualizarse para remitir a ella (como ya ocurre en los otros dos
vaults del usuario).

## Regla crítica — uso de IA en este curso (leer primero, no es igual a los otros cursos)

El Programa dice textualmente (sección VI, "Normas específicas: Pilares del Bienestar"):

> "Uso de la IA. Se permite el uso de IA solo como herramienta de revisión y formato para
> evaluaciones, más no de contenido. Todo el contenido deber ser 100% de autoría propia."

Esto es **más permisivo que Modelos Macroeconómicos** (que prohíbe la IA por completo en
tareas y pruebas) pero **más restrictivo que simplemente "no generar el control"**: la
prohibición es sobre el *contenido*, no solo sobre el instrumento de evaluación en sí.
En la práctica, para las seis actividades evaluadas del curso (Foros de discusión,
Controles, Dinámica vivencial, Ikigai, Propósito de vida, Workbook "Redefiniendo el
Éxito"):

- Claude **puede**: revisar redacción/ortografía/formato de un texto que Navas ya escribió
  él mismo: sugerir mejoras de claridad, señalar errores, dar formato a un documento,
  ayudar a estructurar visualmente un tablero de Ikigai que Navas ya definió
  conceptualmente, explicar un concepto de teoría para que Navas lo aplique con sus
  propias palabras.
- Claude **no puede**: escribir las respuestas de un foro, redactar el contenido de un
  Ikigai o de un Propósito de vida, completar entradas del Workbook, ni producir ningún
  borrador de Control (ni siquiera "solo para practicar") que pueda terminar copiado tal
  cual. Esto aplica incluso si Navas lo pide explícitamente — en ese caso, recordar la
  regla del Programa y ofrecer ayuda de revisión/formato en su lugar, nunca generar el
  contenido y luego advertir después.
- Los **Controles son siempre físicos y presenciales** (Programa, regla 3) — no tiene
  sentido generar un "Control HTML" como si fuera a resolverse en pantalla. Como mucho,
  un **material de repaso personal** (resumen de conceptos, preguntas de autoevaluación
  con retroalimentación inmediata, estilo Guía/Repaso de los otros vaults) puede ayudar a
  Navas a prepararse — dejando siempre clarísimo que es un repaso, no el control real, y
  sin simular las preguntas exactas de un control que aún no se ha tomado.

## Otras reglas que nunca se rompen (extraídas del Programa)

1. **Regla de alcance**: no producir material de estudio (resumen, guía, repaso) de una
   unidad que todavía no se ha impartido según `02 Curso/Cronograma.md`. Este curso no
   tiene libro de texto — el Programa dice explícitamente que "el contenido impartido
   durante las clases es la única fuente de información sujeta de evaluación" — así que
   el material real de cada unidad son los PDFs/PPTX de esa clase específica, no lo que
   Claude pueda saber de bienestar en general.
2. **Jerarquía de fuentes**, en este orden: (1) Programa y Cronograma del curso —
   autoridad máxima sobre alcance, fechas y ponderaciones; (2) PDFs y PPTX de cada clase,
   cargados por Navas; (3) Victoria Alger, *Redefiniendo el éxito* (lectura requerida,
   también es el Workbook evaluado); (4) sitios de referencia del Programa (Harvard
   Wellbeing Framework, National Wellness Institute), solo como contexto teórico general,
   nunca como fuente de cifras o afirmaciones específicas del curso.
3. **Nunca inventar resultados de tests de bienestar, cifras o "diagnósticos" sobre
   Navas.** Si un material de clase menciona un test (ej. el test de bienestar del 27 de
   agosto), usar solo lo que Navas reporte sobre sus propios resultados — nunca asumir ni
   generar un resultado hipotético como si fuera suyo.
4. Antes de generar cualquier material, exigir el formato de solicitud (ver
   `01 Meta - Aprendizaje/Protocolo de Sesión.md`) y preguntar si algo falta o es
   ambiguo — nunca asumir UNIDAD, TIPO o ALCANCE.

## Formato de solicitud sugerido antes de generar cualquier material de estudio

Ver `01 Meta - Aprendizaje/Protocolo de Sesión.md` para el detalle completo:

```
UNIDAD:   [número romano y nombre, según 02 Curso/Cronograma.md]
SUBTEMA:  [sección específica dentro de la unidad]
TIPO:     [Guía HTML / Resumen / Repaso — nunca Foro, Control, Ikigai, Propósito de vida o Workbook]
FORMATO:  [HTML / Markdown / Word — si se omite, se asume HTML como en los otros vaults]
OBJETIVO: [qué debe poder recordar o aplicar Navas después, en sus propias palabras]
ALCANCE:  [qué clases de la unidad ya se impartieron y qué PDFs/PPTX ya se compartieron]
RESTRICCIONES: [extensión, nivel, etc. — si aplica]
```

## Estructura de carpetas

- `00 Inicio/` — nota índice del vault (`00 Inicio.md`), pensada para Obsidian.
- `01 Meta - Aprendizaje/` — `Protocolo de Sesión.md`, `Bitácora de Retroalimentación.md`
  (registro de qué funcionó/falló en cada material — vacía por ahora), `Lecciones
  Aprendidas.md` (vacía por ahora).
- `02 Curso/` — `Cronograma.md` (calendario oficial del Programa, con las 10 unidades,
  controles y entregas), `Sistema de Evaluación.md` (ponderación de las 6 actividades
  evaluadas), `Fuentes y Bibliografía.md` (jerarquía de fuentes), `Sistema de Diseño
  HTML.md` (paleta y componentes para material de estudio en HTML).
- `03 Unidades/` — una nota por unidad (Unidad I … Unidad X, siguiendo la numeración del
  propio Programa — no "Tema", que es como se llaman en los otros dos vaults del usuario).
- `04 Materiales Generados/` — índice de material de estudio ya producido (actualmente
  vacío) y `_Plantilla de Material.md` para registrar uno nuevo.
- `README.md` — una línea, identificación del repositorio.
- `docs/` — sitio estático publicado en GitHub Pages: `https://carcamval2025-cyber.github.io/pilares-del-bienestar-vault/`. `docs/index.html` contiene el scaffold interactivo de la fachada de diez columnas del bienestar.

## Sistema de diseño HTML (solo para Guía / Resumen / Repaso — nunca para Foro, Control, Ikigai, Propósito de vida o Workbook)

Ver `02 Curso/Sistema de Diseño HTML.md` para la especificación completa. Identidad
visual basada en una **arquitectura clásica griega y orden jónico/dórico ("Acrópolis del Bienestar")**:
- **Modo Claro (Día en la Acrópolis)**: Mármol pentélico claro, líneas en tinta pino y
  acentos en terracota y oro ceremonial.
- **Modo Oscuro (Noche en la Acrópolis)**: Basalto volcánico y pórfido oscuro (`#110F0D` /
  `#191613`), bordes en bronce patinado (`#3A332A`) y acentos iluminados en oro (`#DFC07A`),
  pino esmeralda (`#4E9B79`) y terracota (`#E07A5F`).
- Se evita terminantemente la estética genérica de aplicaciones de "wellness" comercial (sin
  pasteles deslavados, sin íconos de spa o flores de loto genéricas).

Reglas técnicas del sistema:
- Sin `<form>` — usar eventos JS nativos y accesibles para interactividad.
- Estilo arquitectónico en bajorrelieve: se autoriza el uso controlado de sombras cinceladas
  y gradientes vectoriales dentro de los SVG inline para conferir volumen pétreo y soportar la
  transición dinámica entre luz diurna y modo nocturno mediante variables CSS.
- **Identificadores únicos en SVGs**: cada lámina vectorial debe utilizar prefijos o identificadores
  únicos en sus `<defs>` (gradientes, filtros, clips) para evitar colisiones al agregarse en páginas
  de repaso general.
- Cero dependencias externas: debe abrir directamente en navegador sin servidor ni build step.
- Todo diagrama o ilustración debe ser SVG inline accesible y semántico; nunca imágenes externas
  ni capturas de diapositivas de clase.
- Modo oscuro con prevención de destello (*zero-flash*): detección temprana en `<head>` y tolerancia
  a entornos sin `localStorage`.

## GitHub Pages (`docs/`) — activo

Repositorio público: `https://github.com/carcamval2025-cyber/pilares-del-bienestar-vault`
Sitio en vivo: `https://carcamval2025-cyber.github.io/pilares-del-bienestar-vault/`
Rama de despliegue: `main`, carpeta `/docs`.

**Regla que no se negocia sobre este sitio, igual que en los otros vaults**: `docs/` es
público en internet. Nunca publicar ahí un Foro, un Control, un Ikigai, un Propósito de
vida o el Workbook — esos son siempre trabajo personal de Navas, nunca contenido generado
por IA, y nunca se suben a un sitio público.

**Convención para agregar una página cuando se genere el primer material real de una
Unidad** (Guía HTML / Resumen / Repaso):
1. Publicar el HTML en `docs/unidad-0N/index.html`.
2. En `docs/index.html`, dentro del arreglo `UNIDADES` del `<script>`, cambiar
   `disponible:false` a `disponible:true` para esa Unidad.
3. Registrar la publicación en `04 Materiales Generados/` con `_Plantilla de Material.md`.

## Cómo trabajar aquí

1. Antes de generar material: revisar `01 Meta - Aprendizaje/Lecciones Aprendidas.md` y la
   nota de la Unidad correspondiente en `03 Unidades/`.
2. Exigir el formato de solicitud completo antes de generar nada; si falta un campo o hay
   ambigüedad de alcance, preguntar a Navas.
3. Verificar que la unidad ya se haya impartido según `02 Curso/Cronograma.md` antes de
   producir cualquier material.
4. Recordar en todo momento la regla crítica de uso de IA de arriba — está para proteger a
   Navas de una sanción académica, no es una formalidad.
5. Después de generar: registrar el resultado en `04 Materiales Generados/` y, tras
   recibir retroalimentación, añadir una entrada en `01 Meta - Aprendizaje/Bitácora de
   Retroalimentación.md`; promover patrones repetidos a `Lecciones Aprendidas.md`.
6. Si el material es Guía/Resumen/Repaso: además de entregarlo a Navas, seguir la
   convención de "GitHub Pages" de arriba para publicarlo en `docs/` cuando el repositorio
   ya exista.

## Ver también (rutas de archivo, no wikilinks)

- `00 Inicio/00 Inicio.md` — mapa del vault pensado para Obsidian (con Dataview).
- `01 Meta - Aprendizaje/Protocolo de Sesión.md`
- `02 Curso/Cronograma.md`
- `02 Curso/Sistema de Evaluación.md`
- `02 Curso/Fuentes y Bibliografía.md`
- `02 Curso/Sistema de Diseño HTML.md`
- `docs/index.html` — scaffold del sitio, aún no publicado.
