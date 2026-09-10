import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import vm from "node:vm";

const pages = [
  "docs/index.html",
  "docs/repaso-control-1/index.html",
  "docs/unidad-01/index.html",
  "docs/unidad-02/index.html",
  "docs/unidad-03/index.html",
];

const read = (file) => readFileSync(file, "utf8");
const ids = (html) => [...html.matchAll(/\bid=(["'])([^"']+)\1/g)].map((match) => match[2]);
const scripts = (html) => [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map((match) => match[1]);

for (const page of pages) {
  const html = read(page);
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

  const [headTheme, , toggleTheme] = scripts(html);
  const rootAttributes = new Map();
  assert.doesNotThrow(() => vm.runInNewContext(headTheme, {
    document: { documentElement: { setAttribute: (name, value) => rootAttributes.set(name, value) } },
    localStorage: { getItem: () => { throw new Error("storage unavailable"); } },
    window: { matchMedia: () => ({ matches: false }) },
  }), `${page}: initial theme must tolerate unavailable storage`);

  const buttonAttributes = new Map();
  const elements = {
    "theme-icon": { textContent: "" },
    "theme-text": { textContent: "" },
    "theme-toggle": {
      onclick: null,
      setAttribute: (name, value) => buttonAttributes.set(name, value),
    },
  };
  const document = {
    readyState: "complete",
    documentElement: {
      getAttribute: (name) => rootAttributes.get(name),
      setAttribute: (name, value) => rootAttributes.set(name, value),
    },
    getElementById: (id) => elements[id] ?? null,
  };
  const context = {
    document,
    localStorage: { setItem: () => { throw new Error("storage unavailable"); } },
    window: {},
  };
  vm.runInNewContext(toggleTheme, context);
  assert.doesNotThrow(() => context.window.toggleTheme(), `${page}: toggle must tolerate unavailable storage`);
  assert.equal(buttonAttributes.get("aria-pressed"), "true", `${page}: toggle state is not announced`);
}

const portal = read("docs/index.html");
assert.match(portal, /25 reactivos con retroalimentación/);
assert.match(portal, /7–8 términos por unidad/);

for (const page of pages.slice(1)) {
  const html = read(page);
  const match = html.match(/var QUIZ = (\{.*\});\s*\n\s*\(function/s);
  assert.ok(match, `${page}: quiz data not found`);
  const quiz = JSON.parse(match[1]);
  const total = Object.values(quiz).reduce((sum, questions) => sum + questions.length, 0);
  assert.equal(total, page.includes("repaso-control-1") ? 25 : 5, `${page}: incorrect quiz total`);
}

console.log(`site smoke: ${pages.length} pages OK`);
