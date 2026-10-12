// Sustituye láminas SVG de docs/ por su versión redibujada en estilo clay/3D
// (tools/design/figures.mjs). Es idempotente: localiza cada figura por su número de lámina.
// Uso: node tools/apply-figures.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { FIGURES, FIGURE_MAP as MAP, FIGURE_PREFIX as PREFIX } from "./design/figures.mjs";

for (const [page, list] of Object.entries(MAP)) {
  const file = `docs/${page}/index.html`;
  let html = readFileSync(file, "utf8");
  for (const [num, gen] of list) {
    const re = new RegExp(`<svg[^>]*aria-label="Lámina ${num} —[^"]*"[^>]*>[\\s\\S]*?</svg>(?=</div><figcaption>)`);
    if (!re.test(html)) throw new Error(`${file}: no se encontró la lámina ${num}`);
    const svg = FIGURES[gen](`${PREFIX[page]}-f${num}`).replace(/\$/g, "$$$$");
    html = html.replace(re, svg);
  }
  writeFileSync(file, html);
  console.log("láminas clay aplicadas:", file, list.length);
}
