---
tags: [materiales, indice]
---

# Materiales Generados

Índice vivo del material de estudio producido (Guía HTML / Resumen / Repaso). **Nunca
incluye Foros, Controles, Dinámica vivencial, Ikigai, Propósito de vida ni Workbook** —
esos son siempre trabajo personal de Navas, ver la regla crítica en `AGENTS.md`.

Cada material es una nota individual dentro de esta carpeta (ver [[_Plantilla de
Material]] para crear una nueva); estas tablas se arman solas con Dataview a partir del
frontmatter de cada nota.

## Todos los materiales

```dataview
TABLE tipo AS "Tipo", unidad AS "Unidad", fecha AS "Fecha", archivo AS "Archivo", retro AS "Retroalimentación"
FROM "04 Materiales Generados"
WHERE tipo
SORT fecha DESC
```

_(Vacío por ahora — el vault se acaba de crear, 2026-09-10. El primer material aparecerá
aquí en cuanto se genere.)_

## Pendientes de retroalimentación

```dataview
TABLE tipo AS "Tipo", unidad AS "Unidad", fecha AS "Fecha", archivo AS "Archivo"
FROM "04 Materiales Generados"
WHERE tipo AND retro = "pendiente"
SORT fecha DESC
```

Cuando Navas dé retroalimentación sobre un material, actualizar el campo `retro` en la
nota de ese material (y registrar el detalle en [[Bitácora de Retroalimentación]]).
