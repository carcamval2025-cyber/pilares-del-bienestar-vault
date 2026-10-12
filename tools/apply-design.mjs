// Inyecta el sistema de diseño compartido (tools/design/*) en cada página de docs/.
// Uso: node tools/apply-design.mjs
// Es idempotente: reemplaza lo que haya entre los marcadores DESIGN / MOTION.
import { readFileSync, writeFileSync } from "node:fs";

const read = (f) => readFileSync(f, "utf8");
const brutal = read("tools/design/brutal.css").trim();
const portalCss = read("tools/design/portal.css").trim();
const motion = read("tools/design/motion.js").trim();

const study = [
  "docs/unidad-01/index.html",
  "docs/unidad-02/index.html",
  "docs/unidad-03/index.html",
  "docs/repaso-control-1/index.html",
  "docs/repaso-control-2/index.html",
];
const pages = [...study, "docs/index.html"];

const CSS_START = "/*DESIGN:START*/";
const CSS_END = "/*DESIGN:END*/";
const JS_START = "/*MOTION:START*/";
const JS_END = "/*MOTION:END*/";

for (const file of pages) {
  let html = read(file);
  const isPortal = file === "docs/index.html";
  const css = `${CSS_START}\n${brutal}\n${isPortal ? portalCss + "\n" : ""}${CSS_END}`;

  if (html.includes(CSS_START)) {
    const a = html.indexOf(CSS_START), b = html.indexOf(CSS_END) + CSS_END.length;
    html = html.slice(0, a) + css + html.slice(b);
  } else {
    // primera conversión: se sustituye todo el <style> heredado (estética griega)
    html = html.replace(/<style>[\s\S]*?<\/style>/, () => `<style>\n${css}\n</style>`);
  }

  const js = `<script id="motion">\n${JS_START}\n${motion}\n${JS_END}\n</script>`;
  if (html.includes(JS_START)) {
    html = html.replace(/<script id="motion">[\s\S]*?<\/script>/, () => js);
  } else {
    html = html.replace(/<\/body>/, () => `${js}\n</body>`);
  }

  if (!isPortal) {
    html = html
      .replace(/class="greek-frieze subtle"/g, 'class="stripe subtle"')
      .replace(/class="greek-frieze"/g, 'class="stripe"')
      .replace(/🏛 TEMPLO PRINCIPAL/g, "← PORTAL");
  }
  writeFileSync(file, html);
  console.log("diseño aplicado:", file);
}
