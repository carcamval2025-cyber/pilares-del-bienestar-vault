import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const pages = [
  "docs/index.html",
  "docs/repaso-control-1/index.html",
  "docs/repaso-control-2/index.html",
  "docs/unidad-01/index.html",
  "docs/unidad-02/index.html",
  "docs/unidad-03/index.html",
];

const read = (file) => readFileSync(file, "utf8");
const brutalCss = read("tools/design/brutal.css").trim();
const portalCss = read("tools/design/portal.css").trim();
const motionJs = read("tools/design/motion.js").trim();
const { FIGURES, FIGURE_MAP, FIGURE_PREFIX } = await import("../tools/design/figures.mjs");
const ids = (html) => [...html.matchAll(/\bid=(["'])([^"']+)\1/g)].map((match) => match[2]);
const scripts = (html) => [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

for (const page of pages) {
  const html = read(page);
  // el sistema de diseño compartido debe estar inyectado (node tools/apply-design.mjs)
  assert.ok(html.includes(brutalCss), `${page}: CSS desactualizado, corre node tools/apply-design.mjs`);
  assert.ok(html.includes(motionJs), `${page}: motion.js desactualizado, corre node tools/apply-design.mjs`);
  if (page === "docs/index.html") assert.ok(html.includes(portalCss), `${page}: portal.css desactualizado`);
  assert.equal((html.match(/@import/g) || []).length, 1, `${page}: debe haber un solo @import`);
  // las láminas clay deben coincidir con tools/design/figures.mjs (node tools/apply-figures.mjs)
  const pageKey = page.split("/")[1];
  for (const [num, gen] of FIGURE_MAP[pageKey] || []) {
    assert.ok(html.includes(FIGURES[gen](`${FIGURE_PREFIX[pageKey]}-f${num}`)), `${page}: lámina ${num} (${gen}) desactualizada, corre node tools/apply-figures.mjs`);
  }
  const pageIds = ids(html);
  assert.equal(new Set(pageIds).size, pageIds.length, `${page}: duplicate id`);
  for (const [, reference] of html.matchAll(/url\(#([^)]+)\)/g)) {
    assert.ok(pageIds.includes(reference), `${page}: missing SVG reference #${reference}`);
  }

  for (const script of scripts(html)) Function(script);

  for (const [, , href] of html.matchAll(/<a\b[^>]*\bhref=(["'])([^"']+)\1/gi)) {
    if (/^(?:https?:|mailto:)/.test(href)) continue;
    const [relative, fragment] = href.split("#", 2);
    let target = relative ? join(dirname(page), relative) : page;
    if (relative.endsWith("/")) target = join(target, "index.html");
    assert.ok(existsSync(target), `${page}: missing link target ${href}`);
    if (fragment) assert.ok(ids(read(target)).includes(fragment), `${page}: missing fragment ${href}`);
  }

  // solo modo claro: no debe quedar rastro del selector de tema
  assert.ok(!html.includes("pb_theme") && !html.includes('id="theme-toggle"'), `${page}: queda código del modo noche`);
  assert.ok(!html.includes('data-theme="dark"'), `${page}: queda CSS del modo noche`);
}

const portal = read("docs/index.html");
assert.match(portal, /25 reactivos con retroalimentación/);
assert.match(portal, /7–8 términos por unidad/);

for (const page of pages.slice(1)) {
  const html = read(page);
  const match = html.match(/var QUIZ = (\{.*?\});\s*\n\s*(?:var DECKS|\(function)/s);
  assert.ok(match, `${page}: quiz data not found`);
  const quiz = JSON.parse(match[1]);
  const total = Object.values(quiz).reduce((sum, questions) => sum + questions.length, 0);
  const expected = page.includes("repaso-control-1") ? 25 : page.includes("repaso-control-2") ? 28 : 5;
  assert.equal(total, expected, `${page}: incorrect quiz total`);
  if (page.includes("repaso-control-2")) {
    const dm = html.match(/var DECKS = (\{.*?\});\s*\n\s*\(function/s);
    assert.ok(dm, `${page}: deck data not found`);
    const decks = JSON.parse(dm[1]);
    assert.equal(Object.values(decks).reduce((s, d) => s + d.length, 0), 36, `${page}: incorrect deck total`);
  }
}

console.log(`site smoke: ${pages.length} pages OK`);
