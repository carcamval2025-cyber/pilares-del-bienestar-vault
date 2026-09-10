---
tags: [plantilla]
---

# Plantilla — nueva nota de material

Para que un material nuevo aparezca solo en el índice y en la nota de su Unidad, crear
una nota nueva dentro de esta misma carpeta ("04 Materiales Generados") con este
frontmatter al inicio, completado:

```yaml
---
tags: [material]
tipo: "Guía HTML"          # Guía HTML / Resumen / Repaso — nunca Foro/Control/Ikigai/Propósito de vida/Workbook
unidad: 1                  # número de unidad (1-10)
fecha: 2026-09-10          # fecha en que se generó
archivo: "nombre-del-archivo.html"   # nombre de archivo, o enlace si se publicó como Artifact
retro: "pendiente"         # pendiente / positiva / con ajustes — actualizar tras la retroalimentación de Navas
---
```

Debajo del frontmatter, describir brevemente el material (objetivo, alcance cubierto) y
enlazar de vuelta a la nota de la Unidad correspondiente, por ejemplo:
`Ver [[Unidad I - Redefiniendo el éxito y pilares del bienestar]]`.

Antes de crear esta nota, confirmar que el `tipo` no es en realidad una de las
actividades evaluadas (Foro, Control, Dinámica vivencial, Ikigai, Propósito de vida,
Workbook) — esas nunca se registran aquí como "material generado por Claude" porque
nunca deben serlo.

Esta nota-plantilla no aparece en las tablas de Dataview porque no tiene los campos
`tipo`/`unidad` en su propio frontmatter.
