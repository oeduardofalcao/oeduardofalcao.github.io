const fs = require("fs");
const ok = (c, m) => console.log((c ? "OK  " : "FAIL") + " | " + m);

const cal = fs.readFileSync("projetos/calendario-institucional-2026.html", "utf8");
ok(cal.includes("<p>Design gráfico e diagramação.</p>"), "calendario: ponto preservado no papel");

const cartao = fs.readFileSync("projetos/cartao-do-processo.html", "utf8");
ok(cartao.includes("Cartão do Processo"), "cartao: pagina gerada");
ok(cartao.includes("destaque.jpg"), "cartao: capa real na pagina");
ok(!cartao.includes("capa.svg"), "cartao: sem placeholder svg");
ok(!cartao.includes("TODO"), "cartao: sem TODO");

for (const s of ["coletanea-industria-criativa", "garibaldi-rotas"]) {
  const h = fs.readFileSync("projetos/" + s + ".html", "utf8");
  ok(h.includes("destaque.jpg"), s + ": capa real");
  ok(!h.includes("TODO"), s + ": sem TODO");
  ok(!h.includes("capa.svg"), s + ": sem placeholder");
}

const idx = fs.readFileSync("index.html", "utf8");
ok(idx.includes("+50</b> projetos") && idx.includes("+3 anos"), "index: stats hero intactos");
const cards = (idx.match(/<img[^>]+src="[^"]+"/g) || []).join("\n");
ok(!idx.includes("capa.svg"), "index: nenhuma capa placeholder");
const projs = fs.readFileSync("projetos.html", "utf8");
ok(!projs.includes("capa.svg"), "projetos: nenhuma capa placeholder");
const est = fs.readFileSync("estudos.html", "utf8");
ok(!est.includes("capa.svg"), "estudos: nenhuma capa placeholder");

for (const e of ["zule", "mizuno-poster", "letter-gothic", "mendini-stencil", "whisper-capa"]) {
  const h = fs.readFileSync("estudos/" + e + ".html", "utf8");
  ok(h.includes("capa.jpg"), e + ": capa real");
}

const idxCovers = [...idx.matchAll(/src="(assets\/[^"]+)"/g)].map((m) => m[1]);
console.log("\ncovers na index:\n" + idxCovers.join("\n"));
