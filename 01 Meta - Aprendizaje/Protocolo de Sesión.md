---
tags: [meta, protocolo]
---

# Protocolo de Sesión

Formato que debe traer (o que Claude debe pedir) cada solicitud de material de estudio:

```
UNIDAD:   [número romano y nombre, según Cronograma — ej. "Unidad III — Pilar intelectual"]
SUBTEMA:  [sección específica dentro de la unidad]
TIPO:     [Guía HTML / Resumen / Repaso — NUNCA Foro, Control, Ikigai, Propósito de vida o Workbook]
FORMATO:  [HTML / Markdown / Word — si se omite, se asume HTML]
OBJETIVO: [qué debe poder recordar o aplicar Navas, en sus propias palabras]
ALCANCE:  [qué clases de la unidad ya se impartieron y qué PDFs/PPTX ya se compartieron]
RESTRICCIONES: [extensión, nivel, etc. — si aplica, sino omitir]
```

## Antes de aceptar cualquier solicitud

- [ ] Confirmar que no se está pidiendo, ni disfrazado, contenido para Foro, Control,
      Dinámica vivencial, Ikigai, Propósito de vida o Workbook — si es así, recordar la
      regla crítica de `AGENTS.md` y ofrecer ayuda de revisión/formato en su lugar.
- [ ] La unidad coincide con el [[Cronograma]] y ya se impartió.
- [ ] El contenido no excede el ALCANCE declarado.
- [ ] Cada cifra o dato citado proviene de un PDF/PPTX de la unidad, del libro
      *Redefiniendo el éxito*, o de algo que Navas reportó directamente sobre sí mismo.

## Checklist antes de entregar cualquier material

- [ ] Si es HTML: paleta y tipografía correctas (ver [[Sistema de Diseño HTML]]), sin
      `<form>`, sin gradientes, funciona sin servidor.
- [ ] Se citó la fuente (unidad/clase) al pie del material.
- [ ] No se simulan preguntas de un Control real ni se redacta contenido de una
      evaluación personal.

## Después de entregar un material

1. Preguntar o esperar la retroalimentación de Navas.
2. Crear una nota nueva en `Bitácora/Entradas/` usando [[Plantilla - Entrada de Bitácora]].
3. Si aplica, actualizar [[Lecciones Aprendidas]].
4. Crear una nota nueva en [[04 Materiales Generados]] usando [[_Plantilla de Material]].
