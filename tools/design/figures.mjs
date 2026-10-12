// Láminas redibujadas en estilo "clay / 3D": formas con volumen (degradados radiales y
// lineales, extrusión dura, brillo) sobre la paleta del sistema. Todo vector, sin filtros
// pesados. Cada función recibe un prefijo para que los ids de <defs> sean únicos por página.
//
// Los textos son los mismos de las láminas originales (salen de los PDF/PPTX de clase).

const INK = "#0A0B10";
export const PAL = { yellow: "#FFD60A", coral: "#FF5C3D", blue: "#6C8BFF", green: "#2FD68F", lilac: "#B79DFF", stone: "#CDD2E0", white: "#FFFFFF" };

const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (a) => "#" + a.map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
export const light = (h, t) => hex(rgb(h).map((v) => v + (255 - v) * t));
export const dark = (h, t) => hex(rgb(h).map((v) => v * (1 - t)));
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Gradientes "clay" para un color: esfera, cuerpo de cilindro, cara superior y cara plana. */
export function clayDefs(p, colors) {
  let d = "";
  for (const [name, c] of Object.entries(colors)) {
    d += `<radialGradient id="${p}-s-${name}" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="${light(c, 0.55)}"/><stop offset=".38" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, 0.32)}"/></radialGradient>`;
    d += `<linearGradient id="${p}-v-${name}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="${dark(c, 0.26)}"/><stop offset=".2" stop-color="${c}"/><stop offset=".48" stop-color="${light(c, 0.32)}"/><stop offset="1" stop-color="${dark(c, 0.34)}"/></linearGradient>`;
    d += `<radialGradient id="${p}-t-${name}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="${light(c, 0.62)}"/><stop offset="1" stop-color="${light(c, 0.12)}"/></radialGradient>`;
    d += `<linearGradient id="${p}-f-${name}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${light(c, 0.34)}"/><stop offset=".45" stop-color="${c}"/><stop offset="1" stop-color="${dark(c, 0.2)}"/></linearGradient>`;
  }
  d += `<filter id="${p}-blur" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>`;
  return `<defs>${d}</defs>`;
}

/** Sombra de contacto en el suelo. */
export const ground = (p, cx, cy, rx, ry = rx * 0.22, o = 0.3) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${INK}" opacity="${o}" filter="url(#${p}-blur)"/>`;

/** Esfera clay con brillo. */
export function sphere(p, cx, cy, r, name, c) {
  return (
    ground(p, cx + r * 0.1, cy + r * 1.02, r * 0.9, r * 0.2, 0.28) +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-s-${name})" stroke="${dark(c, 0.5)}" stroke-width="2"/>` +
    `<ellipse cx="${cx - r * 0.36}" cy="${cy - r * 0.42}" rx="${r * 0.3}" ry="${r * 0.17}" fill="#fff" opacity=".6" transform="rotate(-32 ${cx - r * 0.36} ${cy - r * 0.42})"/>`
  );
}

/** Cilindro clay (columna/poste) con tapa elíptica. */
export function cylinder(p, cx, top, w, h, name, c, ry = w * 0.2) {
  const x0 = cx - w / 2, x1 = cx + w / 2, yb = top + h;
  return (
    ground(p, cx + w * 0.08, yb + ry * 0.8, w * 0.62, ry * 0.8, 0.3) +
    `<path d="M${x0} ${top + ry} V${yb} A${w / 2} ${ry} 0 0 0 ${x1} ${yb} V${top + ry} Z" fill="url(#${p}-v-${name})" stroke="${dark(c, 0.5)}" stroke-width="2" stroke-linejoin="round"/>` +
    `<ellipse cx="${cx}" cy="${top + ry}" rx="${w / 2}" ry="${ry}" fill="url(#${p}-t-${name})" stroke="${dark(c, 0.5)}" stroke-width="2"/>`
  );
}

/** Tarjeta blanca con borde y sombra dura (el lenguaje "brutal" que convive con el clay). */
export function card(x, y, w, h, { fill = "#fff", r = 12, sh = 5, stroke = 2.5 } = {}) {
  return `<rect x="${x + sh}" y="${y + sh}" width="${w}" height="${h}" rx="${r}" fill="${INK}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${INK}" stroke-width="${stroke}"/>`;
}

export const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" class="${o.cls || "d"}" font-size="${o.size || 13}" text-anchor="${o.anchor || "start"}"${o.fill ? ` style="fill:${o.fill}"` : ""}>${esc(s)}</text>`;

const svgOpen = (vb, label, minw = 680) =>
  `<svg class="sv" style="min-width:${minw}px; width:100%;" viewBox="${vb}" role="img" aria-label="${esc(label)}">`;

/* ---------------------------------------------------------------------------------- */
/* Lámina — Pirámide de Maslow (3D)                                                    */
/* ---------------------------------------------------------------------------------- */
export function maslow(p) {
  const tiers = [
    // [nombre, color, yTop, yBot, wBottom, wTop]
    ["fis", PAL.blue, 270, 328, 420, 366],
    ["seg", PAL.coral, 206, 264, 356, 302],
    ["afi", PAL.green, 142, 200, 292, 238],
    ["est", PAL.lilac, 78, 136, 228, 174],
    ["apx", PAL.yellow, 8, 72, 110, 0],
  ];
  const cx = 226;
  let defs = clayDefs(p, { fis: PAL.blue, seg: PAL.coral, afi: PAL.green, est: PAL.lilac, apx: PAL.yellow });
  let body = ground(p, cx + 20, 336, 230, 12, 0.35);
  for (const [n, c, yt, yb, wb, wt] of tiers) {
    const pts = (dx, dy) => `${cx - wt / 2 + dx},${yt + dy} ${cx + wt / 2 + dx},${yt + dy} ${cx + wb / 2 + dx},${yb + dy} ${cx - wb / 2 + dx},${yb + dy}`;
    body += `<polygon points="${pts(12, 9)}" fill="${dark(c, 0.55)}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    body += `<polygon points="${pts(0, 0)}" fill="url(#${p}-f-${n})" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
    // brillo superior
    const l = cx - wt / 2 + (wb - wt) / 2 * 0.1 + 8, r = cx + wt / 2 - 8;
    if (wt > 20) body += `<path d="M${l + 4} ${yt + 6} H${r - 4}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".6"/>`;
  }
  const lab = (y, s, o = {}) => T(cx, y, s, { cls: "h", anchor: "middle", size: o.size || 15, fill: INK });
  body += T(cx, 52, "AUTOR-", { cls: "h", anchor: "middle", size: 10 });
  body += T(cx, 64, "REALIZACIÓN", { cls: "h", anchor: "middle", size: 9.5 });
  body += lab(112, "ESTIMA") + lab(176, "AFILIACIÓN Y AMOR") + lab(240, "SEGURIDAD");
  body += lab(294, "FISIOLÓGICAS");
  body += T(cx, 313, "base de supervivencia · dormir", { cls: "d", anchor: "middle", size: 12.5, fill: INK });

  const pills = [
    [40, PAL.yellow, "AUTORREALIZACIÓN · CÚSPIDE", "Máximo potencial personal · creatividad, juicio ético y espontaneidad.", 46],
    [107, PAL.lilac, "ESTIMA Y RECONOCIMIENTO", "Sentirse valorado por uno mismo y otros · confianza, logro y respeto.", 46],
    [171, PAL.green, "AFILIACIÓN Y CONEXIÓN SOCIAL", "Conexión con otros seres · amistad, amor, intimidad y pertenencia.", 46],
    [235, PAL.coral, "SEGURIDAD Y PROTECCIÓN", "Física, financiera, de salud y personal · estabilidad frente a amenazas.", 46],
  ];
  const X = 480, W = 424;
  for (const [yc, c, t, d, h] of pills) {
    const tr = tiers.find((t) => (t[2] + t[3]) / 2 === yc);
    const xr = cx + (tr[4] + tr[5]) / 4 + 18;
    body += `<line x1="${xr}" y1="${yc}" x2="${X}" y2="${yc}" stroke="${INK}" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/>`;
    body += card(X, yc - h / 2, W, h);
    body += `<circle cx="${X + 20}" cy="${yc}" r="9" fill="${c}" stroke="${INK}" stroke-width="2.5"/>`;
    body += T(X + 40, yc - 4, t, { cls: "h", size: 13.5 }) + T(X + 40, yc + 14, d, { cls: "d", size: 12.2 });
  }
  const yc = 299, h = 68;
  body += `<line x1="${cx + 210 + 20}" y1="${yc}" x2="${X}" y2="${yc}" stroke="${INK}" stroke-width="2" stroke-dasharray="5 5" opacity=".6"/>`;
  body += card(X, yc - h / 2, W, h, { fill: "#FFD6CC" });
  body += `<circle cx="${X + 20}" cy="${yc - 12}" r="9" fill="${PAL.blue}" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(X + 40, yc - 16, "NECESIDADES FISIOLÓGICAS · FUNDAMENTO VITAL", { cls: "h", size: 13.5 });
  body += T(X + 40, yc + 1, "respirar · comer · beber · DORMIR · homeostasis", { cls: "d", size: 12.2 });
  body += T(X + 40, yc + 19, "↑ PUENTE DIRECTO CON LA UNIDAD II (SUEÑO Y NUTRICIÓN)", { cls: "m cl", size: 11.5 });
  return (
    svgOpen("0 0 920 346", "Lámina 2 — Pirámide de necesidades de Maslow con cinco niveles y rótulos de clase") + defs + body + "</svg>"
  );
}



/* ---------------------------------------------------------------------------------- */
/* Lámina — Las 8 dimensiones (cilindros clay sobre una losa)                           */
/* ---------------------------------------------------------------------------------- */
export function dims8(p) {
  const dims = [
    ["FÍSICA", "PHYSICAL", "green", "UNIDAD II"],
    ["INTELECTUAL", "INTELLECTUAL", "green", "UNIDAD III"],
    ["EMOCIONAL", "EMOTIONAL", "stone"],
    ["SOCIAL", "SOCIAL", "stone"],
    ["FINANCIERA", "FINANCIAL", "stone"],
    ["OCUPACIONAL", "OCCUPATIONAL", "stone"],
    ["ESPIRITUAL", "SPIRITUAL", "stone"],
    ["AMBIENTAL", "ENVIRONMENTAL", "stone"],
  ];
  let body = clayDefs(p, { green: PAL.green, stone: PAL.stone, yellow: PAL.yellow });
  // losa
  body += `<rect x="30" y="186" width="868" height="26" rx="10" fill="${dark(PAL.stone, 0.5)}" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<rect x="20" y="176" width="868" height="26" rx="10" fill="url(#${p}-f-stone)" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<path d="M34 182 H874" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".7"/>`;
  dims.forEach(([es, en, col, tag], i) => {
    const cx = 74 + i * 110.4, c = PAL[col];
    body += cylinder(p, cx, 52, 64, 112, col, c, 13);
    if (tag) {
      body += `<rect x="${cx - 40}" y="12" width="80" height="22" rx="6" fill="${PAL.coral}" stroke="${INK}" stroke-width="2.5"/>` + T(cx, 28, tag, { cls: "h", anchor: "middle", size: 11, fill: INK });
    }
    body += card(cx - 51, 222, 102, 52, { sh: 4, r: 10 });
    body += T(cx, 244, es, { cls: "h", anchor: "middle", size: 12.5 }) + T(cx, 262, en, { cls: "m", anchor: "middle", size: 10.5 });
  });
  body += `<rect x="20" y="294" width="880" height="34" rx="10" fill="#FFF0A0" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(460, 316, "EN EL PDF APARECEN SOLO CON SUS NOMBRES, EN INGLÉS — NO HAY DEFINICIÓN POR DIMENSIÓN", { cls: "h", anchor: "middle", size: 12 });
  return svgOpen("0 0 920 338", "Lámina 3 — Las 8 dimensiones del bienestar: física e intelectual (Unidades II y III) resaltadas") + body + "</svg>";
}

/* ---------------------------------------------------------------------------------- */
/* Lámina — Las seis hormonas (esferas clay sobre fichas)                               */
/* ---------------------------------------------------------------------------------- */
export function hormonas(p) {
  const H = [
    ["SUEÑO", "blue", ["Melatonina"], ["Regula los ciclos", "circadianos"], "inductor natural"],
    ["ESTRÉS", "coral", ["Cortisol"], ["Hormona del", "estrés crónico"], "alerta matutina"],
    ["ESTRÉS", "coral", ["Adrenalina /", "Noradrenalina"], ["Respuesta", "inmediata de lucha"], "reflejo agudo"],
    ["RECUPERACIÓN", "green", ["H. Crecimiento", "& Testosterona"], ["Regeneración celular", "& masa muscular"], "pico en NREM 3"],
    ["PLACER & FOCO", "yellow", ["Dopamina"], ["Motivación, foco", "& recompensa"], "impulso y acción"],
    ["PLACER & CALMA", "lilac", ["Serotonina"], ["Bienestar general,", "ánimo y calma"], "serenidad interna"],
  ];
  let body = clayDefs(p, { blue: PAL.blue, coral: PAL.coral, green: PAL.green, yellow: PAL.yellow, lilac: PAL.lilac });
  H.forEach(([cat, col, nm, ds, note], i) => {
    const x = 6 + i * 152, w = 140, top = 40, h = 188, cx = x + w / 2, c = PAL[col];
    body += card(x, top, w, h, { sh: 5, r: 14 });
    body += `<path d="M${x + 1.25} ${top + 52} V${top + 14} Q${x + 1.25} ${top + 1.25} ${x + 15} ${top + 1.25} H${x + w - 15} Q${x + w - 1.25} ${top + 1.25} ${x + w - 1.25} ${top + 14} V${top + 52} Z" fill="${light(c, 0.78)}"/>`;
    body += sphere(p, cx, top + 22, 28, col, c);
    body += T(cx, top + 27, String(i + 1).padStart(2, "0"), { cls: "h", anchor: "middle", size: 15, fill: INK });
    const ny = nm.length === 1 ? top + 88 : top + 82;
    nm.forEach((l, k) => (body += T(cx, ny + k * 15, l, { cls: "h", anchor: "middle", size: 14.5 })));
    body += `<rect x="${cx - 55}" y="${top + 108}" width="110" height="20" rx="10" fill="${c}" stroke="${INK}" stroke-width="2"/>` + T(cx, top + 122, cat, { cls: "h", anchor: "middle", size: 10.5, fill: INK });
    ds.forEach((l, k) => (body += T(cx, top + 148 + k * 15, l, { cls: "d", anchor: "middle", size: 12 })));
    body += T(cx, top + 180, note, { cls: "m", anchor: "middle", size: 10.5 });
  });
  return svgOpen("0 0 920 252", "Lámina 5 — Las seis hormonas: directoras de la orquesta") + body + "</svg>";
}

/* ---------------------------------------------------------------------------------- */
/* Lámina — Ciclo de la ortosomnia (circuito de esferas clay)                          */
/* ---------------------------------------------------------------------------------- */
export function ortosomnia(p) {
  let body = clayDefs(p, { green: PAL.green, coral: PAL.coral, cream: "#F4EFD8" });
  body += `<defs><marker id="${p}-arr" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L10,5 L0,10 z" fill="${INK}"/></marker></defs>`;
  // pantalla del reloj (sleep score)
  const dx = 98, dy = 178;
  body += sphere(p, dx, dy, 78, "cream", "#F4EFD8");
  body += T(dx, dy - 30, "SLEEP SCORE", { cls: "m", anchor: "middle", size: 11.5 }) + T(dx, dy + 18, "62", { cls: "h", anchor: "middle", size: 50, fill: PAL.coral === "" ? INK : "#B8300F" }) + T(dx, dy + 42, "«Dormí fatal»", { cls: "d", anchor: "middle", size: 12 });
  const steps = [
    [1, "1 · MEDIR", 244, 112, "green", 112],
    [2, "2 · EVALUAR", 478, 112, "green", 126],
    [3, "3 · PREOCUPARSE", 712, 112, "coral", 168],
    [4, "4 · INTENTAR CONTROLAR", 712, 262, "coral", 214],
    [5, "5 · DORMIR PEOR", 478, 262, "coral", 150],
    [6, "6 · VOLVER A MEDIR", 244, 262, "green", 178],
  ];
  const arrow = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none" marker-end="url(#${p}-arr)"/>`;
  body += arrow(244 + 32, 112, 478 - 36, 112) + arrow(478 + 32, 112, 712 - 36, 112) + arrow(712, 112 + 32, 712, 262 - 38);
  body += arrow(712 - 32, 262, 478 + 36, 262) + arrow(478 - 32, 262, 244 + 36, 262) + arrow(244, 262 - 32, 244, 112 + 38);
  steps.forEach(([n, t, x, y, col, w]) => {
    const c = PAL[col], top = y < 180;
    const py = top ? y - 74 : y + 38;
    body += card(x - w / 2, py, w, 30, { fill: light(c, 0.7), sh: 4, r: 8 });
    body += T(x, py + 20, t, { cls: "h", anchor: "middle", size: 12.5 });
    body += sphere(p, x, y, 27, col, c) + T(x, y + 6, String(n), { cls: "h", anchor: "middle", size: 18, fill: INK });
  });
  return svgOpen("0 0 920 346", "Lámina 7 — El ciclo de la ortosomnia en seis pasos: medir, evaluar, preocuparse, intentar controlar, dormir peor y volver a medir") + body + "</svg>";
}

/* ---------------------------------------------------------------------------------- */
/* Lámina — Macronutrientes: pastel 3D y tres pilares                                  */
/* ---------------------------------------------------------------------------------- */
export function macros(p) {
  let body = clayDefs(p, { y: PAL.yellow, c: PAL.coral, b: PAL.blue, g: PAL.green, cream: "#F4EFD8" });
  const cx = 318, cy = 138, rx = 112, ry = 66, d = 26;
  const pt = (a, off = 0) => [cx + rx * Math.cos(a), cy + off + ry * Math.sin(a)];
  const sec = (a0, a1, off = 0) => {
    const [x0, y0] = pt(a0, off), [x1, y1] = pt(a1, off);
    return `M${cx} ${cy + off} L${x0.toFixed(1)} ${y0.toFixed(1)} A${rx} ${ry} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`;
  };
  const PI = Math.PI;
  body += ground(p, cx + 14, cy + ry + d + 6, rx + 24, 14, 0.35);
  // paredes (mitad inferior)
  const wall = (a0, a1, col) => {
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    return `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} V${(y0 + d).toFixed(1)} A${rx} ${ry} 0 0 1 ${x1.toFixed(1)} ${(y1 + d).toFixed(1)} V${y1.toFixed(1)} A${rx} ${ry} 0 0 0 ${x0.toFixed(1)} ${y0.toFixed(1)} Z" fill="${dark(col, 0.42)}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  body += wall(0, PI / 2, PAL.blue) + wall(PI / 2, PI, PAL.green);
  // sectores: fibras (arriba-izq), carbohidratos (arriba-der), proteínas (abajo-der), grasas (abajo-izq)
  const S = [
    [PI, 1.5 * PI, "y"], [1.5 * PI, 2 * PI, "c"], [0, PI / 2, "b"], [PI / 2, PI, "g"],
  ];
  for (const [a0, a1, k] of S) body += `<path d="${sec(a0, a1)}" fill="url(#${p}-t-${k})" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
  body += `<ellipse cx="${cx}" cy="${cy}" rx="44" ry="24" fill="url(#${p}-t-cream)" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(cx, cy - 1, "EQUILIBRIO", { cls: "h", anchor: "middle", size: 12 }) + T(cx, cy + 13, "4 GRUPOS", { cls: "m cl", anchor: "middle", size: 10.5 });
  body += T(cx, 18, "EL PLATO DEL BUEN COMER", { cls: "h", anchor: "middle", size: 13, fill: "#0A7A4B" });
  // rótulos
  const lab = (x, y, a, t1, t2, c) => T(x, y, t1, { cls: "h", anchor: a, size: 14, fill: c }) + T(x, y + 16, t2, { cls: "d", anchor: a, size: 11.5 });
  body += lab(196, 76, "end", "Fibras", "frutas · vegetales y digestión", "#7A5300");
  body += lab(196, 190, "end", "Grasas buenas", "absorción de vitaminas y hormonas", "#0A7A4B");
  body += lab(446, 76, "start", "Carbohidratos", "4 cal/g · glucosa · energía", "#B8300F");
  body += lab(446, 190, "start", "Proteínas", "8 funciones · triptófano", "#2B3E8F");
  // tres pilares
  const px = 640, pw = 268;
  body += T(px + pw / 2, 18, "LOS TRES PILARES NUTRICIONALES", { cls: "h", anchor: "middle", size: 13, fill: "#B8300F" });
  const P = [
    ["1", "ENERGÍA", ["Base calórica total · balance entre", "gasto basal y actividad"], "coral"],
    ["2", "MACRONUTRIENTES", ["Distribución inteligente · proteína,", "grasas y carbohidratos"], "blue"],
    ["3", "MICRONUTRIENTES", ["Vitaminas, minerales y antioxidantes", "para la fisiología"], "yellow"],
  ];
  P.forEach(([n, t, ds, col], i) => {
    const y = 34 + i * 70;
    body += card(px, y, pw, 60, { sh: 4, r: 10 });
    body += `<circle cx="${px + 24}" cy="${y + 30}" r="15" fill="${PAL[{ coral: "coral", blue: "blue", yellow: "yellow" }[col]]}" stroke="${INK}" stroke-width="2.5"/>` + T(px + 24, y + 36, n, { cls: "h", anchor: "middle", size: 15, fill: INK });
    body += T(px + 48, y + 22, `${t}`, { cls: "h", size: 13 }) + T(px + 48, y + 39, ds[0], { cls: "d", size: 10.8 }) + T(px + 48, y + 52, ds[1], { cls: "d", size: 10.8 });
  });
  body += `<rect x="${px}" y="250" width="${pw}" height="52" rx="10" fill="#FFF0A0" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(px + pw / 2, 270, "NUTRICIÓN + ACTIVIDAD + HIDRATACIÓN", { cls: "h", anchor: "middle", size: 11.5 }) + T(px + pw / 2, 288, "Sin restricciones · Sin remordimientos · Sin ciclos tóxicos", { cls: "d", anchor: "middle", size: 10.8 });
  return svgOpen("0 0 920 312", "Lámina 8 — Macronutrientes completos y los tres pilares nutricionales") + body + "</svg>";
}

/* ---------------------------------------------------------------------------------- */
/* Lámina — Las ocho inteligencias de Gardner (rueda de esferas clay)                   */
/* ---------------------------------------------------------------------------------- */
export function gardner(p) {
  const names = ["LINGÜÍSTICA", "LÓGICO-MATEMÁTICA", "ESPACIAL", "MUSICAL", "CORPORAL-CINESTÉSICA", "INTERPERSONAL", "INTRAPERSONAL", "NATURALISTA"];
  const cols = ["yellow", "coral", "blue", "green", "lilac", "yellow", "coral", "blue"];
  let body = clayDefs(p, { yellow: PAL.yellow, coral: PAL.coral, blue: PAL.blue, green: PAL.green, lilac: PAL.lilac, cream: "#F4EFD8" });
  const cx = 460, cy = 176, Rx = 218, Ry = 100;
  const pos = names.map((_, i) => { const a = (-90 + i * 45) * Math.PI / 180; return [cx + Rx * Math.cos(a), cy + Ry * Math.sin(a)]; });
  pos.forEach(([x, y]) => (body += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${INK}" stroke-width="2.5" stroke-dasharray="6 5" opacity=".5"/>`));
  body += sphere(p, cx, cy, 66, "cream", "#F4EFD8");
  body += T(cx, cy - 12, "¿De qué", { cls: "h", anchor: "middle", size: 15 }) + T(cx, cy + 5, "maneras soy", { cls: "h", anchor: "middle", size: 15 }) + T(cx, cy + 24, "INTELIGENTE?", { cls: "h cl", anchor: "middle", size: 14.5 });
  names.forEach((nm, i) => {
    const [x, y] = pos[i], c = PAL[cols[i]];
    const label = `${String(i + 1).padStart(2, "0")} · ${nm}`;
    const w = label.length * 7.9 + 26;
    body += sphere(p, x, y, 24, cols[i], c) + T(x, y + 5, String(i + 1).padStart(2, "0"), { cls: "h", anchor: "middle", size: 14, fill: INK });
    let lx, ly;
    if (i === 0) { lx = x - w / 2; ly = y - 24 - 36; }
    else if (i === 4) { lx = x - w / 2; ly = y + 24 + 8; }
    else if (i < 4) { lx = x + 34; ly = y - 15; }
    else { lx = x - 34 - w; ly = y - 15; }
    body += card(lx, ly, w, 30, { sh: 4, r: 8 }) + T(lx + w / 2, ly + 20, label, { cls: "h", anchor: "middle", size: 12.5 });
  });
  body += `<rect x="20" y="354" width="880" height="34" rx="10" fill="#FFD6CC" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(460, 376, "CUIDADO DE EVALUACIÓN: LA «INTELIGENCIA EMOCIONAL» NO ESTÁ EN ESTA LISTA · LO MÁS CERCANO SON INTERPERSONAL E INTRAPERSONAL", { cls: "h", anchor: "middle", size: 10.8 });
  return svgOpen("0 0 920 398", "Lámina 9 — Las ocho inteligencias múltiples de Howard Gardner") + body + "</svg>";
}



/* ---------------------------------------------------------------------------------- */
/* Repaso 2 — Lámina 1: los tres cerebros (cúpulas clay anidadas)                       */
/* ---------------------------------------------------------------------------------- */
export function cerebros(p) {
  let body = clayDefs(p, { green: PAL.green, coral: PAL.coral, deep: "#FF8A6E" });
  const cx = 176;
  body += ground(p, cx + 10, 252, 140, 10, 0.3);
  body += `<ellipse cx="${cx}" cy="134" rx="152" ry="116" fill="url(#${p}-s-green)" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<ellipse cx="${cx - 52}" cy="64" rx="40" ry="14" fill="#fff" opacity=".45" transform="rotate(-20 ${cx - 52} 64)"/>`;
  body += `<ellipse cx="${cx}" cy="150" rx="102" ry="74" fill="url(#${p}-s-coral)" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<ellipse cx="${cx - 34}" cy="104" rx="26" ry="9" fill="#fff" opacity=".4" transform="rotate(-20 ${cx - 34} 104)"/>`;
  body += `<ellipse cx="${cx}" cy="166" rx="46" ry="32" fill="url(#${p}-s-deep)" stroke="${INK}" stroke-width="2.5"/>`;
  const rows = [[3, 38, "3 · NEOCÓRTEX"], [2, 98, "2 · SISTEMA LÍMBICO"], [1, 166, "1 · REPTILIANO"]];
  rows.forEach(([n, y, t]) => {
    body += `<line x1="${cx + 22}" y1="${y}" x2="372" y2="${y}" stroke="${INK}" stroke-width="2.5"/>`;
    body += `<circle cx="${cx}" cy="${y}" r="14" fill="${PAL.yellow}" stroke="${INK}" stroke-width="2.5"/>` + T(cx, y + 5, String(n), { cls: "h", anchor: "middle", size: 14, fill: INK });
    body += card(372, y - 17, 250, 34, { sh: 4, r: 8 }) + T(388, y + 5, t, { cls: "h", size: 14 });
  });
  const br = (y1, y2) => `<path d="M650 ${y1} H664 V${y2} H650" stroke="${INK}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  body += br(26, 50) + br(86, 178);
  body += T(678, 44, "CEREBRO RACIONAL", { cls: "h pn", size: 15 }) + T(678, 62, "neocórtex", { cls: "d", size: 13 });
  body += T(678, 126, "CEREBRO EMOCIONAL", { cls: "h cl", size: 15 }) + T(678, 144, "reptiliano + sistema límbico", { cls: "d", size: 13 });
  body += T(26, 292, "Esquema simplificado de la lámina de clase: no es una representación anatómica exacta.", { cls: "m", size: 11.5 });
  return svgOpen("0 0 920 302", "Lámina 1 — Los tres cerebros: reptiliano y sistema límbico forman el cerebro emocional; el neocórtex es el cerebro racional") + body + "</svg>";
}

/* ---------------------------------------------------------------------------------- */
/* Repaso 2 — Láminas 2 y 6: cinco columnas clay con ficha                              */
/* ---------------------------------------------------------------------------------- */
function columnas5(p, titulo, items, label) {
  const cols = ["yellow", "coral", "blue", "green", "lilac"];
  let body = clayDefs(p, { yellow: PAL.yellow, coral: PAL.coral, blue: PAL.blue, green: PAL.green, lilac: PAL.lilac, stone: PAL.stone });
  body += `<rect x="20" y="2" width="880" height="36" rx="10" fill="#FFF0A0" stroke="${INK}" stroke-width="2.5"/>` + T(460, 26, titulo, { cls: "h", anchor: "middle", size: 14.5 });
  // losa
  body += `<rect x="30" y="120" width="870" height="22" rx="9" fill="${dark(PAL.stone, 0.5)}" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<rect x="20" y="110" width="870" height="22" rx="9" fill="url(#${p}-f-stone)" stroke="${INK}" stroke-width="2.5"/><path d="M34 116 H876" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
  const maxLines = Math.max(...items.map((i) => i.lines.length));
  const ch = 52 + maxLines * 17;
  items.forEach((it, i) => {
    const cx = 108 + i * 176, c = PAL[cols[i]];
    body += cylinder(p, cx, 52, 64, 52, cols[i], c, 13);
    body += T(cx, 90, String(i + 1), { cls: "h", anchor: "middle", size: 22, fill: INK });
    body += card(cx - 80, 156, 160, ch, { sh: 5, r: 12 });
    body += `<rect x="${cx - 80 + 1.25}" y="157.25" width="157.5" height="30" rx="10.5" fill="${light(c, 0.7)}"/>`;
    body += T(cx, 177, it.t, { cls: "h cl", anchor: "middle", size: 12.5 });
    it.lines.forEach((l, k) => (body += T(cx, 204 + k * 17, l, { cls: "d", anchor: "middle", size: 12.5 })));
  });
  return svgOpen(`0 0 920 ${156 + ch + 10}`, label) + body + "</svg>";
}
export function columnasEmocional(p) {
  return columnas5(p, "PILAR EMOCIONAL · CINCO HABILIDADES DE LA CLASE", [
    { t: "AUTOCONCIENCIA", lines: ["Reconocer y entender", "mis emociones, estado", "de ánimo e impulsos,", "y su efecto en las", "demás personas"] },
    { t: "AUTORREGULACIÓN", lines: ["Conducir o redirigir", "impulsos emocionales", "y estados de ánimo.", "Pensar antes de", "actuar"] },
    { t: "AUTOMOTIVACIÓN", lines: ["Pasión que va más", "allá del dinero y el", "status. Metas con", "energía y", "persistencia;", "posponer la", "gratificación"] },
    { t: "EMPATÍA", lines: ["Entender la", "apariencia emocional", "de los demás. Tres", "componentes:", "cognitiva, afectiva y", "somática"] },
    { t: "HABILIDADES SOCIALES", lines: ["Interactuar con éxito", "en la comunidad y", "manejar redes de", "relaciones; hallar un", "espacio común"] },
  ], "Lámina 2 — Cinco columnas: autoconciencia, autorregulación, automotivación, empatía y habilidades sociales");
}
export function columnasRelacional(p) {
  return columnas5(p, "BIENESTAR RELACIONAL · CINCO COMPONENTES", [
    { t: "1 · CALIDAD", lines: ["Profundidad y", "autenticidad:", "sentirse comprendido", "y valorado. Importa", "la calidad, no solo", "la cantidad"] },
    { t: "2 · APOYO SOCIAL", lines: ["Personas que ofrecen", "apoyo emocional,", "consejo y ayuda;", "amortigua el estrés"] },
    { t: "3 · COMUNICACIÓN", lines: ["Asertiva y empática:", "expresar con claridad", "y respeto, y escuchar", "para comprender"] },
    { t: "4 · HÁBITOS", lines: ["Influencia en", "comportamientos", "saludables: hábitos y", "estados de ánimo se", "«contagian»"] },
    { t: "5 · LÍMITES", lines: ["Establecer y respetar", "límites personales:", "vital para relaciones", "equilibradas (Parte", "II)"] },
  ], "Lámina 6 — Cinco columnas del bienestar relacional: calidad, apoyo social, comunicación, hábitos y límites");
}



/* ---------------------------------------------------------------------------------- */
/* Utilidades extra                                                                     */
/* ---------------------------------------------------------------------------------- */
/** Bloque isométrico (cuboide) con caras frontal, superior y lateral. */
export function cuboid(p, x, y, w, h, d, name, c) {
  const dx = d, dy = d * 0.55;
  return (
    ground(p, x + w / 2 + dx / 2, y + h + 4, w * 0.62, 7, 0.28) +
    `<polygon points="${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}" fill="${dark(c, 0.34)}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<polygon points="${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}" fill="url(#${p}-t-${name})" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${p}-f-${name})" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
    `<path d="M${x + 10} ${y + 6} H${x + w - 10}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".55"/>`
  );
}
/** Tubo clay (trazo grueso con contorno y brillo). */
export const tube = (d, c, w = 14, dash = "") =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 6}" stroke-linecap="round" stroke-linejoin="round"${dash}/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash}/><path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".45" transform="translate(-1 -3)"${dash}/>`;
const arrowHead = (x, y, c, s = 15) => `<polygon points="${x},${y - s} ${x + s * 1.5},${y} ${x},${y + s}" fill="${c}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
const chip = (cx, y, w, text, fill, size = 11) => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="22" rx="11" fill="${fill}" stroke="${INK}" stroke-width="2"/>` + T(cx, y + 15.5, text, { cls: "h", anchor: "middle", size, fill: INK });

/* ---------------------------------------------------------------------------------- */
export function continuo(p) {
  let body = clayDefs(p, { gray: "#9AA0B5", green: PAL.green, blue: PAL.blue, coral: PAL.coral });
  const B = [
    [34, 84, "gray", "ENFERMEDAD", "la energía se va en repararlo", "pérdida de capacidad física"],
    [338, 118, "green", "BIENESTAR", "indicadores en rango óptimo", "+ energía para el día a día"],
    [642, 152, "blue", "FITNESS", "capacidad de sobra ante la vida", "reserva funcional / vitalidad"],
  ];
  body += T(460, 18, "LA SALUD ES UN CONTINUO DINÁMICO · NO SOLO AUSENCIA DE ENFERMEDAD", { cls: "h cl", anchor: "middle", size: 14 });
  B.forEach(([x, h, n, t, d1, d2]) => {
    const y = 214 - h;
    body += cuboid(p, x, y, 230, h, 34, n, PAL[n] || "#9AA0B5");
    body += T(x + 115, y + 28, t, { cls: "h", anchor: "middle", size: 17 }) + T(x + 115, y + 48, d1, { cls: "d", anchor: "middle", size: 12.5, fill: INK }) + T(x + 115, y + 64, d2, { cls: "m", anchor: "middle", size: 11, fill: INK });
  });
  body += tube("M40 242 H850", PAL.coral, 10) + arrowHead(850, 242, PAL.coral, 16);
  body += `<rect x="20" y="272" width="880" height="34" rx="10" fill="#FFF0A0" stroke="${INK}" stroke-width="2.5"/>` + T(460, 294, "FITNESS NO ES UNA CATEGORÍA ESTÉTICA · ES LA CAPACIDAD DE TU CUERPO Y HACIA DÓNDE TE MUEVES EN EL CONTINUO", { cls: "h cl", anchor: "middle", size: 11.5 });
  return svgOpen("0 0 920 316", "Lámina 4 — Continuo de la salud: enfermedad, bienestar, fitness") + body + "</svg>";
}

export function sueno(p) {
  let body = clayDefs(p, { coral: "#FF7A5C", green: PAL.green, deep: "#1FA36A", blue: PAL.blue, yellow: PAL.yellow });
  body += T(460, 18, "ARQUITECTURA DEL SUEÑO · HIPNOGRAMA DE CICLOS NOCTURNOS (90 MIN)", { cls: "h", anchor: "middle", size: 14 });
  const lv = [["VIGILIA", 84], ["LIGERO", 128], ["REM", 172], ["PROFUNDO", 216]];
  lv.forEach(([t, y]) => { body += `<line x1="92" y1="${y}" x2="880" y2="${y}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 6" opacity=".35"/>` + T(84, y + 4, t, { cls: "m", anchor: "end", size: 11 }); });
  body += T(98, 46, "Vigilia & NREM 1–2 · Transición y memoria a corto plazo", { cls: "d", size: 12 });
  body += T(480, 66, "NREM 3 · Ondas Delta · Hormona de crecimiento", { cls: "d", anchor: "middle", size: 12 });
  body += T(880, 46, "REM · Memoria a largo plazo & emociones", { cls: "d", anchor: "end", size: 12 });
  body += tube("M100 84 H210 C246 84 252 128 290 128", "#FF7A5C", 14);
  body += tube("M290 128 C326 128 336 216 384 216 C430 216 440 128 480 128", PAL.green, 14);
  body += tube("M480 128 C520 128 530 216 576 216 C620 216 630 172 676 172", "#1FA36A", 14);
  body += tube("M676 172 C720 172 730 128 780 128 C822 128 842 84 874 84", PAL.yellow, 14);
  [[210, 84, "coral", "#FF7A5C"], [384, 216, "green", PAL.green], [576, 216, "deep", "#1FA36A"], [676, 172, "yellow", PAL.yellow]].forEach(([x, y, n, c]) => (body += sphere(p, x, y, 13, n, c)));
  const L = [[26, "VIGILIA", "alerta & ondas beta/alfa", "#FF7A5C"], [246, "SUEÑO LIGERO (NREM 1–2)", "baja ritmo cardíaco · memoria corta", PAL.green], [466, "SUEÑO PROFUNDO (NREM 3)", "reparación celular · H. crecimiento", "#1FA36A"], [686, "SUEÑO REM", "sueños vívidos · consolidación", PAL.yellow]];
  L.forEach(([x, t, d, c]) => {
    body += card(x - 4, 252, 208, 50, { sh: 4, r: 10 }) + `<circle cx="${x + 12}" cy="277" r="7" fill="${c}" stroke="${INK}" stroke-width="2"/>`;
    body += T(x + 26, 272, t, { cls: "h", size: 11.5 }) + T(x + 26, 289, d, { cls: "d", size: 10.4 });
  });
  return svgOpen("0 0 920 312", "Lámina 6 — Curva de los ciclos del sueño: vigilia, ligero, profundo y REM") + body + "</svg>";
}

export function marcos(p) {
  let body = clayDefs(p, { blue: PAL.blue, coral: PAL.coral, yellow: PAL.yellow, green: PAL.green, lilac: PAL.lilac, stone: PAL.stone });
  body += T(210, 16, "BT I — RENOVACIÓN · CUATRO DIMENSIONES", { cls: "h cl", anchor: "middle", size: 14 });
  const dims = [["FÍSICA", "cuerpo, energía, vitalidad y descanso", "green"], ["MENTAL", "lectura, intelecto, escritura y claridad", "blue"], ["SOCIO-EMOCIONAL", "vínculos interpersonales, empatía y calma", "coral"], ["ESPIRITUAL", "sentido, valores rectores y trascendencia", "lilac"]];
  dims.forEach(([t, d, n], i) => {
    const y = 32 + i * 62;
    body += card(20, y, 380, 52, { sh: 4, r: 12 }) + sphere(p, 52, y + 26, 18, n, PAL[n]) + T(52, y + 31, String(i + 1).padStart(2, "0"), { cls: "h", anchor: "middle", size: 12.5, fill: INK });
    body += T(82, y + 22, t, { cls: "h", size: 14 }) + T(82, y + 40, d, { cls: "d", size: 12 });
  });
  body += sphere(p, 440, 156, 22, "coral", PAL.coral) + T(440, 161, "VS", { cls: "h", anchor: "middle", size: 14, fill: INK });
  body += T(692, 16, "BT II — MODELO PERMA · 5 PILARES MONUMENTALES", { cls: "h cl", anchor: "middle", size: 14 });
  const P = [["P", "Emociones", "positivas", "yellow"], ["E", "Compromiso", "(flow / tarea)", "coral"], ["R", "Relaciones", "sanas", "blue"], ["M", "Propósito", "significado", "green"], ["A", "Logro", "metas cumplidas", "lilac"]];
  body += `<rect x="492" y="166" width="402" height="20" rx="8" fill="${dark(PAL.stone, 0.5)}" stroke="${INK}" stroke-width="2.5"/><rect x="482" y="157" width="402" height="20" rx="8" fill="url(#${p}-f-stone)" stroke="${INK}" stroke-width="2.5"/>`;
  P.forEach(([l, a, b, n], i) => {
    const cx = 526 + i * 80;
    body += cylinder(p, cx, 44, 50, 98, n, PAL[n], 11) + T(cx, 106, l, { cls: "h", anchor: "middle", size: 28, fill: INK });
    body += T(cx, 200, a, { cls: "h", anchor: "middle", size: 12 }) + T(cx, 214, b, { cls: "d", anchor: "middle", size: 10.5 });
  });
  body += `<rect x="482" y="232" width="412" height="34" rx="10" fill="#FFF0A0" stroke="${INK}" stroke-width="2.5"/>` + T(688, 254, "EL ACRÓNIMO PERMA VIENE DEL INGLÉS · LOS 5 ELEMENTOS SE ESTUDIAN EN ESPAÑOL", { cls: "h cl", anchor: "middle", size: 10 });
  return svgOpen("0 0 920 278", "Lámina 1 — Marcos previos: BT I (renovación) y BT II (modelo PERMA)") + body + "</svg>";
}

export function puente(p) {
  let body = clayDefs(p, { green: PAL.green, blue: PAL.blue, coral: PAL.coral });
  const side = (x, title, unit, items, n, tint) => {
    let b = card(x, 8, 290, 214, { sh: 5, r: 14, fill: tint });
    b += T(x + 145, 38, title, { cls: "h", anchor: "middle", size: 16 }) + chip(x + 145, 48, 86, unit, PAL[n]);
    items.forEach((it, i) => { const y = 88 + i * 42; b += card(x + 16, y, 258, 34, { sh: 3, r: 9 }) + sphere(p, x + 36, y + 17, 11, n, PAL[n]) + T(x + 56, y + 22, it, { cls: "h", size: 12.5 }); });
    return b;
  };
  body += side(20, "PILAR FÍSICO", "UNIDAD II", ["EJERCICIO", "SUEÑO", "ALIMENTACIÓN"], "green", "#E6FAF1");
  body += side(610, "PILAR INTELECTUAL", "UNIDAD III", ["CONCENTRACIÓN", "MEMORIA", "FUNCIÓN COGNITIVA"], "blue", "#E7EDFF");
  const L = [["↑ dopamina · serotonina ·", "norepinefrina · oxigenación cerebral"], ["consolidación de la memoria &", "regeneración neuronal"], ["glucosa estable & nutrientes para", "el funcionamiento cognitivo"]];
  L.forEach(([a, b], i) => {
    const y = 105 + i * 42;
    body += tube(`M312 ${y} H588`, PAL.coral, 8) + arrowHead(588, y, PAL.coral, 11);
    body += card(346, y - 17, 218, 34, { sh: 3, r: 9, fill: "#FFF8E0" }) + T(455, y - 2, a, { cls: "h", anchor: "middle", size: 10.2 }) + T(455, y + 11, b, { cls: "h", anchor: "middle", size: 10.2 });
  });
  return svgOpen("0 0 920 236", "Lámina 10 — Conexión cuerpo–mente: ejercicio, sueño y alimentación") + body + "</svg>";
}

/* ---- Repaso 2 ---- */
export function amigdala(p) {
  let body = clayDefs(p, { red: "#E5472C", amber: "#F2A900", green: "#14A36A", coral: PAL.coral, green2: PAL.green });
  const C = [
    ["ESTÍMULO", ["Una amenaza percibida", "u otro estímulo", "emocional"], "#fff"],
    ["AMÍGDALA", ["Responde primero:", "recibe las señales", "sensoriales antes que", "el neocórtex"], "#FFD6CC"],
    ["HORMONAS", ["Se liberan hormonas", "del estrés", "(adrenalina): «lucha o", "huida»"], "#FFD6CC"],
    ["NEOCÓRTEX BLOQUEADO", ["Reacción impulsiva y,", "a menudo, irracional"], "#FF9C80"],
  ];
  C.forEach(([t, ls, f], i) => {
    const x = 20 + i * 226;
    body += card(x, 8, 200, 122, { sh: 5, r: 12, fill: f }) + T(x + 100, 34, t, { cls: "h cl", anchor: "middle", size: i === 3 ? 11.5 : 13.5 });
    ls.forEach((l, k) => (body += T(x + 100, 58 + k * 17, l, { cls: "d", anchor: "middle", size: 12, fill: INK })));
    if (i < 3) body += arrowHead(x + 205, 69, PAL.coral, 11);
  });
  body += T(900, 150, "Ira explosiva · miedo intenso · pánico", { cls: "m", anchor: "end", size: 11.5 });
  body += T(20, 182, "CÓMO EVITARLO", { cls: "h pn", size: 14 });
  ["1 · Observar detonantes", "2 · Encontrar un modelo", "3 · Notar señales del cuerpo"].forEach((t, i) => {
    const x = 20 + i * 300;
    body += card(x, 194, 280, 40, { sh: 4, r: 10, fill: "#C8F3DE" }) + T(x + 140, 219, t, { cls: "t", anchor: "middle", size: 13.5 });
  });
  body += T(20, 266, "4 · Hacer cortocircuito: «Lo pensaré»", { cls: "h", size: 14 });
  [["Rojo", "Cálmate", "red", "#E5472C", 52], ["Amarillo", "Evaluar opciones", "amber", "#F2A900", 322], ["Verde", "Probar opciones", "green", "#14A36A", 592]].forEach(([a, b, n, c, x]) => {
    body += sphere(p, x, 298, 20, n, c) + T(x + 32, 294, a, { cls: "h", size: 14 }) + T(x + 32, 312, b, { cls: "d", size: 12.5 });
  });
  body += T(878, 296, "5 · Repetir", { cls: "h cl", anchor: "end", size: 14 });
  body += tube("M796 312 C826 326 862 326 884 308", PAL.coral, 6) + arrowHead(884, 308, PAL.coral, 9);
  return svgOpen("0 0 920 338", "Lámina 4 — Secuestro de la amígdala: estímulo, amígdala, hormonas y reacción impulsiva; y cómo evitarlo con el semáforo") + body + "</svg>";
}

export function cifras(p) {
  let body = clayDefs(p, { yellow: PAL.yellow, green: PAL.green, coral: PAL.coral, lilac: PAL.lilac });
  const D = [
    ["1938", "Harvard Study of Adult Development", ["La satisfacción con las", "relaciones a los 50 años", "predijo la salud a los 80", "mejor que el colesterol"], ["Waldinger & Schulz (2023)"], "yellow"],
    ["+50%", "Probabilidad de supervivencia", ["Más probabilidad de", "supervivencia con", "relaciones sociales", "fuertes: 148 estudios,", "308 849 personas"], ["Holt-Lunstad, Smith & Layton", "(2010)"], "green"],
    ["47 %", "Bebés prematuros", ["Más peso con tres", "sesiones diarias de 15", "min de terapia de", "contacto durante 5–10", "días"], ["Field et al. (1986) · Keltner", "(2010)"], "coral"],
    ["×2", "Pareja y mejor amigo/a", ["El efecto sobre la", "satisfacción vital se", "duplica cuando la pareja", "es también tu mejor", "amigo/a"], ["Helliwell & Grover (2014)"], "lilac"],
  ];
  D.forEach(([big, t, ls, src, n], i) => {
    const x = 20 + i * 226, c = PAL[n];
    body += card(x, 56, 200, 244, { sh: 5, r: 14 });
    body += `<path d="M${x + 1.25} 106 V70 Q${x + 1.25} 57.25 ${x + 15} 57.25 H${x + 185} Q${x + 198.75} 57.25 ${x + 198.75} 70 V106 Z" fill="${light(c, 0.78)}"/>`;
    body += sphere(p, x + 100, 54, 44, n, c) + T(x + 100, 64, big, { cls: "h", anchor: "middle", size: 26, fill: INK });
    body += T(x + 100, 128, t, { cls: "h", anchor: "middle", size: t.length > 28 ? 11.3 : 13 });
    ls.forEach((l, k) => (body += T(x + 100, 160 + k * 18, l, { cls: "d", anchor: "middle", size: 12 })));
    src.forEach((l, k) => (body += T(x + 100, 262 + k * 14, l, { cls: "m", anchor: "middle", size: 10.2 })));
  });
  return svgOpen("0 0 920 314", "Lámina 5 — Cuatro cifras de la evidencia: Harvard 1938, +50% de supervivencia, 47% más peso en bebés y efecto doble en pareja") + body + "</svg>";
}

export function redApoyo(p) {
  let body = clayDefs(p, { lilac: PAL.lilac, green: PAL.green, yellow: PAL.yellow, coral: PAL.coral, blue: PAL.blue, cream: "#F4EFD8" });
  const cx = 172, cy = 176;
  body += ground(p, cx + 8, 330, 150, 12, 0.3);
  body += `<circle cx="${cx}" cy="${cy}" r="150" fill="url(#${p}-s-lilac)" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<circle cx="${cx}" cy="${cy + 20}" r="100" fill="url(#${p}-s-green)" stroke="${INK}" stroke-width="2.5"/>`;
  body += `<circle cx="${cx}" cy="${cy + 38}" r="54" fill="url(#${p}-s-yellow)" stroke="${INK}" stroke-width="2.5"/>`;
  body += T(cx, 56, "COMUNIDAD", { cls: "h", anchor: "middle", size: 14 }) + T(cx, 130, "CERCANOS", { cls: "h", anchor: "middle", size: 14 });
  body += T(cx, cy + 34, "NÚCLEO", { cls: "h cl", anchor: "middle", size: 14 }) + T(cx, cy + 50, "a quien llamarías", { cls: "d", anchor: "middle", size: 11, fill: INK }) + T(cx, cy + 63, "a las 3 a.m.", { cls: "d", anchor: "middle", size: 11, fill: INK });
  const K = [
    [346, 8, "E", "EMOCIONAL", "coral", ["Te escucha, te cuida, te hace", "sentir querido/a."], ["Se quedó conmigo cuando lloré"]],
    [626, 8, "I", "INSTRUMENTAL", "blue", ["Ayuda concreta: tiempo, dinero,", "tareas."], ["Me prestó sus apuntes y me llevó", "al médico"]],
    [346, 176, "Inf", "INFORMATIVO", "green", ["Consejo, orientación, otra", "perspectiva."], ["Me recomendó a un especialista"]],
    [626, 176, "V", "VALORACIÓN", "yellow", ["Te devuelve quién eres: reconoce", "y afirma."], ["Me dijo «tú puedes con esto»"]],
  ];
  K.forEach(([x, y, l, t, n, ds, ex]) => {
    body += card(x, y, 268, 156, { sh: 5, r: 12 });
    body += sphere(p, x + 30, y + 30, 20, n, PAL[n]) + T(x + 30, y + 36, l, { cls: "h", anchor: "middle", size: l.length > 1 ? 12 : 17, fill: INK });
    body += T(x + 58, y + 36, t, { cls: "h cl", size: 14 });
    ds.forEach((d, k) => (body += T(x + 16, y + 68 + k * 17, d, { cls: "d", size: 12.2 })));
    body += T(x + 16, y + 112, "Ejemplo", { cls: "m", size: 10.5 });
    ex.forEach((d, k) => (body += T(x + 16, y + 129 + k * 16, d, { cls: "t", size: 12.2 })));
  });
  return svgOpen("0 0 920 348", "Lámina 7 — Mapa de la red de apoyo en tres anillos (núcleo, cercanos, comunidad) y los cuatro tipos de apoyo social") + body + "</svg>";
}

export function cicloTox(p) {
  let body = clayDefs(p, { yellow: PAL.yellow, coral: PAL.coral, red: "#E5472C" });
  const C = [
    ["LUNA DE MIEL", ["Inicio de estrategias de", "manipulación y falso", "arrepentimiento."], "#FFF0A0", "yellow", "1"],
    ["TENSIÓN", ["Escalada gradual de irritabilidad.", "Discusiones donde aparece la", "violencia verbal."], "#FFD6CC", "coral", "2"],
    ["AGRESIÓN", ["Estalla la violencia. Suele ser la", "fase donde se pide ayuda."], "#FF9C80", "red", "3"],
  ];
  C.forEach(([t, ls, f, n, num], i) => {
    const x = 20 + i * 302;
    body += card(x, 20, 276, 128, { sh: 5, r: 14, fill: f });
    body += sphere(p, x + 30, 20, 22, n, n === "red" ? "#E5472C" : PAL[n]) + T(x + 30, 26, num, { cls: "h", anchor: "middle", size: 17, fill: INK });
    body += T(x + 138, 54, t, { cls: "h", anchor: "middle", size: 17 });
    ls.forEach((l, k) => (body += T(x + 138, 80 + k * 19, l, { cls: "d", anchor: "middle", size: 12.5, fill: INK })));
    if (i < 2) body += arrowHead(x + 280, 84, PAL.coral, 11);
  });
  body += tube("M780 156 C780 236 160 236 160 164", PAL.coral, 7, ' stroke-dasharray="1 14"') + arrowHead(160, 158, PAL.coral, 0).replace(/points="[^"]*"/, 'points="144,166 160,148 176,166"');
  body += T(460, 244, "el ciclo vuelve a empezar", { cls: "h", anchor: "middle", size: 13 });
  body += T(460, 274, "Ciclo de la violencia de género (Leonor Walker), tal como lo presenta la diapositiva.", { cls: "m", anchor: "middle", size: 11.5 });
  return svgOpen("0 0 920 284", "Lámina 10 — Ciclo de la violencia de género de Leonor Walker: luna de miel, tensión, agresión") + body + "</svg>";
}

export function mapaPuente(p) {
  let body = clayDefs(p, { green: PAL.green, coral: PAL.coral, yellow: PAL.yellow, stone: PAL.stone });
  const panel = (x, f, n, title, sub, d1, d2, items) => {
    let b = card(x, 8, 292, 292, { sh: 5, r: 14, fill: f });
    b += T(x + 146, 40, title, { cls: "h " + (n === "green" ? "pn" : "cl"), anchor: "middle", size: 17 }) + T(x + 146, 62, sub, { cls: "t", anchor: "middle", size: 13.5 });
    b += T(x + 146, 86, d1, { cls: "d", anchor: "middle", size: 12, fill: INK }) + T(x + 146, 102, d2, { cls: "d", anchor: "middle", size: 12, fill: INK });
    items.forEach((it, i) => { const y = 132 + i * 33; b += `<circle cx="${x + 24}" cy="${y}" r="7" fill="${PAL[n]}" stroke="${INK}" stroke-width="2"/>` + T(x + 40, y + 5, it, { cls: "t", size: 12.8 }); });
    return b;
  };
  body += panel(20, "#C8F3DE", "green", "PILAR EMOCIONAL", "Mi relación conmigo", "Reconocer, nombrar y regular lo que", "siento", ["Autoconciencia", "Autorregulación", "Automotivación", "Empatía", "Habilidades sociales"]);
  body += panel(608, "#FFD6CC", "coral", "PILAR RELACIONAL", "Mi relación con los demás", "Conectar, apoyar, comunicar y cuidar", "los vínculos", ["Calidad de las relaciones", "Apoyo social", "Comunicación asertiva y empática", "Influencia en hábitos saludables", "Establecimiento de límites"]);
  body += T(460, 34, "PUENTE", { cls: "h", anchor: "middle", size: 17 });
  body += ground(p, 466, 262, 100, 8, 0.3);
  [[390, "EMPATÍA", "yellow"], [460, "ASERTIVIDAD", "green"], [530, "APOYO", "coral"]].forEach(([x, t, n]) => {
    body += cylinder(p, x, 168, 44, 88, n, PAL[n], 10) + T(x, 282, t, { cls: "h", anchor: "middle", size: 11 });
  });
  body += tube("M388 176 Q460 96 532 176", PAL.stone, 14);
  body += T(460, 322, "Sin autorregulación no hay comunicación asertiva; sin vínculos, las emociones no tienen dónde sostenerse.", { cls: "m", anchor: "middle", size: 12 });
  return svgOpen("0 0 920 332", "Lámina 11 — Mapa comparativo: pilar emocional (relación conmigo) y pilar relacional (relación con los demás), unidos por empatía, asertividad y apoyo") + body + "</svg>";
}

export const FIGURES = { maslow, dims8, hormonas, ortosomnia, macros, gardner, cerebros, columnasEmocional, columnasRelacional, continuo, sueno, marcos, puente, amigdala, cifras, redApoyo, cicloTox, mapaPuente };

// página -> [[número de lámina, generador]]
export const FIGURE_MAP = {
  "unidad-01": [[1, "marcos"], [2, "maslow"], [3, "dims8"]],
  "unidad-02": [[4, "continuo"], [5, "hormonas"], [6, "sueno"], [7, "ortosomnia"], [8, "macros"]],
  "unidad-03": [[9, "gardner"], [10, "puente"]],
  "repaso-control-1": [[1, "marcos"], [2, "maslow"], [3, "dims8"], [4, "continuo"], [5, "hormonas"], [6, "sueno"], [7, "ortosomnia"], [8, "macros"], [9, "gardner"], [10, "puente"]],
  "repaso-control-2": [[1, "cerebros"], [2, "columnasEmocional"], [4, "amigdala"], [5, "cifras"], [6, "columnasRelacional"], [7, "redApoyo"], [10, "cicloTox"], [11, "mapaPuente"]],
};
export const FIGURE_PREFIX = { "unidad-01": "u01", "unidad-02": "u02", "unidad-03": "u03", "repaso-control-1": "rc1", "repaso-control-2": "rc2" };

